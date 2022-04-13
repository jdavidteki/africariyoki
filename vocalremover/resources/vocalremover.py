import os
import requests
from flask_restful import Resource

import cv2
import librosa
import numpy as np
import soundfile as sf
import torch
import urllib.request as urllib2
import re

from tqdm import tqdm
from bs4 import BeautifulSoup
from firebase_admin import credentials, initialize_app, storage
import firebase_admin
from pydub import AudioSegment
from pytube import YouTube

from lib import dataset
from lib import nets
from lib import spec_utils

import argparse
import os
import importlib

import cv2
import librosa
import numpy as np
import soundfile as sf
import torch
import time
import math
from tqdm import tqdm

from lib import dataset
from lib import spec_utils
from lib.model_param_init import ModelParameters

#uploadtofirebase
def uploadToFirebase(path):
  print('uploading file to firebase')
  # Init firebase with your credentials
  if not firebase_admin._apps:
    cred = credentials.Certificate("firebasecloudredentials.json")
    initialize_app(cred, {'storageBucket': 'africariyoki-4b634.appspot.com'})

  ###edited area
  #compress wav into mp3
  AudioSegment.from_wav(path+"_Instruments.wav").export(path+"_Instruments.mp3", format="mp3")
  AudioSegment.from_wav(path+"_Vocals.wav").export(path+"_Vocals.mp3", format="mp3")

  # Put your local file path
  fileName = path+"_Instruments.mp3"
  bucket = storage.bucket()
  blob = bucket.blob("music/"+path+".mp3")
  blob.upload_from_filename(fileName)
  blob.make_public()

  fileName1 = path+"_Vocals.mp3"
  blob1 = bucket.blob("vocals/"+path+".mp3")
  blob1.upload_from_filename(fileName1)
  blob1.make_public()

  print("your file url", blob.public_url, blob.make_public())
  print("your file url", blob1.public_url, blob1.make_public())
  ###edited area

  os.remove(fileName)
  os.remove(fileName1)
  os.remove(path+"_Instruments.wav")
  os.remove(path+"_Vocals.wav")

#execute
def execute(inputPath):
    nn_arch_sizes = [
      31191, # default
      33966, 123821, 537238 # custom
    ]

    model_size = math.ceil(os.stat('models/HP_4BAND_3090.pth').st_size / 1024)
    nn_architecture = '{}KB'.format(min(nn_arch_sizes, key=lambda x:abs(x-model_size)))
    model_params = 'modelparams/4band_44100.json'
    pretrained_model = 'models/HP_4BAND_3090.pth'
    gpu = 0
    window_size = 512
    chunks = 1
    aggressiveness=.07
    is_vocal_model = False
    tta=False
    postprocess=False
    high_end_process = 'mirroring'
    no_vocals = False
    output_dir = "./"
    normalize=False

    nets = importlib.import_module('lib.nets' + f'_{nn_architecture}'.replace('_{}KB'.format(nn_arch_sizes[0]), ''), package=None)

    mp = ModelParameters(model_params)
    start_time = time.time()

    print('loading model...', end=' ')

    device = torch.device('cpu')
    model = nets.CascadedASPPNet(mp.param['bins'] * 2)
    model.load_state_dict(torch.load(pretrained_model, map_location=device))
    if torch.cuda.is_available() and gpu >= 0:
        device = torch.device('cuda:{}'.format(gpu))
        model.to(device)

    print('done')

    print('loading & stft of wave source...', end=' ')

    X_spec = {}
    input_is_mono = False
    basename = os.path.splitext(os.path.basename(inputPath+".mp3"))[0]
    basenameb = '"{}"'.format(os.path.splitext(os.path.basename(inputPath+".mp3"))[0])
    bands_n = len(mp.param['band'])

    # high-end band
    bp = mp.param['band'][bands_n]
    wave, _ = librosa.load(inputPath+".mp3", bp['sr'], False, dtype=np.float32, res_type=bp['res_type'])

    if wave.ndim == 1:
        input_is_mono = True
        wave = np.asarray([wave, wave])

    if normalize:
        wave /= max(np.max(wave), abs(np.min(wave)))

    X_spec[bands_n] = spec_utils.wave_to_spectrogram(wave, bp['hl'], bp['n_fft'], mp, True)
    X_spec[bands_n] = spec_utils.convert_channels(X_spec[bands_n], mp, bands_n)

    if np.max(wave[0]) == 0.0:
        print('Empty audio file!')
        raise ValueError('Empty audio file')

    if high_end_process != 'none':
      input_high_end_h = (bp['n_fft']//2 - bp['crop_stop']) + (mp.param['pre_filter_stop'] - mp.param['pre_filter_start'])
      input_high_end = X_spec[bands_n][:, bp['n_fft']//2-input_high_end_h:bp['n_fft']//2, :]

    # lower bands
    for d in range(bands_n - 1, 0, -1):
        bp = mp.param['band'][d]

        wave = librosa.resample(wave, mp.param['band'][d+1]['sr'], bp['sr'], res_type=bp['res_type'])
        X_spec[d] = spec_utils.wave_to_spectrogram(wave, bp['hl'], bp['n_fft'], mp, True)
        X_spec[d] = spec_utils.convert_channels(X_spec[d], mp, d)

    X_spec = spec_utils.combine_spectrograms(X_spec, mp)

    print('done')

    vr = VocalRemover(model, device, window_size)

    chunk_pfx = ''
    chunk_size = X_spec.shape[2] // chunks
    chunks_filelist = {'vocals': {}, 'inst': {}}

    for chunk in range(0, chunks):
        chunk_margin_r = 0

        if chunk == 0:
            chunk_offset_m, chunk_offset, chunk_margin = 0, 0, 0
        else:
            chunk_margin = chunk_size // 100 - 1
            chunk_offset_m = chunk * chunk_size - chunk_margin - 1
            chunk_offset = chunk * chunk_size - 1

        if chunks > 1:
            chunk_pfx = f'_chunk{chunk}'
            print(f'Chunk {chunk}')

            if chunk < chunks - 1:
                chunk_margin_r = chunk_size // 100 - 1

        pd = {
            'aggr_value': aggressiveness,
            'aggr_split_bin': mp.param['band'][1]['crop_stop'],
            'aggr_correction': mp.param.get('aggr_correction'),
            'is_vocal_model': is_vocal_model
        }

        if tta:
            pred, X_mag, X_phase = vr.inference_tta(X_spec[:, :, chunk_offset_m:(chunk+1)*chunk_size+chunk_margin_r], pd)
        else:
            pred, X_mag, X_phase = vr.inference(X_spec[:, :, chunk_offset_m:(chunk+1)*chunk_size+chunk_margin_r], pd)

        if postprocess:
            print('post processing...', end=' ')
            pred_inv = np.clip(X_mag - pred, 0, np.inf)
            pred = spec_utils.mask_silence(pred, pred_inv)
            print('done')

        stems = {'inst': 'Instruments', 'vocals': 'Vocals'}
        basename_enc = basename

        print('inverse stft of {}...'.format(stems['inst']), end=' ')
        y_spec_m = (pred * X_phase)[:, :, chunk_margin:pred.shape[2]-chunk_margin_r]

        if chunks > 1:
            import hashlib

            basename_enc = hashlib.sha1(basename.encode('utf-8')).hexdigest()

            if chunk > 0: # smoothing
                y_spec_m[:, :, 0] = 0.5 * (y_spec_m[:, :, 0] + prev_chunk_edge)
            prev_chunk_edge = y_spec_m[:, :, -1]

        ffmpeg_tmp_fn = '{}_{}_inst'.format(basename_enc, time.time())

        if high_end_process == 'bypass':
            wave = spec_utils.cmb_spectrogram_to_wave_ffmpeg(y_spec_m, mp, ffmpeg_tmp_fn, input_high_end_h, input_high_end)
        elif high_end_process.startswith('mirroring'):
            input_high_end_ = spec_utils.mirroring(high_end_process, y_spec_m, input_high_end[:, :, chunk_offset:(chunk+1)*chunk_size], mp)

            wave = spec_utils.cmb_spectrogram_to_wave_ffmpeg(y_spec_m, mp, ffmpeg_tmp_fn, input_high_end_h, input_high_end_)
        else:
            wave = spec_utils.cmb_spectrogram_to_wave_ffmpeg(y_spec_m, mp, ffmpeg_tmp_fn)

        print('done')

        model_name = ''

        if input_is_mono:
            wave = wave.mean(axis=1, keepdims=True)

        fn = os.path.join(output_dir, '{}{}_{}{}.wav'.format(basename_enc, model_name, stems['inst'], chunk_pfx))
        sf.write(fn, wave, mp.param['sr'])
        chunks_filelist['inst'][chunk] = fn

        if not no_vocals:
            print('inverse stft of {}...'.format(stems['vocals']), end=' ')

            ffmpeg_tmp_fn = '{}_{}_vocals'.format(basename_enc, time.time())
            v_spec_m = X_spec[:, :, chunk_offset:(chunk+1)*chunk_size] - y_spec_m

            if high_end_process.startswith('mirroring'):
                input_high_end_ = spec_utils.mirroring(high_end_process, v_spec_m, input_high_end[:, :, chunk_offset:(chunk+1)*chunk_size], mp)

                wave = spec_utils.cmb_spectrogram_to_wave_ffmpeg(v_spec_m, mp, ffmpeg_tmp_fn, input_high_end_h, input_high_end_)
            else:
                wave = spec_utils.cmb_spectrogram_to_wave_ffmpeg(v_spec_m, mp, ffmpeg_tmp_fn)

            print('done')

            if input_is_mono:
                wave = wave.mean(axis=1, keepdims=True)

            fn = os.path.join(output_dir, '{}{}_{}{}.wav'.format(basename_enc, model_name, stems['vocals'], chunk_pfx))
            sf.write(fn, wave, mp.param['sr'])
            chunks_filelist['vocals'][chunk] = fn

    for stem in stems:
      if len(chunks_filelist[stem]) > 0 and chunks > 1:
          import subprocess

          fn = os.path.join(output_dir, '{}{}_{}.wav'.format(basename_enc, model_name, stems[stem]))
          fn2 = os.path.join(output_dir, '{}{}_{}.wav'.format(basename, model_name, stems[stem]))
          #os.system('sox "' + '" "'.join([f for f in chunks_filelist[stem].values()]) + f'" "{fn}"')
          subprocess.run(['sox'] + [f for f in chunks_filelist[stem].values()] + [fn])

          if not os.path.isfile(fn):
              print('Error: failed to create output file. Make sure that you have installed sox.')

          os.rename(fn, fn2)

          for rf in chunks_filelist[stem].values():
              os.remove(rf)


    #for file in os.scandir(ensembled_dir):
    #    os.remove(file.path)
    print('Complete!')

    print('Total time: {0:.{1}f}s'.format(time.time() - start_time, 1))

    uploadToFirebase(inputPath)


#downloadmp3fromyoutube
def downloadMp3FromYoutube(videoId):
  print('downloading song in mp3 format', videoId)
  # url = " https://yt-download.org/api/button/mp3?url=https://www.youtube.com/watch?v=" + videoId

  yt = YouTube('https://youtube.com/watch?v=' + videoId)
  yt.streams.first().download(filename= videoId + ".mp3")

  execute(videoId)


class VocalRemover(object):
    def __init__(self, model, device, window_size):
        self.model = model
        self.offset = model.offset
        self.device = device
        self.window_size = window_size

    def _execute(self, X_mag_pad, roi_size, n_window, params):
        self.model.eval()
        with torch.no_grad():
            preds = []
            for i in tqdm(range(n_window)):
                start = i * roi_size
                X_mag_window = X_mag_pad[None, :, :, start:start + self.window_size]
                X_mag_window = torch.from_numpy(X_mag_window).to(self.device)

                pred = self.model.predict(X_mag_window, params)

                pred = pred.detach().cpu().numpy()
                preds.append(pred[0])

            pred = np.concatenate(preds, axis=2)

        return pred

    def preprocess(self, X_spec):
        X_mag = np.abs(X_spec)
        X_phase = np.angle(X_spec)

        return X_mag, X_phase

    def inference(self, X_spec, params):
        X_mag, X_phase = self.preprocess(X_spec)

        coef = X_mag.max()
        X_mag_pre = X_mag / coef

        n_frame = X_mag_pre.shape[2]
        pad_l, pad_r, roi_size = dataset.make_padding(n_frame, self.window_size, self.offset)
        n_window = int(np.ceil(n_frame / roi_size))

        X_mag_pad = np.pad(X_mag_pre, ((0, 0), (0, 0), (pad_l, pad_r)), mode='constant')

        pred = self._execute(X_mag_pad, roi_size, n_window, params)
        pred = pred[:, :, :n_frame]

        return pred * coef, X_mag, np.exp(1.j * X_phase)

    def inference_tta(self, X_spec, params):
        X_mag, X_phase = self.preprocess(X_spec)

        coef = X_mag.max()
        X_mag_pre = X_mag / coef

        n_frame = X_mag_pre.shape[2]
        pad_l, pad_r, roi_size = dataset.make_padding(n_frame, self.window_size, self.offset)
        n_window = int(np.ceil(n_frame / roi_size))

        X_mag_pad = np.pad(X_mag_pre, ((0, 0), (0, 0), (pad_l, pad_r)), mode='constant')

        pred = self._execute(X_mag_pad, roi_size, n_window, params)
        pred = pred[:, :, :n_frame]

        pad_l += roi_size // 2
        pad_r += roi_size // 2
        n_window += 1

        X_mag_pad = np.pad(X_mag_pre, ((0, 0), (0, 0), (pad_l, pad_r)), mode='constant')

        pred_tta = self._execute(X_mag_pad, roi_size, n_window, params)
        pred_tta = pred_tta[:, :, roi_size // 2:]
        pred_tta = pred_tta[:, :, :n_frame]

        return (pred + pred_tta) * 0.5 * coef, X_mag, np.exp(1.j * X_phase)


class VocalRemoverLaunch(Resource):
  def get(self, path):
    downloadMp3FromYoutube(path)
    return "Item not found for the id:", 200

    def put(self, path):

      return "Item not found for the id: {}".format(path), 404
