from pyAudioAnalysis import audioBasicIO
from pyAudioAnalysis import ShortTermFeatures
import librosa
import matplotlib.pyplot as plt
from firebase_admin import credentials, initialize_app, storage
import firebase_admin
import os

# [Fs, x] = audioBasicIO.read_audio_file("./--EcE7W8FuM.mp3")
# [x, Fs] = librosa.load("./--EcE7W8FuM.mp3",sr = 16000)


# audioAnalysis.beatExtractionWrapper("./--EcE7W8FuM.mp3",False)

# F, f_names = mid_feature_extraction.mid_feature_extraction(x, Fs, 0.050*Fs, 0.025*Fs)
# print(f_names, F)
# plt.subplot(2,1,1); plt.plot(F[0,:]); plt.xlabel('Frame no'); plt.ylabel(f_names[0])
# plt.subplot(2,1,2); plt.plot(F[1,:]); plt.xlabel('Frame no'); plt.ylabel(f_names[1]);
# plt.show()

if not firebase_admin._apps:
    cred = credentials.Certificate("../firebasecloudredentials.json")
    initialize_app(cred, {'storageBucket': 'africariyoki-4b634.appspot.com'})

allFiles = [
"-BrqVZeLr0Q","-L8hLkg21MQ","-WqNQ49lYq0","-hyDrO0uOXQ","00R4dOtzDIA","0bjHDNoZrrQ","0q4KRlPcnN4","0rLSi6m2Ll4","0u1K1w8La5A","16eD47oOpH8","1P-AAhpqHfU","1_bq1F9hV8g","1kU5BzdfDfg","1qgiNdSGx-c","21V7PKLPQqY","2lY1oZq-8N0","33xgszZJn_c","3GrngaKe0g0","3Ri26PZuzYc","5gvgDWmTFKA","5zEj2LJSoQY","6MI2hpDY0I0","6unnNvyupos","6xWEh1nW1gQ","7DxG33tEJKE","7GME5jEkf2s","7bbtciH7rEQ","7sbj_7mRyAg","7tw405ULbK8","8vC6TtSCYFo","9410qCyQuJ4","9gchcyH4qv4","9jIhNOrVG58","9wBeNVp5UZY","A2MVt9hc6uY","AR5uz13lhB0","AWdE6ivnA78","Alajp8cD2-U","BBzi69kOAW8","BKtUjHzyeys","BOgwB3tqSas","C2ncGGiDZxA","CLGNCRaIYEA","CW1qn1A_xSY","DGpwNm0A6gI","DgVN3n4p9GU","EEvbOgy6KCg","EMoFDGKDw6c","EOrFWBjiRik","ET0LuQ3_ZIw","En79C-61iD8","EtbwTgY3AIk","FCUk7rIBBAE","FQ4dTb9Fo0I","G7Er0z3zw2s","GWKdV6H7qZM","HE8p1lJaPyg","HdFaP0DniDQ","Hz-AyMeKT1o","I6wzhp4g2Cw","IahNmvmFOS4","InIeez-2WIs","JDy-ZLlYEGw","JFlBu5Gm7sU","JcJhrOStkl4","JtEv_3Rwn1o","KErqMcZR0KA","LLuegl7hrlE","LaKIuNGc8c4","Lk14JL-JcZQ","M7nLOhmMGfg","MCnkHJ0HbDQ","MIBYzlMG9a4","MQoyjrDUCuY","MTehln05IBY","MgQDB12sE_Y","MrpVIkyjJrA","MucSft25l6I","N5G7Mvo0tkM","NDAOa6qp8Hg","O-zmJw70iz8","O7bOeffd48E","OQuQV6u8-tk","OdkPvFE2wac","PB4blM5LYPM","PFPfxcvRshk","PUnx13A4XDs","QUSc5al8JpY","Qbx3UNcoC1Q","QijcIH6Yc7Q","Qtfslc-VAhA","RhYGUjSi-9w","Rsdopaqg85k","S3PdBtY_no4","SFmZKO35SfQ","SbHx9Ps7B4g","T8Neeqbp1Wo","TIKF16oagBY","UCUfGghQfms","UKSfQqYTFRo","Uz07P-Df7AE","VF47kno4Dro","W22pYvi9M2w","WRLB5O1plrY","WoxN3b0jmlY","X9A0L0MD6T4","XE1ybI6we_A","XkP3dHiJ0dI","XlCPF3-IyIw","Y5QUVma7_g4","Y65E6xXyEF4","YRhBfL3GEjQ","Y_Y3F2wXOxs","Yp9Bvu-qNeQ","Yvdp4mWMDv8","_IgD-qWC_ek","_KXHTdq9URg","_tNFyE_WPgI","_znR5yFp2UM","aK5FsO7n31E","ai0RgtrRGSY","bMyrBds_9Zc","bkZ1_gNDQkg","bp6UdUPtXxE","cL51JxNZF7w","chMsx-vKHug","dXeOBkKdiAg","dyEfm68pcE8","eIaw1ZtthRg","fCZVL_8D048","fE3ePS8Umgo","g7akR7AEAxg","gJ9hzRbN4BI","gdtoVsK_eic","hVEp-P2-rqY","hiZKMtwlYkg","hxe6Ly4xfkE","i-T4-4Hveo4","i0ZMaGVJF-Y","iMti8KjkCsw","ipZvlG-wwWk","ir-DUnDxFQc","izBpU_bOqbk","jMpysHVdAe0","jipQpjUA_o8","jowVh4hblsg","lG_-2gU6kUk","lPe09eE6Xio","leCI_whBjOw","lta5go9P-go","m7VX0tHCxfY","mFBJtuQ1Llc","mV_zjss2nlY","mZKwbR1Kjr4","n3hSeu2NYXU","n4pS-2P1wiQ","o5KyLuuqFms","oAcWCGgF-tY","oW6aSd0WPzk","ojWJJn4VtnQ","pQK4KpophPo","qEEsc8j-FVI","qGkDAAxrjv0","qQ2uxHTmhIg","qgNNKuMjJ_4","qiwoG1CmJIU","qm-8MuocmVY","rN00uYIDFOc","rO49fDRz-3k","rYiUHMF7upY","rvnXUQTEEVA","s5xiYjLF5Uo","s6stHyWHt1U","sRS8Afj3dOM","ssvZdVkYg3I","sz5EhyESHR8","ts5NDTV4QIo","tzQx8rhcRUE","uLJSjW3FSvY","uZ-_HIoEBE8","ucVJrja8r6Q","vEgmPQtIdT0","vSCRRlkHDtI","w4gAllVrPVM","wCX7Isw7HZw","wDhJgEFtYAM","wG0WBC17Arc","whptJMsHQVI","witjmEEV7Es","wp59ewWnOtc","x9a6kz1-mgo","xYD2SQljwJo","xk4oK0QjlG4","xygb3dw2nTY","yfM_ctb0tOo","yoRQg4ZIRuo","z3hZrOu-FTo","zUU1bIWpH5c","zgi30OqnKN4",]

for song in allFiles[:20]:
    source_blob_name = "music/" + song + ".mp3"
    #The path to which the file should be downloaded
    destination_file_name = song + ".mp3"

    bucket = storage.bucket()
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

    #play  with F and see if we an get some kind of average that can be used to calculate stuff
    [x, Fs] = librosa.load("./" + destination_file_name, sr = 16000)
    F, f_names = ShortTermFeatures.feature_extraction(x, Fs, 0.050*Fs, 0.025*Fs)
    print(destination_file_name)
    print(f_names, F[0])

    os.remove(song + ".mp3")
