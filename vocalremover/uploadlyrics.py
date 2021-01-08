import os
import requests

from flask import Flask, request
from flask_restful import Resource
import firebase_admin
from firebase_admin import credentials, initialize_app, storage


def uploadToFirebase(path, data):
    f = open(path+".txt", "a")
    f.write(str(data))
    f.close()

    # Init firebase with your credentials
    if not firebase_admin._apps:
        cred = credentials.Certificate("firebasecloudredentials.json")
        initialize_app(cred, {'storageBucket': 'africariyoki.appspot.com'})

    # Put your local file path
    fileName = path+".txt"
    bucket = storage.bucket()
    blob = bucket.blob("lyrics/"+fileName)
    blob.upload_from_filename(fileName)

    # Opt : if you want to make public access from the URL
    blob.make_public()
    print("your file url", blob.public_url)

class LyricsUploader(Resource):
    def post(self, path):
        data = request.stream.read()
        uploadToFirebase(path, data)
        return "Item not found for the id: {}".format(path), 404
