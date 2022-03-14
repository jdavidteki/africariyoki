from pyAudioAnalysis import audioBasicIO
from pyAudioAnalysis import audioAnalysis
import librosa
import matplotlib.pyplot as plt

# [Fs, x] = audioBasicIO.read_audio_file("./--EcE7W8FuM.mp3")
# [x, Fs] = librosa.load("./--EcE7W8FuM.mp3", sr = 16000)

audioAnalysis.beatExtractionWrapper("./--EcE7W8FuM.mp3", False)

# F, f_names = mid_feature_extraction.mid_feature_extraction(x, Fs, 0.050*Fs, 0.025*Fs)
# print(f_names, F)
# plt.subplot(2,1,1); plt.plot(F[0,:]); plt.xlabel('Frame no'); plt.ylabel(f_names[0])
# plt.subplot(2,1,2); plt.plot(F[1,:]); plt.xlabel('Frame no'); plt.ylabel(f_names[1]);
# plt.show()