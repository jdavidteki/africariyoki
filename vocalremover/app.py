from flask import Flask
from flask_restful import Api

from resources.vocalremover import VocalRemoverLaunch
from uploadlyrics import LyricsUploader

app = Flask(__name__)
api = Api(app)

api.add_resource(VocalRemoverLaunch, "/vr/<string:path>")
api.add_resource(LyricsUploader, "/lyrics/<string:path>")

if __name__ == "__main__":
  app.run()