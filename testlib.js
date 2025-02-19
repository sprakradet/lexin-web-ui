const { spawn } = require('node:child_process')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { indexedDB, IDBKeyRange } = require("fake-indexeddb");
const fs = require("fs").promises;

async function saveHTML(filename) {
    const html = document.getElementById('resultsDiv').innerHTML;
    const formathtml = spawn('python3', ['formathtml.py', '-', filename]);
    formathtml.stdin.write(html);
    formathtml.stdin.end();
    await formathtml;
}

async function saveFullHTML(filename) {
    let html = document.documentElement.innerHTML;
    html = "<!DOCTYPE html>\n" + html
    await fs.writeFile(filename, html);
}

async function saveJSON(filename, json) {
    await fs.writeFile(filename + ".json", JSON.stringify(json, null, 2));
}

async function loadJSON(filename) {
    let data = await fs.readFile(filename + ".json");
    return JSON.parse(data);
}

class DOMParser {
    parseFromString(s) {
	return new JSDOM(s).window.document;
    }
}

async function setupDOM(options, indexfile) {
    let dom = await JSDOM.fromFile(indexfile, options);
    let window = dom.window;

    window.indexedDB = indexedDB;
    window.IDBKeyRange = IDBKeyRange;
    window.scrollTo = function () {}
    global.window = window;
    global.self = window;
    global.document = window.document;
    let db = require('./db');
    global.db = db;
    let jQuery = require('./js/jquery-3.3.1.min');
    let underscore = require('./js/underscore-1.9.1-min.js');
    global.$ = jQuery;
    global._ = underscore;
    let lexin = require('./lexin');
    let autocomplete = require('./autocomplete');
    let autocompleteConstants = require('./autocompleteConstants');
    let scrolling = require('./scrolling');
    let lemmalist = require('./lemmalist');
    let keyboard = require('./keyboard');

    global.isIndexed = autocomplete.isIndexed;
    global.getSelectedLexicon = lexin.getSelectedLexicon;
    global.getAutocompleteArray = autocompleteConstants.getAutocompleteArray;
    global.permbartop = scrolling.permbartop;
    global.resizeLemmaList = lemmalist.resizeLemmaList;
    global.updateKeyboardLanguage = keyboard.updateKeyboardLanguage;
    global.settings = lexin.settings;
    global.DOMParser = DOMParser;

    global.history = {
        pushState: function() { },
        replaceState: function() { }
    }

    return {lexin, dom};
}

exports.saveHTML = saveHTML
exports.setupDOM = setupDOM
exports.saveJSON = saveJSON
exports.saveFullHTML = saveFullHTML
exports.loadJSON = loadJSON
