#from lxml.html.clean import clean_html
#from lxml.html import parse #, tostring
from lxml.etree import tostring, HTMLParser, parse
import sys
from io import StringIO

if sys.argv[1] == "-":
    fromfile = sys.stdin
else:
    fromfile = open(sys.argv[1], "rt")
tofile = open(sys.argv[2], "wb")

parser = HTMLParser()
htmlstring = StringIO(fromfile.read())
s = parse(htmlstring, parser)
tofile.write(tostring(s, pretty_print = True))

