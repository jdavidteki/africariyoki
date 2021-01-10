import os
import requests

from flask_restful import Resource

import cv2
import librosa
import numpy as np
import soundfile as sf
import torch
from tqdm import tqdm
from bs4 import BeautifulSoup
import urllib.request as urllib2
import re
from firebase_admin import credentials, initialize_app, storage
import firebase_admin

from lib import dataset
from lib import nets
from lib import spec_utils

#uploadtofirebase
def uploadToFirebase(path):
  print('uploading file to firebase')
  # Init firebase with your credentials
  if not firebase_admin._apps:
    cred = credentials.Certificate("firebasecloudredentials.json")
    initialize_app(cred, {'storageBucket': 'africariyoki.appspot.com'})

  # Put your local file path
  fileName = path+"_Instruments.wav"
  bucket = storage.bucket()
  blob = bucket.blob("music/"+path+".mp3")
  blob.upload_from_filename(fileName)

  # Opt : if you want to make public access from the URL
  blob.make_public()

  print("your file url", blob.public_url)
  os.remove(fileName)
  os.remove(path+"_Vocals.wav")

#execute
def execute(path):
  gpu = 1
  pretrained_model = 'models/baseline.pth'
  input = path+'.mp3'
  sr=44100
  n_fft=2048
  hop_length=1024
  window_size=512
  output_image=''
  postprocess=''
  tta='store_true'

  print('loading model...')
  device = torch.device('cpu')
  model = nets.CascadedASPPNet(n_fft)
  model.load_state_dict(torch.load(pretrained_model, map_location=device))

  if torch.cuda.is_available() and gpu >= 0:
      device = torch.device('cuda:{}'.format(gpu))
      model.to(device)
  print('done')

  print('loading wave source...')
  X, sr = librosa.load(
      input, sr, False, dtype=np.float32, res_type='kaiser_fast'
  )
  basename = os.path.splitext(os.path.basename(input))[0]
  print('done')

  print('done with input file...deleting to save space on server')
  os.remove(path+".mp3")

  if X.ndim == 1:
      X = np.asarray([X, X])

  print('stft of wave source...', end=' ')
  X = spec_utils.wave_to_spectrogram(X, hop_length, n_fft)
  print('done')

  vr = VocalRemover(model, device, window_size)

  if tta:
      pred, X_mag, X_phase = vr.inference_tta(X)
  else:
      pred, X_mag, X_phase = vr.inference(X)

  if postprocess:
    print('post processing...', end=' ')
    pred_inv = np.clip(X_mag - pred, 0, np.inf)
    pred = spec_utils.mask_silence(pred, pred_inv)
    print('done')

  print('inverse stft of instruments...', end=' ')
  y_spec = pred * X_phase
  wave = spec_utils.spectrogram_to_wave(y_spec, hop_length=hop_length)
  print('done')
  sf.write('{}_Instruments.wav'.format(basename), wave.T, sr)

  print('inverse stft of vocals...', end=' ')
  v_spec = np.clip(X_mag - pred, 0, np.inf) * X_phase
  wave = spec_utils.spectrogram_to_wave(v_spec, hop_length=hop_length)
  print('done')
  sf.write('{}_Vocals.wav'.format(basename), wave.T, sr)

  if output_image:
    with open('{}_Instruments.jpg'.format(basename), mode='wb') as f:
        image = spec_utils.spectrogram_to_image(y_spec)
        _, bin_image = cv2.imencode('.jpg', image)
        bin_image.tofile(f)
    with open('{}_Vocals.jpg'.format(basename), mode='wb') as f:
        image = spec_utils.spectrogram_to_image(v_spec)
        _, bin_image = cv2.imencode('.jpg', image)
        bin_image.tofile(f)

  uploadToFirebase(path)


#downloadmp3fromyoutube
def downloadMp3FromYoutube(videoId):
  print('downloading song in mp3 format')
  url = "https://www.yt-download.org/api/button/mp3/" + videoId

  page = requests.get(url)
  data = page.text
  soup = BeautifulSoup(data, "html.parser")
  links = []

  for link in soup.find_all('a'):
      links.append(link.get('href'))

  r = requests.get(links[1])
  with open(videoId+'.mp3',  'wb') as f:
    f.write(r.content)

  print('completed download in mp3 format')
  execute(videoId)


class VocalRemover(object):
    def __init__(self, model, device, window_size):
        self.model = model
        self.offset = model.offset
        self.device = device
        self.window_size = window_size

    def _execute(self, X_mag_pad, roi_size, n_window):
        self.model.eval()
        with torch.no_grad():
            preds = []
            for i in tqdm(range(n_window)):
                start = i * roi_size
                X_mag_window = X_mag_pad[None, :, :, start:start + self.window_size]
                X_mag_window = torch.from_numpy(X_mag_window).to(self.device)

                pred = self.model.predict(X_mag_window)

                pred = pred.detach().cpu().numpy()
                preds.append(pred[0])

            pred = np.concatenate(preds, axis=2)

        return pred

    def preprocess(self, X_spec):
        X_mag = np.abs(X_spec)
        X_phase = np.angle(X_spec)

        return X_mag, X_phase

    def inference(self, X_spec):
        X_mag, X_phase = self.preprocess(X_spec)

        coef = X_mag.max()
        X_mag_pre = X_mag / coef

        n_frame = X_mag_pre.shape[2]
        pad_l, pad_r, roi_size = dataset.make_padding(n_frame, self.window_size, self.offset)
        n_window = int(np.ceil(n_frame / roi_size))

        X_mag_pad = np.pad(X_mag_pre, ((0, 0), (0, 0), (pad_l, pad_r)), mode='constant')

        pred = self._execute(X_mag_pad, roi_size, n_window)
        pred = pred[:, :, :n_frame]

        return pred * coef, X_mag, np.exp(1.j * X_phase)

    def inference_tta(self, X_spec):
        X_mag, X_phase = self.preprocess(X_spec)

        coef = X_mag.max()
        X_mag_pre = X_mag / coef

        n_frame = X_mag_pre.shape[2]
        pad_l, pad_r, roi_size = dataset.make_padding(n_frame, self.window_size, self.offset)
        n_window = int(np.ceil(n_frame / roi_size))

        X_mag_pad = np.pad(X_mag_pre, ((0, 0), (0, 0), (pad_l, pad_r)), mode='constant')

        pred = self._execute(X_mag_pad, roi_size, n_window)
        pred = pred[:, :, :n_frame]

        pad_l += roi_size // 2
        pad_r += roi_size // 2
        n_window += 1

        X_mag_pad = np.pad(X_mag_pre, ((0, 0), (0, 0), (pad_l, pad_r)), mode='constant')

        pred_tta = self._execute(X_mag_pad, roi_size, n_window)
        pred_tta = pred_tta[:, :, roi_size // 2:]
        pred_tta = pred_tta[:, :, :n_frame]

        return (pred + pred_tta) * 0.5 * coef, X_mag, np.exp(1.j * X_phase)


class VocalRemoverLaunch(Resource):
  def get(self, path):
    downloadMp3FromYoutube(path)
    return "Item not found for the id:", 200

    def put(self, path):

      return "Item not found for the id: {}".format(path), 404
