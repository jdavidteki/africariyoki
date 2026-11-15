#!/usr/bin/env python3
"""Build the africariyoki public songs API: static files served by GitHub Pages (www.africariyoki.com/api/...).

  api/songs.json        {v, generated, source, count, songs: [{id, title, artist, album, country, added, audio, lrc, lrc_url}]}
  api/lrc/<id>.lrc      the timed lyrics (LRC) of each song, as stored in the app's realtime database
  api/README.md         what this is

Source: the app's own public Firebase realtime database node /lyrics (the same data the app reads), or a local export with
--from FILE. Only songs that are turned on and whose audio file answers HTTP 200 are listed; an audio URL on the old
africariyoki.appspot.com bucket is rewritten to the africariyoki-4b634 bucket when only that one exists (as the app does for vocals).
GitHub Pages sends Access-Control-Allow-Origin: *, and the audio bucket does too, so any site can read both.
Usage: python3 api/build_songs_api.py [OUT_DIR=api] [--from export.json] [--no-check]"""
import concurrent.futures, datetime, json, os, re, sys, urllib.request

DB = "https://africariyoki-4b634-default-rtdb.firebaseio.com/lyrics.json"
SITE = "https://www.africariyoki.com"


def get(url, timeout=60):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "africariyoki-api-build"}), timeout=timeout).read()


def ok(url):
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "africariyoki-api-build"})
        return urllib.request.urlopen(req, timeout=20).status == 200
    except Exception:
        return False


def audio_for(s, check):
    u = str(s.get("audiourl") or "").strip()
    if not u.startswith("https://"):
        return None
    if not check:
        return u
    if ok(u):
        return u
    alt = u.replace("/africariyoki.appspot.com/", "/africariyoki-4b634.appspot.com/")
    return alt if alt != u and ok(alt) else None


def clean_lrc(t):
    lines = [l.rstrip() for l in str(t or "").replace("\r", "").split("\n")]
    timed = [l for l in lines if re.match(r"^\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]", l.strip())]
    return ("\n".join(l.strip() for l in timed) + "\n") if len(timed) >= 4 else None


def main():
    args = [a for a in sys.argv[1:]]
    out = next((a for a in args if not a.startswith("--") and (args.index(a) == 0 or args[args.index(a) - 1] != "--from")), "api")
    src = args[args.index("--from") + 1] if "--from" in args else None
    check = "--no-check" not in args
    data = json.load(open(src)) if src else json.loads(get(DB))
    if isinstance(data, dict) and "lyrics" in data and isinstance(data["lyrics"], dict) and "audiourl" not in data["lyrics"]:
        data = data["lyrics"]
    rows = [s for s in data.values() if isinstance(s, dict) and s.get("id") and str(s.get("turnedOn", 1)) != "0"]
    with concurrent.futures.ThreadPoolExecutor(16) as ex:
        auds = list(ex.map(lambda s: audio_for(s, check), rows))
    os.makedirs(os.path.join(out, "lrc"), exist_ok=True)
    songs = []
    for s, a in zip(rows, auds):
        if not a:
            continue
        sid = re.sub(r"[^A-Za-z0-9_-]", "", str(s["id"]))
        lrc = clean_lrc(s.get("lyrics"))
        if lrc:
            open(os.path.join(out, "lrc", sid + ".lrc"), "w", encoding="utf-8").write(lrc)
        songs.append({"id": sid, "title": str(s.get("title") or "").strip(), "artist": str(s.get("singer") or "").strip(),
                      "album": str(s.get("albumName") or "").strip() or None, "country": str(s.get("countries") or "").strip() or None,
                      "added": str(s.get("dateAdded") or "") or None, "audio": a,
                      "lrc": ("lrc/" + sid + ".lrc") if lrc else None, "lrc_url": (f"{SITE}/api/lrc/{sid}.lrc") if lrc else None,
                      "page": f"{SITE}/"})
    songs.sort(key=lambda x: (x["artist"].lower(), x["title"].lower()))
    doc = {"v": 1, "generated": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
           "source": "africariyoki realtime database /lyrics (public read), built by api/build_songs_api.py",
           "site": SITE, "count": len(songs),
           "note": "Audio files are hosted in the africariyoki Firebase Storage bucket. Songs belong to their artists and labels; "
                   "this list is for playing them inside africariyoki and Jesuye's own projects, not a license to redistribute.",
           "songs": songs}
    json.dump(doc, open(os.path.join(out, "songs.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(songs)} songs ({sum(1 for s in songs if s['lrc'])} with LRC) of {len(rows)} turned on -> {out}/songs.json")


if __name__ == "__main__":
    main()
