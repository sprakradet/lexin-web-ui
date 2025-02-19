#!/usr/bin/python3

import hashlib
from glob import glob
import shutil
import re
import json

lang_re = re.compile("lexin-json/lexin-entries-([a-z_]+).json")

metadata = []

for filename in glob("lexin-json/lexin-entries-*.json"):
    lang_m = lang_re.match(filename)
    lang = lang_m.group(1)
    length = 0
    with open(filename, "rb") as f:
        digest = hashlib.sha256()
        content = f.read()
        length = len(content)
        digest.update(content)

    code = digest.hexdigest()
    newfilename = "lexin-json/lexin-%s-%s.json" % (lang, code)
    print(newfilename)
    shutil.copyfile(filename, newfilename)
    metadata.append({"lang":lang, "version": code, "size": length, "filename":newfilename})

json.dump(metadata, open("lexin-downloadable.json", "wt"))

