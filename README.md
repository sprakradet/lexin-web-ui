Lexin Web UI
============

This is the Web UI for Lexin, the official dictionary for learners of Swedish as a second language.

The dictionary data for Lexin is available at [https://språkresurser.isof.se/lexin/](https://språkresurser.isof.se/lexin/).

Lexin is published by the Institute for Language and Folklore.

Publications
------------

Ahltorp, Magnus and Höglund, Laila. Shrinking Lexin: The challenges of a Swedish second language learner’s dictionary on small screens. 157–166.  In: Kozma Ahačič, Sabine Kirchmeier (eds): By the People, for the PeopleーOnline Dictionaries, Language Portals, and the Role of Language Users. Contribution to the 20th EFNIL Conference 2023 in Ljubljana. ISBN 978-615-6678-06-5, 978-615-6678-07-2 (PDF). Budapest, HUN-REN Hungarian Research Centre for Linguistics, 2024.

Ahltorp, Magnus, Sjöbergh, Jonas and Höglund, Laila. Anpassning av Lexin till små skärmar. Den 17. konferansen om leksikografi i Norden, Bergen 24–26 May 2023. https://www.uib.no/sites/w3.uib.no/files/attachments/samandrag-nfl-17.pdf

Deployment
----------

```
git clone https://github.com/sprakradet/lexin-web-ui lexin
cd lexin
git clone https://github.com/sprakradet/lexin-static-swe swe
git clone https://github.com/sprakradet/lexin-json
python3 build-dl.py
```

The `build-dl` script must be run whenever the lexin-json directory is updated. This generates copies of the dictionary files with unique names and builds the `lexin-downloadable.json` index file.

### File compression

Optionally generate Brotli compressed versions of the downloadable dictionaries:

```
cd lexin-json
brotli *.json
```

Then configure your web server to use the Brotli compressed files. For example, if you are using Apache, this configuration works for .json files:

```
RewriteEngine on
RewriteCond %{HTTP:Accept-Encoding} br
RewriteCond %{DOCUMENT_ROOT}/%{REQUEST_FILENAME}.br -f
RewriteRule ^(.*)$ $1.br [L]
<Files *.json.br>
  AddType "application/json" .br
  AddEncoding br .br
</Files>
```
