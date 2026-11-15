# africariyoki songs API

This is static JSON served by GitHub Pages, and any site can read it (`Access-Control-Allow-Origin: *`).

- `GET https://www.africariyoki.com/api/songs.json` returns `{v, generated, count, songs: [{id, title, artist, album, country, added, audio, lrc, lrc_url, page}]}`.
  - `audio` is the song's mp3 in the africariyoki Firebase Storage bucket. The bucket also sends `Access-Control-Allow-Origin: *`.
  - `lrc` is a path relative to this folder. `lrc_url` is the full URL of the timed lyrics, or `null` if the song has none.
- `GET https://www.africariyoki.com/api/lrc/<id>.lrc` returns the timed lyrics in LRC format.

Rebuild with `python3 api/build_songs_api.py api`. It reads the app's public realtime database at `/lyrics` and lists only songs that are turned on and whose audio file answers HTTP 200. It needs nothing beyond Python 3.

The songs belong to their artists and labels. This list is for playing them in africariyoki and its sister projects. It is not a license to redistribute them.
