"use strict";
// ----------------------------------------------------------------------
// javascript to make HTML from Lexin search results.
//
// HTML (CSS) classes used in the result:
// 
// abbr, for abbreviations
// 
// alt_form, for alternate forms (like "idag" and "i dag")
// 
// antonym, for antonyms
// 
// clickableHeading, for interface headings that you can click on top open the help page.
// 
// comment, for comments in any language
// 
// comment_se, for comments in Swedish
// 
// comment_tr, for comments in the translations
// 
// compoundList, for lists of compound examples
// 
// compounds, list items in compoundList
// 
// correction, when the search queary was a word not found, suggested
// corrections (in case the search queary was misspelled) are shown in
// this class.
// 
// derivation, derived forms of the main word
// 
// derivationList, list of derivation elements
// 
// entryContent, the main (large) text content of a search result
// 
// errorReport, when the call to Lexin failed, the error message is shown in this class
// 
// exampleList, list of example sentences and expressions
// 
// examples, items in the exampleList
// 
// explanation, longer explanation of words that may be specific to Swedish culture/society
// 
// gramInfo, grammar info
// 
// gramUsage, also grammar info (should maybe be merged with the gramInfo)
// 
// hyphenate, information on how to hyphenate the word
// 
// idiomHead, first part (the idiom itself) in Swedish
// 
// idiomHeadTrans, first part of an idiom in another language
// 
// idiomList, a list of idioms
// 
// idioms, wraps an idiomList and a header
// 
// idiomTail, the description of what the idiom means
// 
// idiomTailTrans, the translated description
// 
// ill, for illustrations (links to an external image database)
// 
// imageLink, the actual link itself.
// 
// inflections, list of inflected forms
// 
// languageIndicator, when the search was done in more than one
// lexicon and there are results from several the results are tagged
// with elements of this class.
// 
// lexemeItem, one lexeme result
// 
// lexemeList, list of lexemeItems
// 
// listenContainer, container for the "click to hear pronunciation" elements
// 
// listenIcon, the icon to click to hear sound
// 
// listenPronunciation, tag for the icons when there are several
// possible pronunciations for a word.
// 
// longClickLink, a class for words that should allow long-click (mobile) and double-click (PC)
// 
// matchingWord, the word itself
// 
// meaning, the definition of the word
// 
// notRelevant, class added to all elements that are deemed irrelevant
// to the search query (when the search query for example only appears
// in one example compound).
// 
// orClass, for the "or" text separating alternatives
// 
// cueWord, for the "har", "att", etc. cue words for inflections
// 
// phonetic, for phonetic script
// 
// PoS, the part of speech
// 
// pronunciation, the pronunciation related information (sound +
// pronunciation in phonetic script)
// 
// referenceHead, for reference elements ("see", "antonym", etc.)
// 
// referenceInfo, the word referenced
// 
// resultList, the list of all the search results
// 
// soundFiles, clickable element to play sound files
// 
// synonyms, synonyms to the translation
// 
// translation, the translation of the Swedish search result
// 
// wordInfo, wraps wordInfoMain and listenContainer
// 
// wordInfoMain, the header (main info) of a search result, not
// including examples and translations.
// 
// ----------------------------------------------------------------------

class Flags {
    loadResources;

    constructor() {
        this.loadResources = true;
    }
}

let flags = new Flags();

// ----------------------------------------------------------------------
// Maps for looking up the HTML language codes from the codes used by
// Lexin, and to look up the human readable language name.
// ----------------------------------------------------------------------
const languageMap = {
    "alb":"sq",
    "amh":"am",
    "ara":"ar",
    "azj":"az",
    "bos":"bs",
    "fin":"fi",
    "gre":"el",
    "hrv":"hr",
    "kmr":"ku", // TODO: is this the right Kurdish?
    "pus":"ps",
    "per":"fa",
    "rus":"ru",
    "srp":"sr",
    "srp_cyrillic":"sr",
    "som":"so",
    "spa":"es",
    "swe":"sv",
    "sdh":"ckb", // TODO: Is this the correct HTML language code?
    "tir":"ti",
    "tur":"tr",
    "ukr":"uk"
};

const languageNames = {
    "sq":"albanska",
    "am":"amhariska",
    "ar":"arabiska",
    "az":"azerbajdzjanska",
    "bs":"bosniska",
    "fi":"finska",
    "el":"grekiska",
    "hr":"kroatiska",
    "ku":"kurdiska (kurmanji)",
    "ps":"pashto",
    "fa":"persiska",
    "ru":"ryska",
    "sr":"serbiska (latinskt)",
    "sr":"serbiska (kyrilliskt)",
    "so":"somaliska",
    "es":"spanska",
    "sv":"svenska",
    "ckb":"kurdiska (sorani)",
    "ti":"tigrinska",
    "tr":"turkiska",
    "uk":"ukrainska"
};

const languageDir = {
    "alb":"ltr",
    "amh":"ltr",
    "ara":"rtl",
    "azj":"ltr",
    "bos":"ltr",
    "fin":"ltr",
    "gre":"ltr",
    "hrv":"ltr",
    "kmr":"rtl",
    "pus":"rtl",
    "per":"rtl",
    "rus":"ltr",
    "srp":"ltr",
    "srp_cyrillic":"ltr",
    "som":"ltr",
    "spa":"ltr",
    "swe":"ltr",
    "sdh":"rtl", // TODO: Is this rtl?
    "tir":"ltr",
    "tur":"ltr",
    "ukr":"ltr"
};

const BaseLanguageSwe = 'sv';

const languageMapReverse = {
    "sq":"alb",
    "am":"amh",
    "ar":"ara",
    "az":"azj",
    "bs":"bos",
    "fi":"fin",
    "el":"gre",
    "hr":"hrv",
    "ku":"kmr", // TODO: is this the right Kurdish?
    "ps":"pus",
    "fa":"per",
    "ru":"rus",
    "sr":"srp",
    "sr":"srp_cyrillic",
    "so":"som",
    "es":"spa",
    "sv":"swe",
    "ckb":"sdh", // TODO: probably not this language code?
    "ti":"tir",
    "tr":"tur",
    "uk":"ukr"
};

const PoSnames = {
    "adj.":'adjektiv',
    "adv.":'adverb',
    "förk.":'förkortning',
    "interj.":'interjektion',
    "konj.":'konjunktion',
    "prep.":'preposition',
    "pron.":'pronomen',
    "räkn.":'räkneord',
    "subst.":'substantiv',
    "eng.":'engelska'
};

let helpElement;

async function loadHelp() {
    let help = await $.ajax({url:"https://lexin.se/help.html", dataType: "html", type: "GET"});
    let helpBody = new DOMParser().parseFromString(help, "text/html");
    helpElement = helpBody.getElementById("LexinExplanations");
}

let bildtemaWords;

/* --------- LOAD ALL DETAIL PICTURES --------- */
/* --------- RUN ONLY ONCE, AS YOU OPEN THE APP --------- */
/* CG ADD START */
async function loadBildtema() {
	// creates arrays of words and images
    let words = await $.ajax({url:"https://lexin.se/all.json", dataType: "json", type: "GET"});
    let images = await $.ajax({url:"https://lexin.se/images.json", dataType: "json", type: "GET"});

	// get the first image of every word, creates an array of word ids and single images
    let imageurls = {};
    for (let image of images) {
		let id = image.id;
		let urls = image.images;

		// CG ADD
		let page = image.page;
		let subpage = image.subpage;

		if (urls && urls.length) {
			if (!imageurls[id]) {
				imageurls[id] = [];
			}
			// CG CHANGE
			imageurls[id].push(urls[0]+"|"+page+"|"+subpage);	// add image to word id, e.g. "w325_a": ["26/6/images/Bitmap15.png"]
		}
    }
    
	// CG CHANGE - THIS FIXES THE "WRONG DETAIL PIC ERROR"
    bildtemaWords = {};
	for (let key of Object.keys(words)) {	
		let value = words[key];		// actual word string

		// normalize lemma (strip article + trailing parentheses)
		/*let splitvalue = value.split(" ");
		if (splitvalue.length == 2) {
			if (splitvalue[0] == "en" || splitvalue[0] == "ett") {
				value = splitvalue[1];
				value = value.replace(/\([^)]+\)$/, "");
			}
		} else {
			value = value.replace(/\([^)]+\)$/, "");
		}*/

		// remove parenthetical content
		let normalized = value.replace(/\s*\([^)]*\)\s*/g, " ");
		// split
		normalized = normalized.trim().split(/\s+/);
		// remove en/ett
		if (normalized.length > 1) {
			normalized = normalized.map(s => s.trim()).filter(s => s !== "en" && s !== "ett");
		}
		value = normalized.join(" ");
		// remove comma
		value = value.replace(/,/g, ""); 
		// ignore case
		value = value.toLowerCase();

		// create array of normalized lemmas and images
		let urls = imageurls[key];

		if (urls) {
			//CG CHANGE
			for (let url of urls) {
				const parts = String(url).split("|");     // ["26/6/images/Bitmap15.png","26","6"]
				const compositeKey = value+"|"+parts[1]+"|"+parts[2];

				if (!bildtemaWords[compositeKey]) {
					bildtemaWords[compositeKey] = [];
				}
				bildtemaWords[compositeKey].push(parts[0]);  // add the image path
			}
		}
    }
}
/* CG ADD END */

/* CG REMOVE START */
/*async function loadBildtema() {
	// creates arrays of words and images
    let words = await $.ajax({url:"https://lexin.se/all.json", dataType: "json", type: "GET"});
    let images = await $.ajax({url:"https://lexin.se/images.json", dataType: "json", type: "GET"});

	// get the first image of every word, creates an array of word ids and single images
    let imageurls = {};
    for (let image of images) {
		let id = image.id;
		let urls = image.images;

		if (urls && urls.length) {
			if (!imageurls[id]) {
				imageurls[id] = [];
			}
			imageurls[id].push(urls[0]);	// add image to word id, e.g. "w325_a": ["26/6/images/Bitmap15.png"]
		}
    }
    
	// CG ADD
	//bildtemawords = imageurls;
	
    bildtemaWords = {};
	for (let key of Object.keys(words)) {	
		let value = words[key];		// actual word string

		// normalize lemma (strip article + trailing parentheses)
		let splitvalue = value.split(" ");
		if (splitvalue.length == 2) {
			if (splitvalue[0] == "en" || splitvalue[0] == "ett") {
				value = splitvalue[1];
				value = value.replace(/\([^)]+\)$/, "");
			}
		} else {
			value = value.replace(/\([^)]+\)$/, "");
		}

		// create array of normalized lemmas and images
		let urls = imageurls[key];

		if (urls) {
			if (!bildtemaWords[value]) {
				bildtemaWords[value] = [];
			}
			for (let url of urls) {
				bildtemaWords[value].push(url);		// add link to lemma
			}

			/* CG ADD START */
			/*if(value == "fluga") {
				console.log("CG fluga link: " + bildtemaWords[value])
			}*/
			/* CG ADD END */
		/*}
    }
}*/
/* CG REMOVE END */

function unAbbreviatePoS(str) {
    if(PoSnames.hasOwnProperty(str)) { // most common case
		return PoSnames[str];
    }
    if(str.indexOf(".") > 2) {
		let res = str;
		for(const abbr in PoSnames) {
			res = res.replace(abbr, PoSnames[abbr]);
		}
		return res;
    }
    return str;
}

function appendWithSeparator(parent, elements, separator) {
    let first = true;
    for (const element of elements) {
		if (first) {
			first = false;
		} else {
			parent.appendChild(separator.cloneNode(true));
		}
		parent.appendChild(element);
    }
}

function getSeparatorForLang(lang) {
    if (languageDir[lang] == "rtl") {
		return "\u060C ";
    } else {
		return ", "
    }
}

window.onpopstate = function(event) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const inpLangs = urlParams.get('languages');
    const inpWord = urlParams.get('word');
    
    if(inpLangs && inpLangs.length > 0) {
	setSelectedLexicon(inpLangs.split(","));
	updateKeyboardLanguage();	
    }
    if(inpWord) {
	$("#searchQuery")[0].value = inpWord;
//	callLexin();
    }
    
    callLexin(false);
};

// ----------------------------------------------------------------------
// callLexin()
// ----------------------------------------------------------------------
// Calls the Lexin service with the currently selected options.
// ----------------------------------------------------------------------

/* --------- PREPARE & CALL SEARCH --------- */
async function callLexin(pushPreviousState) {
	// normalize query
    let w = $("#searchQuery").val();
    w = w.replace(/\s*$/, "").replace(/^\s*/, "");

    let lexicons = getSelectedLexicon();
    let tf = "both";

	// ensure at least 1 lexicon result
    if(lexicons.length < 1) {
		lexicons.push("swe");
    }
    
	// save previous url
    if(pushPreviousState) {
		const urlBefore = window.location;
		history.pushState({'word':w, 'languages':lexicons}, '', urlBefore);
    }
    
	// upload current url
    const urlNow = window.location.protocol + '//' + window.location.host + window.location.pathname
	  + "?languages=" + encodeURIComponent(lexicons)
	  + "&word=" + w;
    history.replaceState({'word':w, 'languages':lexicons}, '', urlNow);
    
	// clear results
    $("#resultsDiv").html("");

	// fetch search results
    if(w && w != "") {
		$("#resultsDiv").html("<p class='loadingIndicator'>Slår upp " + w + ", var god vänta...</p>");

		let requestedLanguages = new Set(lexicons);

		if(settings.add_swedish_results.val) {
			requestedLanguages.add("swe");
		}

		return await fetchNext(requestedLanguages);
    }
}

let permbartop;

/* --------- FETCH JSON OBJECT FROM KTH API --------- */
class LexinService {
    backendServer;
    getJson;

    constructor() {
		// base url
        this.backendServer = "https://lexin.nada.kth.se/lexin/service";

		// build rest of url
		// return json object
		this.getJson = async function(direction, lang, word) {
			//console.log("CG query: \"" + word + "\"");
			//console.log("CG query encoded: \"" + encodeURIComponent(word) + "\"");

			const url = lexinService.backendServer + "?searchinfo=" + direction + ",swe_" + lang + "," + encodeURIComponent(word) + "&output=JSON";

			// CG ADD REGEX TEST
			/*const regex = new RegExp(`^${word}$`, "i");
			const word2 = String(regex);
			console.log("CG query regexed: \"" + word2 + "\"");
			const url = lexinService.backendServer + "?searchinfo=" + direction + ",swe_" + lang + "," + encodeURIComponent(word2) + "&output=JSON";*/

			//HB 250613
			//BUG in api: \ is replaced by \u005c everywhere (?)
			//simple fix here is to get text instead of json and replace it back..
			//not sure if it will work in every case fixes the current bug
			//TODO: remove this when the api is back in order!

			//this is the old and correct call
			//return await $.get(url);

			//this is the temporary bugfix
			let res = await $.get(url, null, null, "text");
			res = res.replaceAll("\\u005c","\\");
			return JSON.parse(res);
			//end of the temporary bugfix

		}
    }
}

let lexinService = new LexinService();

/* --------- WRITE HERE --------- */
async function fetchNext(requestedLanguages) {
	// get query
    let w = $("#searchQuery").val();

	// exit if empty query
    if (!w) {
        return;
    }

    let fetchedLanguages = {};

    for(const l of requestedLanguages) {
		let d = l;
		let tf = "both";
		
		// fetch search result entries
		// use local database if possible, else fallback to api
		try {
			let data;
			let dbServerValue = await dbServer.promise;

			if (dbServerValue) {
				let downloadedMetadataEntries = await dbServerValue.metadata.query("lang").only(d).execute();
				if (downloadedMetadataEntries.length && downloadedMetadataEntries[0].status == "active") {
					let metadata = downloadedMetadataEntries[0];
					let entries = await dbServerValue.entries.query("search").only(w).execute();
					let filtered_entries = entries.filter(entry => entry.lang == d)
					if (filtered_entries.length) {
						data = {Status:"found", Result:filtered_entries, Wordbase:metadata.wordbase}
					} else {
						data = {Status: "no matching"}
					}
					console.log("using downloaded dictionary", d, w, data);
				}
				else {
					data = await lexinService.getJson(tf, d, w);
				}
			} 
			else {
				data = await lexinService.getJson(tf, d, w);
			}
			
			let convertedData = addOneJSON(d, data);
			fetchedLanguages[d] = {'w':w, 'lang':d, 'data':convertedData};
		} catch(error) {
			console.log("error", error);
		}
    }

    w = w.replace(/\s*$/, "").replace(/^\s*/, "");

	// set language order
    let lexicons = getSelectedLexicon();
    let translatedLanguages = Object.keys(fetchedLanguages).filter(lang => lang != "swe");
    let firstLexicon = ["swe", ...lexicons].find(lexicon => fetchedLanguages[lexicon]?.data);

	// no data fetched
    if (!firstLexicon) {
        let errorDiv = document.createElement('div');
        errorDiv.className = "errorReport";
        errorDiv.textContent = "Problem med att kontakta Lexin.";
		$("#resultsDiv").empty().append(errorDiv);
		console.log("WARNING: Problem calling the Lexin service: ");
		console.log(JSON.stringify(fetchedLanguages, null, 2));
        return;
    }

    let d = firstLexicon;
    let restLexicons = Object.keys(fetchedLanguages).filter(lang => lang != firstLexicon);
    let data = fetchedLanguages[d].data;
    
	// merge search results of several languages
    for(const lang of restLexicons) {
        let fetchedLanguage = fetchedLanguages[lang];
		if(fetchedLanguage?.w == w
			&& fetchedLanguage.data?.Result
			&& fetchedLanguage.data?.Status == "found"
		) {
			if (data?.Status != "found") {
			data = fetchedLanguage.data;
			} else {
			data.Result = concatResults(data.Result, fetchedLanguage.data.Result);
			}
		}
    }

	// generate html results
    var html = printJSON(w, data, translatedLanguages.length > 1);
    $("#resultsDiv").html(html);
    
    initialShowHide();
    
    // console.log(html);
    // console.log(JSON.stringify(data, null, 2));
    
	// jump to top of page
    setTimeout(() => {
		if ($(window).scrollTop() >= permbartop) {
			$(window).scrollTop(permbartop);
		}
		$("#searchQuery").blur();
    }, 100);

    return data;
}

const LSL3props = {"Value":undefined, "Variant":undefined, "Type":undefined,
		   "BaseLang":{"Alternate":undefined, "Antonym":undefined, "Comment":undefined, "Compound":undefined, "Derivation":undefined, "Example":undefined, "Explanation":undefined, "Graminfo":undefined, "Idiom":undefined, "Illustration":undefined, "Inflection":undefined, "Meaning":undefined, "Phonetic":undefined, "Reference":undefined, "Usage":undefined},
		   "TargetLang":{"Antonym":undefined, "Comment":undefined, "Compound":undefined, "Derivation":undefined, "Example":undefined, "Explanation":undefined, "Idiom":undefined, "Synonym":undefined, "Translation":undefined}
		  };

const LSL4props = {"Abbreviate":undefined, "Alternate":undefined, "Hyphenate":undefined, "Inflection":undefined, "Phonetic":undefined, "Reference":undefined, "Type":undefined, "Value":undefined, "Variant":undefined,
		   "Lexeme":{"Abbreviate":undefined, "Comment":undefined, "Compound":undefined, "Definition":undefined, "Example":undefined, "Explanation":undefined, "Gramcom":undefined, "Graminfo":undefined, "Idioms":undefined, "Illustration":undefined, "Reference":undefined, "Lexemeno":undefined, "VariantID":undefined,
			     "TargetLang":{"Translation":undefined, "Example":undefined, "Explanation":undefined, "Idioms":undefined, "Compound":undefined, "Comment":undefined, "Synonym":undefined,
					   "Cycle":{"Translation":undefined, "Comment":undefined, "Compound":undefined, "Example":undefined}},
			     "Cycle":{"Abbreviate":undefined, "Comment":undefined, "Compound":undefined, "Definition":undefined, "Example":undefined, "Graminfo":undefined, "Reference":undefined}}};

const arrayProps = {'Lexeme':1, 'Cycle':1};

function copyProps(from, to, props, lang, init) {
    for(const prop in props) {
	if(from.hasOwnProperty(prop)) {
	    if(!to.hasOwnProperty(prop)) {
		if(arrayProps.hasOwnProperty(prop)) {
		    to[prop] = [];
		} else {
		    to[prop] = {};
		}
	    }
	    if(arrayProps.hasOwnProperty(prop)) {
		for(let i = 0; i < from[prop].length; i++) {
		    if(i >= to[prop].length) {
			to[prop].push( {} );
		    }

		    const pr = props[prop];
		    let ff = from[prop][i];
		    let tt = to[prop][i];

		    let tmp = {};
		    if(init) {
			copyProps(ff, tmp, pr, lang, init);
		    } else {
			tmp = tt;
			copyProps(ff, tmp, pr, lang, init);
		    }
		    to[prop][i] = tmp;
		}
	    } else if(props[prop] == undefined) {
		if(init) {
		    to[prop][lang] = from[prop];
		} else {
		    for(const lng in from[prop]) {
			to[prop][lng] = from[prop][lng];
		    }
		}		    
	    } else {
		let tmp = {};
		if(init) {
		    copyProps(from[prop], tmp, props[prop], lang, init);
		} else {
		    tmp = to[prop];
		    copyProps(from[prop], tmp, props[prop], lang, init);
		}
		to[prop] = tmp;
	    }
	}
    }
}

/* --------- STRUCTURE SEARCH RESULT ACCORDING TO LSL3/LSL4--------- */
function addOneJSON(lang, data) {
    let convertedData = {Result:[], Status: data.Status};

    if (data.Corrections) {
        convertedData.Corrections = data.Corrections;
    }

    for(let res of data.Result ?? []) {
		let props = {};
		let lsl = LSLversion(data);
		if(lsl == "LSL3") {
			props = LSL3props;
		}
		if(lsl == "LSL4") {
			props = LSL4props;
		}

		if(lsl == "LSL4" && res.Lexeme !== undefined) {
			for (let lexeme of res.Lexeme) {
				let newres = {};

				let resCopy = Object.assign({}, res);
				resCopy.Lexeme = [lexeme];

				copyProps(resCopy, newres, props, lang, 1);

				newres.VariantID = lexeme.VariantID;
				newres.lang = lang;
				newres.lsl = lsl;

				convertedData.Result.push(newres);
			}
			} else {
				let newres = {};

				copyProps(res, newres, props, lang, 1);

				newres.VariantID = res.VariantID;	    
				newres.lang = lang;
				newres.lsl = lsl;

				convertedData.Result.push(newres);
			}
    }

    return convertedData;
}

function LSLversion(js) {
    if(js && js.Wordbase) {
	return js.Wordbase;
    }
    console.log("WARNING: no Wordbase information in JSON respsonse, this should not happen.");
    return "LSL3";
}

function mergeJSON(res1, res2) {
    var newres = {};

    let props = {};
    if(res1.lsl == "LSL3") {
	props = LSL3props;
    } else if(res1.lsl == "LSL4") {
	props = LSL4props;
    }
    
    copyProps(res1, newres, props, res1.lang, 0);
    copyProps(res2, newres, props, res2.lang, 0);

    newres.lang = res1.lang;
    newres.lsl = res1.lsl;
    newres.VariantID = res1.VariantID;

    for(const p0 in res1) {
	if(!newres.hasOwnProperty(p0)) {
	    console.log("WARNING: merge found unknow property LSL3: " + p0);
	}
    }
    for(const p0 in res2) {
	if(!newres.hasOwnProperty(p0)) {
	    console.log("WARNING: merge found unknow property LSL3: " + p0);
	}
    }
    
    return newres;
}

function resVariantID(res) {
    let resVariantID_lsl3 = new Map(res.map(e => [e.lsl == "LSL3" ? e.VariantID : undefined, e]));
    let resVariantID_lsl4 = new Map(res.map(e => [e.lsl == "LSL4" ? e.VariantID : undefined, e]));
    return new Map([["LSL3", resVariantID_lsl3], ["LSL4", resVariantID_lsl4]]);
}

function concatResults(res1, res2) {
    let newres = [];

    let res1VariantID = resVariantID(res1);
    let res2VariantID = resVariantID(res2);

    newres = res1.map(r1 => {
        let r2 = res2VariantID.get(r1.lsl).get(r1.VariantID)
        if (r2 !== undefined) {
	    return mergeJSON(r1, r2)
	} else {
            return r1
        }
    })

    newres.push(...res2.filter(r2 => !res1VariantID.get(r2.lsl).has(r2.VariantID)));

    return newres;
}

// ----------------------------------------------------------------------
// printJSON(word, lexin)
// ----------------------------------------------------------------------
// Parses the JSON returned from the Lexin service. Returns HTML to
// display the search results.
// ----------------------------------------------------------------------
function printJSON(word, res, moreThanOneLanguage) {
    var html = document.createElement('div');

	// no answer
    if(!res) {
		html.className = 'errorReport';
		html.textContent = "Fick inget svar från Lexin.";
    } 
	// internal error
	else if(res.Status == "? Internal error") {
		html.className = 'errorReport';
		html.textContent = "Problem med Lexins server.";
    } 
	// unavailable dictionary
	else if(res.Status == "? Incorrect dictionary") {
		html.className = 'errorReport';
		html.textContent = "Det valda lexikonet finns inte längre.";
    } 
	// unvalid characters
	else if(res.Status == "? Unvalid characters in the word") {
		html.className = 'errorReport';
		html.textContent = "Felaktiga tecken i ordet.";
    } 
	// try to correct word, several possible words, e.g. "hundd"
	else if(res.Status == "no unique matching") {
		html.className = 'errorReport';
		html.innerHTML = "<p>Felstavat ord? Mer än ett liknande möjligt ord.</p>";

		// show correction suggestions
		if(res.Corrections?.length > 0) {
			console.log("CG rättningsförslag: ", res.Corrections);

			let langs = getSelectedLexicon();
			let sp = document.createElement('span');
			sp.textContent = "Rättningsförslag: ";
			let ul = document.createElement('ul');

			for(let correction of res.Corrections) {
				var li = document.createElement('li');
				var w = correction;

				var aElem = getLinkElemToSearch(w);
				aElem.textContent = w;
				li.appendChild(aElem);

				ul.appendChild(li);
			}
			html.appendChild(sp);
			html.appendChild(ul);
		}
    } 
	// no matching
	else if(res.Status == "no matching") {
		html.className = 'errorReport';
		html.textContent = "Ordet gick inte att hitta i ordlistan.";
    } 
	// try to correct word, single possible word, e.g. "möndighet"
	else if(res.Status == "found" || res.Status == "corrected") {

		if(res.Status == "corrected") {
			var corr = document.createElement('div');
			corr.className = 'correction';
			if(res?.Result?.[0]?.Value) {
				for(let correctedWord of Object.values(res.Result[0].Value)) {
					// CG ADD - remove "|" from suggested word
					const correctedWord2 = correctedWord.replace(/\|/g, "");

					// CG CHANGE - from correctedWord to correctedWord2
					corr.textContent = "Ordet \"" + word + "\" finns inte i lexikonet, men ordet \"" + correctedWord2 + "\" finns.";
					word = correctedWord; // treat this as the query for relevance etc. purposes
					break;
				}
			}
			
			assignLang(corr, "swe");
			html.appendChild(corr);
		}

		assignLang(html, "swe");
		let results = res.Result;
		results = rankSearchResults(results, word);
		let baseForms = getBaseform(results, word);
		
		var uElem = document.createElement('ul');
		uElem.className = 'resultList';
		assignLang(uElem, "swe");
		for(let result of results) {
				let resultNodes = getOneResult(result, result.lang, baseForms, moreThanOneLanguage);
				for (const node of resultNodes) {
					var li = document.createElement('li');
					li.appendChild(node);
					uElem.appendChild(li);
				}
		}
		
		html.appendChild(uElem);
    }
    return html;
}

function showAllCheck(js, wtmp, baseForms) {
    if(baseForms.includes(wtmp)
       || relevant(wtmp, baseForms)) {
	return 1;
    }
    if(js && js.TargetLang) {
	if(js.TargetLang.Translation) {
	    for(const lang in js.TargetLang.Translation) {
		if(relevant(js.TargetLang.Translation[lang], baseForms)) {
		    return 1;
		}
	    }
	}
	if(js.TargetLang.Synonym) {
	    for(const lang in js.TargetLang.Synonym) {
		for(let i = 0; i < js.TargetLang.Synonym[lang].length; i++) {
		    if(relevant(cleanWord(js.TargetLang.Synonym[lang][i]), baseForms)) {
			return 1;
		    }
		}
	    }
	}
    }
    return 0;
}

function getBaseform(results, searchQuery) {
    let word = cleanWord(searchQuery);
    let baseForms = [word];
    for(let r = 0; r < results.length; r++) {
	var js = results[r];

	if(js && js.Value) {
	    for(let lng in js.Value) {
		let tmpVal = "";
		if(js.Value[lng]) {
		    tmpVal = cleanWord(js.Value[lng]);
		}
	    
		if(js.Value[lng] && tmpVal == word) {
		    // matching word
		    if(!baseForms.includes(word)) {
			baseForms.push(word);
		    }
		} else if(js.BaseLang || js.TargetLang) {
		    if(js.BaseLang && js.BaseLang.Inflection && js.BaseLang.Inflection[lng]) {
			for(let i = 0; i < js.BaseLang.Inflection[lng].length; i++) {
			    // inflection
			    if(cleanWord(js.BaseLang.Inflection[lng][i].Content) == word) {
				if(!baseForms.includes(tmpVal)) {
				    baseForms.push(tmpVal);
				}
			    }
			}
		    }
		    if(js.BaseLang && js.BaseLang.Alternate && js.BaseLang.Alternate[lng] && cleanWord(js.BaseLang.Alternate[lng]) == word) { // Alternate is not an array in BaseLang
			if(!baseForms.includes(tmpVal)) {
			    baseForms.push(tmpVal);
			}
		    }
		    if(js.BaseLang && js.BaseLang.Meaning && js.BaseLang.Meaning[lng] && cleanWord(js.BaseLang.Meaning[lng]).indexOf(word) >= 0) {
			if(!baseForms.includes(tmpVal)) {
			    baseForms.push(tmpVal);
			}
		    }
		    if(js.TargetLang && js.TargetLang.Translation && js.TargetLang.Translation[lng] && cleanWord(js.TargetLang.Translation[lng]) == word) {
			if(!baseForms.includes(word)) {
			    baseForms.push(word);
			}
			if(!baseForms.includes(tmpVal)) {
			    baseForms.push(tmpVal);
			}
		    } else if(js.TargetLang && js.TargetLang.Translation && js.TargetLang.Translation[lng] && js.TargetLang.Translation[lng].indexOf(',') > 0) {
			let translations = js.TargetLang.Translation[lng].split(/\s*,\s*/);
			for(let t = 0; t < translations.length; t++) {
			    if(cleanWord(translations[t]) == word) {
				if(!baseForms.includes(word)) {
				    baseForms.push(word);
				}
				if(!baseForms.includes(tmpVal)) {
				    baseForms.push(tmpVal);
				}
				break;
			    }
			}
		    }
		    if(js.TargetLang && js.TargetLang.Synonym && js.TargetLang.Synonym[lng] && js.TargetLang.Synonym[lng].length > 0) {
			for(let s = 0; s < js.TargetLang.Synonym[lng].length; s++) {
			    if(cleanWord(js.TargetLang.Synonym[lng][s]).indexOf(word) >= 0) {
				if(!baseForms.includes(word)) {
				    baseForms.push(word);
				}
			    }
			}
		    }
		} else { // no baselang, so probably LSL4 lexicon
		    if(js.Inflection && js.Inflection[lng]) {
			for(let i = 0; i < js.Inflection[lng].length; i++) {
			    if(cleanWord(js.Inflection[lng][i].Content) == word) {
				if(!baseForms.includes(tmpVal)) {
				    baseForms.push(tmpVal);
				    break;
				}
			    }
			}
		    }
		    if(js.Abbreviate && js.Abbreviate[lng] && js.Abbreviate[lng].Content && cleanWord(js.Abbreviate[lng].Content) == word) {
			if(!baseForms.includes(tmpVal)) {
			    baseForms.push(tmpVal);
			}
		    }
		    if(js.Alternate && js.Alternate[lng] && js.Alternate[lng].length > 0) { // Alternate IS an array in sweswe
			for(let a = 0; a < js.Alternate[lng].length; a++) {
			    if(js.Alternate[lng][a].Content && cleanWord(js.Alternate[lng][a].Content) == word) {
				if(!baseForms.includes(tmpVal)) {
				    baseForms.push(tmpVal);
				    break;
				}
			    }
			}
		    }
		    if(js.Lexeme) {
			for(let l = 0; l < js.Lexeme.length; l++) {
			    let lex = js.Lexeme[l];
			    
			    if(lex.Abbreviate && lex.Abbreviate[lng] && lex.Abbreviate[lng].Content && cleanWord(lex.Abbreviate[lng].Content) == word) {
				if(!baseForms.includes(tmpVal)) {
				    baseForms.push(tmpVal);
				    break;
				}
			    }
			    
			    if(lex.TargetLang && lex.TargetLang[lng] && lex.TargetLang[lng].Translation && lex.TargetLang[lng].Translation == word) {
				if(!baseForms.includes(word)) {
				    baseForms.push(word);
				}
				if(!baseForms.includes(tmpVal)) {
				    baseForms.push(tmpVal);
				}
			    }
			    
			    if(lex.Cycle) {
				let cyc = lex.Cycle;
				for(let c = 0; c < cyc.length; c++) {
				    let cc = cyc[c];
				    if(cc.Abbreviate && cc.Abbreviate[lng] && cc.Abbreviate[lng].Content && cleanWord(cc.Abbreviate[lng].Content) == word) {
					if(!baseForms.includes(tmpVal)) {
					    baseForms.push(tmpVal);
					    
					    l = js.Lexeme.length;
					    break;
					}
				    }
				}
			    }
			}
		    }
		}
	    }
	}
    }
    
    return baseForms;
}

// ----------------------------------------------------------------------
// getInflections(w, js)
// ----------------------------------------------------------------------
// Get inflected forms. Also takes the word itself as an argument, to
// add the base form to the list of inflected forms.
// ----------------------------------------------------------------------
function getInflections(w, js) {
    var res = [];
    if(js) {
	for(const lang in js) {
	    res.push({'c':w});
	    for(var i = 0; i < js[lang].length; i++) {
		var tmp = {};
		if(js[lang][i].Content) {
		    tmp.c = js[lang][i].Content;
		}
		if(js[lang][i].Form) {
		    tmp.f = js[lang][i].Form;
		}
		if(js[lang][i].Spec) {
		    tmp.s = js[lang][i].Spec;
		}
		if(js[lang][i].Phonetic) {
		    tmp.ph = js[lang][i].Phonetic;
		}
		if(js[lang][i].Alternate) {
		    tmp.a = [];
		    for(var v = 0; v < js[lang][i].Alternate.length; v++) {
			if(js[lang][i].Alternate[v].Spec && js[lang][i].Alternate[v].Content) {
			    tmp.a.push({'c':js[lang][i].Alternate[v].Content, 's':js[lang][i].Alternate[v].Spec});
			} else if(js[lang][i].Alternate[v].Content) {
			    tmp.a.push({'c':js[lang][i].Alternate[v].Content});
			}
		    }
		}
		res.push(tmp);
	    }
	    break; // inflection should be the same in all lexicon, use only one copy
	}
    }
    return res;
}

function createTextSpan(text, className, lang) {
    let elem = document.createElement('span');
    elem.textContent = text;
    if (className) {
        elem.className = className;
    }
    if (lang) {
        assignLang(elem, lang);
    }
    return elem;    
}

function createLanguageSpan(lang) {
    let elem = document.createElement("span");
    if (lang) {
        assignLang(elem, lang);
    }
    return elem;
}

function createTranslationSpan() {
    let elem = document.createElement("span");
    elem.className = "languageWrapper translation";
    return elem;
}

function createOrElem(text) {
    return createTextSpan(text, 'orClass', "swe");
}

function createLanguageIndidator(lang, textBefore="") {
    let tmp = document.createElement('span');
    tmp.textContent = textBefore + languageNames[languageMap[lang]] + ": ";
    tmp.lang = BaseLanguageSwe;
    tmp.dir = "ltr";
    tmp.className = 'languageIndicator';
    return tmp;
}

function assignLang(element, lang) {
    if(languageMap.hasOwnProperty(lang)) {
	element.lang = languageMap[lang];
	element.dir = languageDir[lang];
    } else {
        element.lang = lang; // ???
    }
}

// ----------------------------------------------------------------------
// getOneResult(js, targetLang, baseForms)
// ----------------------------------------------------------------------
// Parse all the information for one search result (one "hit" if there
// are several words that match).
// ----------------------------------------------------------------------
function getOneResult(js, targetLang, baseForms, moreThanOneLanguage) {
    let results = [];
    var wordInfoMain = document.createElement('div');
    var listenContainer = document.createElement('div');
    let w = "";

    wordInfoMain.className = 'wordInfoMain';
    listenContainer.className = 'listenContainer';

    let showAll = 0;
    
    if(js) {
	var tmp = getWord(js);
	w = tmp.w;

	let wtmp = cleanWord(w);
	
	if(showAllCheck(js, wtmp, baseForms)) {
	    showAll = 1;
	}

        let wElemTextContent = tmp.w + " ";
        if (tmp.var) {
            wElemTextContent += "(" + tmp.var + ")";
        }
	wordInfoMain.appendChild(createTextSpan(wElemTextContent, 'matchingWord', "swe"));

	if(!showAll) {
	    let el = addExpandResultElement();
	    wordInfoMain.appendChild(el);
	}
	
	
	if(js.lsl == "LSL4") {
	    // phonetic
	    let ps = [];
	    
	    if(js.Phonetic) {
		ps = getPhonetic(js.Phonetic);
	    } else if(js.Alternate) {
		// Todo: Is this actually correct JSON? Sometimes the
		// Phonetic info is only in the Alternate field, so
		// for now we need this.
                let phonetic = Object.values(js.Alternate).flatMap(alternates => alternates.map(alternate => alternate.Phonetic))[0]
                if (phonetic) {
                    ps = getPhonetic(phonetic)
                }
	    }
	    if(ps.length > 0) {
		phoneticToHTML(wordInfoMain, listenContainer, ps, showAll);
	    } 
		
	    if(js.Alternate) {
                // Alternate should be the same in all languages that have it, so only use one copy
                let firstAlternates = Object.values(js.Alternate).find(alternates => alternates.length > 0)
		for(let alternate of firstAlternates) {
		    var wrap = document.createElement('span');
		    wrap.className = 'alt_form';
		    if(!showAll) {
			wrap.className += ' notRelevant';
		    }

		    if(alternate.Content) {
			if(alternate.Spec) {
			    wrap.appendChild(createOrElem(alternate.Spec + " "));
			}
			
			var vElem = document.createElement('span');
			vElem.appendChild(makeWordsClickable(alternate.Content + " "));
			vElem.lang = BaseLanguageSwe;
			vElem.dir = "ltr";
			vElem.className = 'matchingWord'; // Alternate forms in LSL4 are styled the same as matchingWord
			wrap.appendChild(vElem);

			if(alternate.Phonetic) {
			    let phonetics = getPhonetic(alternate.Phonetic).filter(phonetic => phonetic.ph);
                            let first = true;
			    for(let phonetic of phonetics) {
				if(!first) {
				    wrap.appendChild(createOrElem("eller"));
				}
                                first = false
				wrap.appendChild(createTextSpan(" [" + phonetic.ph + "] ", 'phonetic'));
			    }
			}
			
			wordInfoMain.appendChild(wrap);
		    }
		}
	    }
	    
	    // part of speech
	    if(js.Type) {
		var posElem = document.createElement('span');
		posElem.className = 'PoS';
		if(!showAll) {
		    posElem.className += ' notRelevant';
		}

                posElem.textContent = unAbbreviatePoS(Object.values(js.Type)[0]);

		if(posElem.textContent != 'se') {
		    posElem.appendChild(document.createElement('br'));
		    wordInfoMain.appendChild(posElem);
		}
	    }

	    if(js.Reference) {
		var refs = getReferences(js.Reference);
		refToHTML(wordInfoMain, refs, baseForms, showAll);
	    }

	    if(js.Hyphenate) {
		var hElem = document.createElement('span');
		if(!showAll) {
		    hElem.className += ' notRelevant';
		}
		hElem.appendChild(createTextSpan("Avstavning", 'clickableHeading'));
		hElem.appendChild(createTextSpan(": " + Object.values(js.Hyphenate)[0]));
		hElem.lang = BaseLanguageSwe;
		hElem.dir = "ltr";
		hElem.className = 'hyphenate';
		hElem.appendChild(document.createElement('br'));
		wordInfoMain.appendChild(hElem);
	    }
	    
	    // inflected forms
	    if(js.Inflection) {
		var infl = getInflections(w, js.Inflection);
		if(!showAll) {
		    infl.className += ' notRelevant';
		}
		inflectionsToHTML(wordInfoMain, infl, showAll);
	    }

	    if(js.Abbreviate) {
		var ab = getAbbr(js.Abbreviate);
		abbrToHTML(wordInfoMain, ab, showAll);
	    }

            let wordInfo = document.createElement('div');
            wordInfo.className = 'wordInfo';
	    wordInfo.append(wordInfoMain);
	    wordInfo.append(listenContainer);

	    let pushedSomething = 0;
	    
	    if(js.Lexeme) {
		/* LSL 4 */
		var lexLs = getLexeme(js.Lexeme);
		
		for(let lex of lexLs) {
		    var lexElem = document.createElement('li');
		    lexElem.className = 'lexemeItem';
		    let atLeastOneField = 0;

		    if(lex.lexno) {
			let children = wordInfoMain.children;

			if(children && children.length) {
			    for(let c = 0; c < children.length; c++) {
				if(children[c].className.indexOf('matchingWord') >= 0) {
				    for(let lang in lex.lexno) {
					if(lex.lexno[lang] != "∙") {
					    children[c].textContent = wElemTextContent + " (" + lex.lexno[lang] + ")";
					    break;
					}
				    }
				    break;
				}
			    }
			}
		    }
		    
		    if(lex.def) {
			var defElem = document.createElement('span');
			defElem.lang = BaseLanguageSwe;
			defElem.dir = "ltr";
			defElem.className = 'meaning';
			if(!showAll) {
			    if(relevant(lex.def, baseForms)) {
				atLeastOneField = 1;
			    } else {
				defElem.className += ' notRelevant';
			    }
			}
			// all words i LSL4 descriptions are supposed to be covered in the lexicon
			defElem.appendChild(makeWordsClickable(lex.def, true));

			lexElem.appendChild(defElem);
			lexElem.appendChild(document.createElement('br'));
		    }
		    if(lex.com) {
			let wrap = document.createElement('span');
			wrap.className = 'comment_se';
			
			for(const comment of _.uniq(Object.values(lex.com).flat())) {
			    var cElem = document.createElement('span');
			    cElem.className = 'comment';
			    cElem.appendChild(makeWordsClickable("<" + comment + "> "));
			    cElem.lang = BaseLanguageSwe;
			    cElem.dir = "ltr";

			    wrap.appendChild(cElem);
			}
			if(!showAll) {
			    wrap.className += ' notRelevant';
			}
			lexElem.appendChild(wrap);
		    }
		    if(lex.abbr) {
			abbrToHTML(lexElem, lex.abbr, showAll);
		    }
		    if(lex.ref) {
			refToHTML(lexElem, lex.ref, baseForms, showAll);
		    }
		    if(lex.targ) {
			let targ = lex.targ;

			if(targ.trans && targ.trans.length > 0) {
			    let first = 1;
			    
			    for(const lang in targ.trans[0]) { // do all translations for one language together
				let langHasContent = false;
				
				let thisLang = document.createElement('div');
				if(moreThanOneLanguage) {
				    if(first) {
					first = 0;
				    } else {
					thisLang.appendChild(document.createElement('br'));
				    }
				    thisLang.appendChild(createLanguageIndidator(lang, " "));
				}
				let el = createLanguageSpan(lang);
				thisLang.appendChild(el);
				
				for(let trans of targ.trans) {
				    if(trans.hasOwnProperty(lang)) {
					if(!showAll) {
					    el.className += ' notRelevant';
					}
					let trEl = createTranslationSpan();
					for(let translang of trans[lang]) {
					    if(translang.Content) {
						trEl.textContent += translang.Content + " "; // Todo: clickable translati
					    }
					}
					el.appendChild(trEl);
					langHasContent = true;
				    }
				}

				if(targ.com && targ.com[lang] && targ.com[lang].length > 0) {
				    let wrap = document.createElement('span');
				    wrap.className = 'comment_tr';

				    var cm = document.createElement('span');
				    cm.className = 'comment';		    
				    cm.textContent = " (" + targ.com[lang].join(", ") + ") "; // Todo: clickable translations?
                                    // assignLang(cm, lang);
				    
				    wrap.appendChild(cm);
				    
				    if(!showAll) {
					wrap.className += ' notRelevant';
				    }
				    el.appendChild(wrap);
				    langHasContent = true;
				}

				if(targ.syn && targ.syn[lang] && targ.syn[lang].length > 0) {
				    let synEl = document.createElement('span');
				    synEl.className = 'synonyms';
				    if(!showAll) {
					synEl.className += ' notRelevant';
				    }

				    synEl.textContent = " (";
				    for(let sy = 0; sy < targ.syn[lang].length; sy++) {
					if(targ.syn[lang][sy].Content) { // Since there are no examples of synonyms in LSL4 yet, the format is unknown but likely one of the 2 below
					    synEl.textContent += targ.syn[lang][sy].Content; 
					} else {
					    synEl.textContent += targ.syn[lang][sy];
					}
				    }
				    synEl.textContent += ") ";
                                    // assignLang(synEl, lang);
				    el.appendChild(synEl);
				    langHasContent = true;
				}

				if(langHasContent) {
				    lexElem.appendChild(thisLang);
				}
			    }
			}
		    }
		    
		    if(lex.gramComment) {
			let cElem = document.createElement('span');

			cElem.className = 'gramUsage';

                        let comments = _.uniq(Object.values(lex.gramComment).flat());
			
			cElem.appendChild(createTextSpan("(" + comments.map(stripHTMLonly).join(", ") + ")"));
			cElem.lang = BaseLanguageSwe;
			cElem.dir = "ltr";
			
			lexElem.appendChild(cElem);
		    }
		    if(lex.ill) {
			let langList = Object.keys(js.Value).filter(lang => lang != "swe");
			illustrationToHTML(lexElem, lex.ill, BaseLanguageSwe, langList, showAll);
		    }
		    if(lex.expl) {
			if(lex.targ && lex.targ.expl) {
			    explToHTML(lexElem, lex.expl, lex.targ.expl, baseForms, showAll);
			} else {
			    explToHTML(lexElem, lex.expl, undefined, baseForms, showAll);
			}
		    }
		    if(lex.comp && lex.comp.length > 0) {
			if(lex.targ && lex.targ.comp && lex.targ.comp.length > 0) {
			    compoundToHTML(lexElem, lex.comp, lex.targ.comp, baseForms, showAll, moreThanOneLanguage);
			} else {
			    compoundToHTML(lexElem, lex.comp, undefined, baseForms, showAll, moreThanOneLanguage);
			}
		    }
		    if(lex.ex && lex.ex.length > 0) {
			if(lex.targ && lex.targ.ex && lex.targ.ex.length > 0) {
			    examplesToHTML(lexElem, lex.ex, lex.targ.ex, baseForms, showAll, moreThanOneLanguage);
			} else {
			    examplesToHTML(lexElem, lex.ex, undefined, baseForms, showAll, moreThanOneLanguage);
			}
		    }
		    if(lex.grinf) {
			let cElem = document.createElement('div');
			cElem.className = 'gramInfo';
			if(!showAll) {
			    cElem.className = ' notRelevant';			    
			}
                        assignLang(cElem, "swe");
			let prevTexts = [];
			for(const thisItem of _.uniq(Object.values(lex.grinf), false, e => graminfoString(e))) {
			    let tail = addExpandGramInfo(thisItem, w, true);
                            assignLang(tail, "swe");
			    cElem.appendChild(tail);
			}
			lexElem.appendChild(cElem);			
		    }
		    if(lex.cycle && lex.cycle.length > 0) {
			var uElem = document.createElement('ul');
			uElem.className = "cycleList";
			let somethingInCycle = showAll;
			for(const [cyc, targCyc] of _.zip(lex.cycle, lex.targ?.cycle)) {
			    let li = document.createElement('li');
			    li.className = "cycle";
			    uElem.appendChild(li);

			    if(cyc.com) {
				for(const thisText of _.uniq(Object.values(cyc.com).flat())) {
				    let wrap = document.createElement('span');
				    wrap.className = 'comment_se';
				    if(!showAll) {
					wrap.className += ' notRelevant';
				    }

				    let cElem = document.createElement('span');
				    cElem.className = 'comment';
				    cElem.appendChild(makeWordsClickable("<" + thisText + "> "));
                                    assignLang(cElem, "swe");

				    wrap.appendChild(cElem);
				    li.appendChild(wrap);
				}
			    }
			    if(cyc.def) {
				let dElem = document.createElement('span');
				dElem.className = 'meaning';
				if(!showAll) {
				    dElem.className += ' notRelevant';
				}
				dElem.appendChild(makeWordsClickable(cyc.def));
                                assignLang(dElem, "swe");
				
				li.appendChild(dElem);
				li.appendChild(document.createElement('br'));
			    }
			    if(targCyc && (targCyc.com || targCyc.trans)) {
				if(targCyc.trans.length > 0) {
				    let first = 1;
				    
				    for(const lang in targCyc.trans[0]) {
					let langHasContent = false;
					let nothingRelevant = true;
					
					let thisLang = document.createElement('span');
					if(moreThanOneLanguage) {
					    if(first) {
						first = 0;
					    } else {
						thisLang.appendChild(document.createElement('br'));
					    }
					    thisLang.appendChild(createLanguageIndidator(lang, " "));
					}
					let commentAndTrans = document.createElement('span');
					assignLang(commentAndTrans, lang);
					thisLang.append(commentAndTrans);

                                        // Untestable right now
					if(targCyc.com && targCyc.com[lang] && targCyc.com[lang].length  > 0) {
					    let wrap = document.createElement('span');
					    wrap.className = 'comment_tr';

					    var cm = document.createElement('span');
					    cm.className = 'comment';		    
					    cm.textContent = " " + targCyc.com[lang].join(", "); // Todo: clickable translations?
					    
					    wrap.appendChild(cm);

					    if(!showAll) {
						wrap.className += ' notRelevant';
					    } else {
						nothingRelevant = false;
					    }
					    commentAndTrans.appendChild(wrap);
					    langHasContent = true;
					}
					
					if(targCyc.trans && targCyc.trans.length > 0 && targCyc.trans[0][lang] && targCyc.trans[0][lang].length > 0) {
					    if (langHasContent) {
						commentAndTrans.appendChild(createTextSpan(" \u2014 "));
					    }
					    for(let translations of targCyc.trans ?? []) {
						if(translations[lang]?.length > 0) {
						    let el = document.createElement('div');
						    el.className = 'languageWrapper translation';
						    if(!showAll) {
							el.className += ' notRelevant';
						    } else {
							nothingRelevant = false;
						    }
						    let translationNodes = [];
						    for(let translation of translations[lang]) {
							if(translation.Content) {
							    translationNodes.push(createTextSpan(translation.Content + "\n")); // Todo: clickable translations?
							}
						    }
						    let separator = createTextSpan(getSeparatorForLang(lang));
						    appendWithSeparator(el, translationNodes, separator);
                                                    // assignLang(el, lang);
						    commentAndTrans.appendChild(el);
						    langHasContent = true;
						}
					    }
					}
					
					if(nothingRelevant) {
					    thisLang.className += ' notRelevant';
					}
					if(langHasContent) {
					    li.appendChild(thisLang);
					}
				    }
				}
			    }
			    if(cyc.abbr) {
				li.appendChild(document.createElement('br'));
			    	abbrToHTML(li, cyc.abbr, showAll);
			    }
			    if(cyc.ref && cyc.ref.length > 0) {
				refToHTML(li, cyc.ref, baseForms, showAll);
			    }
			    if(cyc.comp && cyc.comp.length > 0) {
				if(targCyc && targCyc.comp && targCyc.comp.length > 0) {
				    compoundToHTML(li, cyc.comp, targCyc.comp, baseForms, showAll, moreThanOneLanguage);
				} else {
				    compoundToHTML(li, cyc.comp, undefined, baseForms, showAll, moreThanOneLanguage);
				}
			    }
			    if(cyc.ex && cyc.ex.length > 0) {
				if(targCyc && targCyc.ex && targCyc.ex.length > 0) {
				    examplesToHTML(li, cyc.ex, targCyc.ex, baseForms, showAll, moreThanOneLanguage);
				} else {
				    examplesToHTML(li, cyc.ex, undefined, baseForms, showAll, moreThanOneLanguage);
				}
			    }
			    if(cyc.grinf) {
				var cElem = document.createElement('div');
				cElem.className = 'gramInfo';
                                assignLang(cElem, "swe");

				for(const thisItem of _.uniq(Object.values(cyc.grinf), false, e => graminfoString(e))) {
                                    let thisText = graminfoString(thisItem);
				    for (const e of thisItem) {
					let tail = addExpandGramInfo([e], w, true);
                                        assignLang(tail, "swe");
					cElem.appendChild(tail);
				    }
				}
				li.appendChild(cElem);		
			    }
			    if(!showAll && !relevant(li.textContent, baseForms)) {
				li.className += ' notRelevant';
			    } else {
				somethingInCycle = true;
			    }
			}
			if(!somethingInCycle) {
			    uElem.className += ' notRelevant';
			}
			lexElem.appendChild(uElem);
		    }
		    if(lex.idi && lex.idi.length > 0) {
			if(lex.targ && lex.targ.idi && lex.targ.idi.length > 0) {
			    idiomsToHTML(lexElem, lex.idi, lex.targ.idi, baseForms, showAll, moreThanOneLanguage);
			} else {
			    idiomsToHTML(lexElem, lex.idi, undefined, baseForms, showAll, moreThanOneLanguage);
			}
		    }
		    
		    let lexLsElem = document.createElement('ol');
		    lexLsElem.className = 'lexemeList';
                    lexLsElem.appendChild(lexElem);
                    let entryContent = document.createElement('div');
                    entryContent.className = 'entryContent';
                    entryContent.appendChild(lexLsElem);
                    
                    let result = document.createElement('div');

		    // cloneNode this drops all event listeners, so add them again?
		    let cpy = wordInfo.cloneNode(true)
		    restoreListeners(wordInfo, cpy);
	            result.appendChild(cpy);
		    
                    result.appendChild(entryContent);
                    results.push(result);

		    pushedSomething = 1;
		}
		
	    } else { // no Lexeme

	    }
	    
	    if(!pushedSomething) { // if there is no body, push just the head to the results array.
                let result = document.createElement('div');
	        result.appendChild(wordInfo);

                let entryContent = document.createElement('div');
                entryContent.className = 'entryContent';
                result.appendChild(entryContent);
                results.push(result);
            }

	} else { // LSL3
            let entryContent = document.createElement('div');
            entryContent.className = 'entryContent';
	    /* LSL 3 */
	    var base = undefined;
	    var targ = undefined;

	    if(js.BaseLang) {
		base = getBase(js.BaseLang, w);
	    }
	    if(js.TargetLang) {
		targ = getTarget(js.TargetLang);
	    }

	    if(base?.phon?.length > 0) {
		phoneticToHTML(wordInfoMain, listenContainer, base.phon, showAll);
	    }
	    if(js.Type) {
		var posElem = document.createElement('span');
		posElem.className = 'PoS';
		if(!showAll) {
		    posElem.className += ' notRelevant';
		}
                let firstType = Object.values(js.Type)[0];
		if (firstType) {
		    posElem.textContent = unAbbreviatePoS(firstType);
		}
		if(posElem.textContent != 'se') {
		    posElem.appendChild(document.createElement('br'));
		    wordInfoMain.appendChild(posElem);
		}
	    }
	    if(base?.infl) {
		inflectionsToHTML(wordInfoMain, base.infl, showAll);
	    }

            var wordInfo = document.createElement('div');
            wordInfo.className = 'wordInfo';
            wordInfo.append(wordInfoMain);
            wordInfo.append(listenContainer);
            let result = document.createElement('div');
            result.appendChild(wordInfo);

	    if(base?.mean) {
		var m = document.createElement('span');
		m.className = 'meaning';
                assignLang(m, "swe");
                let firstMeaning = Object.values(base.mean)[0];
		if (firstMeaning) {
		    m.appendChild(makeWordsClickable(firstMeaning));
		    if(!showAll && !relevant(firstMeaning, baseForms)) {
			m.className += ' notRelevant';
		    }
		}
		
		m.appendChild(document.createElement('br'));
		entryContent.appendChild(m);
	    }
	    if(base?.com) {
		var wrap = document.createElement('span');
		wrap.className = 'comment_se';
		if(!showAll) {
		    wrap.className += ' notRelevant';
		}
		
                let commentTexts = _.uniq(Object.values(base.com).map(comments => comments.join(", ")));
		for(const commentText of commentTexts) {
		    var cm = document.createElement('span');
		    cm.className = 'comment';
		    cm.appendChild(makeWordsClickable(" (" + commentText + ") "));
                    assignLang(cm, "swe");
		
		    wrap.appendChild(cm);
		    wrap.appendChild(document.createElement('br'));
		}
		entryContent.appendChild(wrap);
	    }
	    if(base?.alt) {
		altToHTML(entryContent, base.alt, BaseLanguageSwe, showAll);
	    }
	    if(base?.ref?.length > 0) {
		refToHTML(entryContent, base.ref, baseForms, showAll);
	    }	    
            if(base?.ant && targ?.ant) {
		antonymToHTML(entryContent, base.ant, targ.ant, baseForms, showAll, moreThanOneLanguage);
	    } else if(base?.ant && !targ?.ant) {
		antonymToHTML(entryContent, base.ant, undefined, baseForms, showAll, moreThanOneLanguage);
	    } else if(!base?.ant && targ?.ant) {
		antonymToHTML(entryContent, targ.ant, undefined, baseForms, showAll, moreThanOneLanguage);
	    }
	    if(base?.use) {
		var cElem = document.createElement('div');
		cElem.className = 'gramInfo';
		if(!showAll) {
		    cElem.className += ' notRelevant';
		}
		
		cElem.appendChild(createTextSpan("Användning", 'clickableHeading'));
		cElem.appendChild(createTextSpan(": "));
                let usageTexts = _.uniq(Object.values(base.use));
		for(const usageText of usageTexts) {
		    cElem.appendChild(makeWordsClickable(usageText + " "));
		}
                assignLang(cElem, "swe");
		
		entryContent.appendChild(cElem);			
	    }
	    if(base?.grinf) {
                for(let thisItem of _.uniq(Object.values(base.grinf).flat(), false, e => graminfoString([e]))) {
                    let cElem = document.createElement('div');
			    
                    cElem.className = 'gramInfo';			    
                    cElem.appendChild(addExpandGramInfo([thisItem], w, false));
                    assignLang(cElem, "swe");

		    if(!showAll) {
                        cElem.className += ' notRelevant';
                    }
                    entryContent.appendChild(cElem);
                }
	    }

	    if(targ?.trans) {
		for(let translations of targ.trans) {
		    for(const lang in translations) {
			let somethingRelevant = 0;
                        let outerLangWrap = document.createElement("div");
                        let langWrap = document.createElement("div");
                        langWrap.className = 'languageWrapper';
			let el = document.createElement('span');
			el.className = 'translation';
			if(!showAll) {
			    el.className += ' notRelevant';
			} else {
                            somethingRelevant = 1;
                        }
			if(moreThanOneLanguage) {
			    outerLangWrap.appendChild(createLanguageIndidator(lang, " "));
			}
			
			let trEl = document.createElement('span');
			trEl.textContent = translations[lang] + " "; // Todo: clickable translations?
                        assignLang(trEl, lang);
			
			el.appendChild(trEl);
			langWrap.appendChild(el);

			if(targ.com && targ.com[lang] && targ.com[lang].length > 0) {
			    let wrap = document.createElement('span');
			    wrap.className = 'comment_tr';

			    var cm = document.createElement('span');
			    cm.className = 'comment';		    
			    cm.textContent = " (" + targ.com[lang].join(", ") + ") "; // Todo: clickable translations?
                            assignLang(cm, lang);

			    wrap.appendChild(cm);

			    if(!showAll) {
				wrap.className += ' notRelevant';
			    } else {
				somethingRelevant = 1;
			    }
			    langWrap.appendChild(wrap);
			}
			

			if(targ.syn?.[lang]?.length) {
			    let synEl = createTextSpan(" (" + targ.syn[lang].join(", ") + ") ", 'synonyms', lang); // Todo: clickable translations?
			    if(!showAll) {
				synEl.className += ' notRelevant';
			    } else {
				somethingRelevant = 1;
			    }

			    langWrap.appendChild(synEl);
			}
                        assignLang(langWrap, lang);
			if(!somethingRelevant) {
			    outerLangWrap.className += ' notRelevant'; // hide the languageIndicator
			}
                        outerLangWrap.appendChild(langWrap);
                        entryContent.appendChild(outerLangWrap);
		    }
		}
	    }

	    if(base?.ill) {
		let langList = Object.keys(js.Value ?? []);
		illustrationToHTML(entryContent, base.ill, BaseLanguageSwe, langList, showAll);
	    }
	    
	    if(base?.expl && targ?.expl) {
		explToHTML(entryContent, base.expl, targ.expl, baseForms, showAll);
	    } else if(base?.expl && !targ?.expl) {
		explToHTML(entryContent, base.expl, undefined, baseForms, showAll);
	    } else if(!base?.expl && targ?.expl) {
		explToHTML(entryContent, targ.expl, undefined, baseForms, showAll);
	    }

	    if (base?.ex && targ?.ex) {
		examplesToHTML(entryContent, base.ex, targ.ex, baseForms, showAll, moreThanOneLanguage);
	    } else if(base?.ex && !targ?.ex) {
		examplesToHTML(entryContent, base.ex, undefined, baseForms, showAll, moreThanOneLanguage);
	    } else if(!base?.ex && targ?.ex) {
		examplesToHTML(entryContent, targ.ex, undefined, baseForms, showAll, moreThanOneLanguage);
	    }

	    if (base?.idi && targ?.idi) {
		idiomsToHTML(entryContent, base.idi, targ.idi, baseForms, showAll, moreThanOneLanguage);
	    } else if(base?.idi && !targ?.idi) {
		idiomsToHTML(entryContent, base.idi, undefined, baseForms, showAll, moreThanOneLanguage);
	    } else if(!base?.idi && targ?.idi) {
		idiomsToHTML(entryContent, targ.idi, undefined, baseForms, showAll, moreThanOneLanguage);
	    }

	    if (base?.der && targ?.der) {
		derToHTML(entryContent, base.der, targ.der, baseForms, showAll, moreThanOneLanguage);
	    } else if(base?.der && !targ?.der) {
		derToHTML(entryContent, base.der, undefined, baseForms, showAll, moreThanOneLanguage);
	    } else if(!base?.der && targ?.der) {
		derToHTML(entryContent, targ.der, undefined, baseForms, showAll, moreThanOneLanguage);
	    }
	    
	    if (base?.comp && targ?.comp) {
		compoundToHTML(entryContent, base.comp, targ.comp, baseForms, showAll, moreThanOneLanguage);
	    } else if(base?.comp && !targ?.comp) {
		compoundToHTML(entryContent, base.comp, undefined, baseForms, showAll, moreThanOneLanguage);
	    } else if(!base?.comp && targ?.comp) {
		compoundToHTML(entryContent, targ.comp, undefined, baseForms, showAll, moreThanOneLanguage);
	    }

	    if (targ?.ill) {
		illustrationToHTML(entryContent, targ.ill, targetLang, undefined, showAll);
	    }
	    
	    if(targ?.ref?.length) {
		refToHTML(entryContent, targ.ref, baseForms, showAll);
	    }
            result.appendChild(entryContent);
            results.push(result);
	}
    }
    return results;
}

// cloned nodes lose all the event listeners, restore them again
function restoreListeners(org, copy) {
    // There should be only two types of listeners:
    // expandResult
    // play audio

    let expandChildren = ([e_org,e_copy]) => _.zip(e_org.children,e_copy.children);
    let hasClass = (className => ([e_org,e_copy]) => $(e_org).hasClass(className));
    
    let wordInfoMains = _.zip(org.children, copy.children).
        filter(hasClass("wordInfoMain"));
    let expandResultsIcons = wordInfoMains.flatMap(expandChildren).
        filter(hasClass("expandResultsIcon"));
    for (let [expandResultsIcon_org, expandResultsIcon_copy] of expandResultsIcons) {
        if (expandResultsIcon_org.onclick) {
            expandResultsIcon_copy.onclick = expandResultsIcon_org.onclick;
        }
    }
    
    let listenContainers = _.zip(org.children, copy.children).filter(hasClass("listenContainer"));
    let pronunciations = listenContainers.flatMap(expandChildren).filter(hasClass("pronunciation"));
    let soundFiles = pronunciations.flatMap(expandChildren).filter(hasClass("soundFiles"));
    let buttons = soundFiles.flatMap(expandChildren).filter(([e_org,e_copy]) => e_org.type == "button");
    for (let [button_org, button_copy] of buttons) {
	if (button_org.onclick) {
	    button_copy.onclick = button_org.onclick;
	}
    }
}


// replace w1/w2/w3 ... with three sentences
// replace & with our main word
// replace ngn and ngt with någon and något
// replace a, b, X, Y, with något, någon
function addExpandGramInfo(constructionsList, word, lsl4) {
    let txt = "<" + constructionsList.map(text => text.map(e => e.stringValue()).join("")).join(", ") + ">";
    let elem = document.createElement('div');
    let textElem = document.createElement('span');
    textElem.className = "graminfoExplanationText";
    textElem.textContent = txt;

    let explanations = document.createElement('div');
    explanations.style.display = 'none';
    explanations.className = "graminfoExplanation";

    let exp = document.createElement('img');
    exp.src = "/disclosure.svg";
    exp.className = "expandGraminfoIcon";

    elem.appendChild(exp);
    elem.appendChild(textElem);
    elem.appendChild(explanations);
    
    elem.onclick = function () {
	if(explanations.style.display == 'none') {
            $(exp).addClass("expanded");
	    explanations.style.display = 'block';
	} else {
            $(exp).removeClass("expanded");
	    explanations.style.display = 'none';
	}
    }

    let ul = document.createElement('ul');

    let alreadySeen = {};
    for (const constructions of constructionsList) {
        let vec = expandSlashes(constructions);
        for(const expandedConstruction of vec) {
	    let tmp = handleSmallCaps(expandedConstruction);
	    let tmpstr = tmp.textContent.replace(/^\s*/, "").replace(/\s*$/, ""); // TODO: maybe we should strip leading and trailing space in the handleSmallCaps() instead?
	    if(!alreadySeen.hasOwnProperty(tmpstr)) {
		alreadySeen[tmpstr] = 1;
		
		let li = document.createElement('li');
		li.appendChild(tmp);
		ul.appendChild(li);
	    }
        }
    }
    if (lsl4) {
	explanations.textContent = "ngn = en person, ngt = en sak";
    } else {
	explanations.textContent = "A/B = en person, x/y = en sak";
    }
    explanations.appendChild(ul);
    
    return elem;
}

function handleSmallCaps(text) {
    let outerSpan = document.createElement('span');
//    console.log("handleSmallCaps", text);
    outerSpan.append(document.createElement('span'));
    for (const s of text) {
        let innerSpan = s.expandedValue();
        if (s.spaceBefore) {
            outerSpan.lastElementChild.append(" ");
        }
//        console.log("handleSmallCaps", innerSpan.className, outerSpan.childElementCount, outerSpan.lastElementChild.className, outerSpan.innerHTML, innerSpan.firstElementChild);
        if (innerSpan.className == "" && outerSpan.childElementCount > 1 && outerSpan.lastElementChild.className == "") {
            outerSpan.lastElementChild.append(" ");
            outerSpan.lastElementChild.append(innerSpan.firstChild);
        } else {
            if (innerSpan.className == "" && outerSpan.childElementCount > 1 && outerSpan.lastElementChild.className == "metavariable") {
                innerSpan.prepend(" ");
            }
            if (innerSpan.className == "metavariable" && outerSpan.childElementCount > 1 && outerSpan.lastElementChild.className == "") {
                outerSpan.lastElementChild.append(" ");
            }
            if (innerSpan.className == "metavariable" && outerSpan.childElementCount > 1 && outerSpan.lastElementChild.className == "metavariable") {
                let fillspan = document.createElement('span');
                fillspan.textContent = " ";
                outerSpan.append(fillspan);
            }
	    outerSpan.append(innerSpan);
        }
    }
    outerSpan.append(document.createElement('span'));
//    console.log("handleSmallCaps result", outerSpan);
    return outerSpan;
}

function splitArray(array, separatorPredicate) {
    let result = [[]];
    for (const e of array) {
        if (separatorPredicate(e)) {
            result.push([]);
            continue;
        }
        result[result.length - 1].push(e);
    }
    return result;
}

const gramInfoVars = {'A':'någon', 'B':'någon', 'x':'något', 'y':'något', 'ngn':'någon', 'ngt':'något'};

function expandSlashes(text) {
    let res = [];
    for (const sectionOuter of splitArray(text, e => e.stringValue() == ";")) {
	let sections = expandParenthesis(sectionOuter);
	for(let s = 0; s < sections.length; s++) {
	    let section = sections[s];
            if (section.length > 2 && section[0].stringValue() == "" && section[1].stringValue() == " ") {
		section.shift()
		section.shift()
		section[0].spaceBefore = true;
            }
	    //        console.log("expandSlashes", section, section.map(e => e.stringValue()).join(""));
            let tmp = expandSlashesInner(section)
            res = res.concat(tmp);
	}
    }
    
    return res;
}

// ----------------------------------------------------------------------
// Replace "m (n) o" with "m o" and "m n o"
// ----------------------------------------------------------------------
function expandParenthesis(text) {
    let iterator = text[Symbol.iterator]();

    let lefts = 0;

    /* Iterate up to the first parenthesis */

    let before = [];
    for (const component of iterator) {
	let s = component.stringValue()
        if (s == "(") {
            lefts++;
            break;
        }
	before.push(component);            
    }

    /* Iterate until the first parenthesis is closed */

    let inside = [];
    for (const component of iterator) {
	let s = component.stringValue()
        if (s == "(") {
            lefts++;
        } else if (s == ")") {
            lefts--;
        }
        if (lefts == 0) {
            break;
        }
	inside.push(component);
    }

    /* Collect the rest of the text */

    let after = Array.from(iterator);

    let insides = [[]];
    if(inside.length > 0) {
	insides = insides.concat(expandParenthesis(inside));
    }

    let afters = [[]];
    if(after.length > 0) {
	afters = expandParenthesis(after);
    }
    
    return insides.flatMap(inside => afters.map(after => before.concat(inside, after)))
}

function current_next_list(list) {
    return _.zip(list,
                 list.slice(1));
}

function cleanupGraminfo(array) {
    array = _.filter(array, e => e.stringValue() != "");
    let result = [];
    //    console.log("cleanupGraminfo", array)
    for (let [current, next] of current_next_list(array)) {
        let currentvalue = current?.stringValue();
        let nextvalue = next?.stringValue();
//        console.log("cleanup", currentvalue, nextvalue);
        if (currentvalue == "") {
            continue;
        }
        let lastvalue = result[result.length-1]?.stringValue();

//            console.log("lastvalue", lastvalue);

        if (currentvalue == " " && lastvalue == "/") {
            continue;
        }

        if (currentvalue == " " && lastvalue == "+") {
            continue;
        }

        if (currentvalue == " " && nextvalue == "+") {
            continue;
        }

        if (result.length == 0 && currentvalue == " ") {
            continue;
        }

//        console.log("pushing", array[i]);
	if(currentvalue == "(") {
	     // parenthesis needs to be separate from text, otherwise "Se (A/x/SATS)" would expand to "Se (A", "Se x", and "Se SATS)"
            result.push(current);
            result.push( graminfoItem(" ", "") );
        } else if(currentvalue == ")") {
            result.push( graminfoItem(" ", "") );
            result.push(current);
	} else {
            result.push(current);
	}
    }
    return result;
}

function expandSlashesInner(text) {
    text = cleanupGraminfo(text);

    let construction = splitArray(text, e => e.stringValue() == " ").map(
        token => splitArray(token, e => e.stringValue() == "/")
    )

    return construction.reduce(
        (accumulator, token) => accumulator.flatMap(
            partial => token.map(
                tokenalt => partial.concat(tokenalt)
            )
        ),
        [[]]);
}

function addExpandResultElement() {
    let exp = document.createElement('img');
    exp.src = "/submenuBlack.svg";
    exp.className = "expandResultsIcon";

    exp.onclick = function() {
	let p = $(this).closest('li');
	let des = p.find('.notRelevant');
	des.toggle();
    }

    return exp;
}

function phoneticToHTML(parentElement, listenContainer, phonetics, show) {
    let first = true;
    for(const p of phonetics) {
	var wrap = document.createElement('span');
	wrap.className = 'pronunciation';
	if(!first) {
	    wrap.appendChild(createOrElem("eller"));
	}
        first = false;
	
	if(p.ph != "") {
	    wrap.appendChild(createTextSpan(" [" + p.ph + "] ", 'phonetic'));
	    if(!show) {
		wrap.className += ' notRelevant';
	    }
	    parentElement.appendChild(wrap);
	}
	
	if(p.file && p.file != "") {
	    var fElem = document.createElement('div');
	    fElem.className = 'soundFiles';

	    var listen = document.createElement('button');
	    listen.title = "Lyssna på uttalet";
	    listen.onclick = function() {var a = new Audio(p.file); a.play(); return false;};
	    listen.type = "button";

	    var im = document.createElement('div');
	    im.className = 'listenIcon';
	    listen.appendChild(im);

	    listen.lang = BaseLanguageSwe;
	    listen.dir = "ltr";

	    fElem.appendChild(listen);

	    wrap = document.createElement('div');
	    wrap.className = 'pronunciation';
	    if (phonetics.length > 1) {
		let pronunciation = document.createElement('div');
		pronunciation.className = 'listenPronunciation';
		if (p.ph != "") {
		    pronunciation.textContent = " [" + p.ph + "] ";
		}
		listen.appendChild(pronunciation);
	    }
	    
	    wrap.appendChild(fElem);
	    if(!show) {
		wrap.className += ' notRelevant';
	    }
	    listenContainer.appendChild(wrap);
	}
    }
}

function abbrToHTML(parentElement, ab, show) {
    var abElem = document.createElement('span');
    var head = document.createElement('span');
    var mid = document.createElement('span');
    head.textContent = "Förkortning";
    head.className = 'clickableHeading';
    mid.textContent = ": " + ab;
    abElem.appendChild(head);
    abElem.appendChild(mid);
    abElem.lang = BaseLanguageSwe;
    abElem.dir = "ltr";
    abElem.className = 'abbr';
    abElem.appendChild(document.createElement('br'));
    if(!show) {
	abElem.className += ' notRelevant';
    }
    parentElement.appendChild(abElem);
}

function inflectionsToHTML(parentElement, infl, show) {
    var iElem = document.createElement('span');
    iElem.className = 'inflections';
    if(!show) {
	iElem.className = ' notRelevant';
    }

    var txt = " (";
    for(var i = 0; i < infl.length; i++) {
	if(i > 0) {
	    txt += " \u00b7 ";
	}
	if(infl[i].s) {
	    if(infl[i].s == "!" || infl[i].s == "(!)") {
		txt += infl[i].c;
		
		iElem.appendChild(makeWordsClickable(txt));
		txt = "";

		let spec = document.createElement('span');
		spec.className = 'cueWord';
		spec.textContent = infl[i].s;
		iElem.appendChild(spec);		
	    } else {
		if(txt != "") {
		    iElem.appendChild(makeWordsClickable(txt + " "));
		    txt = "";
		}
		let spec = document.createElement('span');
		spec.className = 'cueWord';
		spec.textContent = infl[i].s;
		iElem.appendChild(spec);
		
		txt = "\u00a0" + infl[i].c;
	    }
	} else {
	    txt += infl[i].c;
	}
	if(infl[i].a) {
	    for(var aa = 0; aa < infl[i].a.length; aa++) {
		let sp = "eller";
		if(infl[i].a[aa].s) {
		    sp = infl[i].a[aa].s;
		}
		
		if(txt != "") {
		    iElem.appendChild(makeWordsClickable(txt + " "));
		    txt = "";
		}

		let alt = document.createElement('span');
		alt.className = 'orClass';
		alt.textContent = " " + sp;
		iElem.appendChild(alt);
		
		if(infl[i].s) {
		    if(infl[i].s == "!" || infl[i].s == "(!)") {
			txt += " " + infl[i].a[aa].c;
			
			iElem.appendChild(makeWordsClickable(txt));
			txt = "";
			
			let spec = document.createElement('span');
			spec.className = 'cueWord';
			spec.textContent = infl[i].s;
			iElem.appendChild(spec);

		    } else {
			let spec = document.createElement('span');
			spec.className = 'cueWord';
			spec.textContent = " " + infl[i].s;
			iElem.appendChild(spec);
			
			txt = " " + infl[i].a[aa].c;
		    }
		} else {
		    txt = " " + infl[i].a[aa].c;
		}
	    }
	}
	if(infl[i].ph) {
	    let ph = infl[i].ph;
	    let phText = "";
	    for(let p = 0; p < ph.length; p++) {
		if(ph[p].Content) {
		    phText += ' [' + ph[p].Content + ']';
		}		
	    }
	    if(phText != "") {
		if(txt != "") {
		    iElem.appendChild(makeWordsClickable(txt + " "));
		    txt = "";
		}
		let pel = document.createElement('span');
		pel.className = 'clickableHeading';
		pel.textContent = phText;
		iElem.appendChild(pel);
	    }
	}
    }
    txt += ") ";
    
    iElem.appendChild(makeWordsClickable(txt));

    iElem.lang = BaseLanguageSwe;
    iElem.dir = "ltr";
    iElem.appendChild(document.createElement('br'));
    
    parentElement.appendChild(iElem);
}

function altToHTML(parentElement, alt1, lang1, show) {
    var altElem = document.createElement('span');
    altElem.className = 'alt_form';
    if(!show) {
	altElem.className = ' notRelevant';
    }
    var head = document.createElement('span');
    head.className = 'clickableHeading';
    var mid = document.createElement('span');
    mid.textContent = ": ";
    if(alt1.length > 1) {
	head.textContent = "Variantformer";
	head.lang = BaseLanguageSwe;
	head.dir = "ltr";
	altElem.appendChild(head);
	altElem.appendChild(mid);
	
	let tail = makeWordsClickable(alt1.join(", "));
	// tail.className = 'alt_form';
        assignLang(tail, lang1);
	altElem.appendChild(tail);
    } else if(alt1.length == 1) {
	head.textContent = "Variantform";
	head.lang = BaseLanguageSwe;
	head.dir = "ltr";
	altElem.appendChild(head);
	altElem.appendChild(mid);

	let tail = makeWordsClickable(alt1[0]);
        assignLang(tail, lang1);
	// tail.className = 'alt_form';
	altElem.appendChild(tail);
    }
    altElem.appendChild(document.createElement('br'));
    parentElement.appendChild(altElem);
}

function antonymToHTML(parentElement, ant1, ant2, baseForms, showAll, moreThanOneLanguage) {
    let atLeastOne = showAll;
    let refWrap = document.createElement('div');
    refWrap.className = "referenceContainer";
    
    if(ant2) {
	const longest = Math.max(ant1.length, ant2.length);
	
	var antElem = document.createElement('span');
	antElem.lang = BaseLanguageSwe;
	antElem.dir = "ltr";
	antElem.className = 'antonym';

	var head = document.createElement('span');
	head.className = 'clickableHeading';
	if(longest > 1) {
	    head.textContent = "Motsatser";
	} else if(longest == 1) {
	    head.textContent = "Motsats";
	}
	var mid = document.createElement('span');
	mid.textContent = ": ";
	
	antElem.appendChild(head);
	antElem.appendChild(mid);
	refWrap.appendChild(antElem);
	parentElement.appendChild(refWrap);

	// For antonyms, when there is more than one antonym (see for
	// example "vild", "akut", or "konkret"), the typical case
	// seems to be that there are multiple fields in the baseLang
	// XML but one field with one single string with all
	// translations (if more than one antonym is translated) in
	// the targetLang XML. This means the JSON has an array with
	// several elements in the baseLang and an array with only 1
	// element in the targetLang. Thus, let's print all the
	// SWedish antonyms first, then print all the translations
	// (instead of trying to print antonym1 - translation1,
	// antonym2 - translation2).


	// Swedish antonyms
	let show = showAll;
	for(var a = 0; a < ant1.length; a++) {
	    
	    let prevTexts = [];
	    for(const lang in ant1[a]) {
		let thisText = ant1[a][lang];
		if(!prevTexts.includes(thisText)) {
		    let antElem1 = document.createElement('span');

		    antElem1.lang = BaseLanguageSwe;
		    antElem1.dir = "ltr";

		    let tmp = "";
		    if(a > 0) {
			tmp += ", ";
		    }
		    if(prevTexts.length > 0) {
			tmp += "/";
		    }
		    prevTexts.push(thisText);
			
		    antElem1.textContent = tmp;

		    let txts = thisText.split(",");
		    let txts2 = stripHTMLetc(thisText).split(",");
		    for(let t = 0; t < txts.length; t++) {
			if(t > 0) {
			    let tmp = document.createElement('span');
			    tmp.textContent = ", ";
			    antElem1.appendChild(tmp);
			}
			let txt = txts[t].replace(/^\s*/, "");
			if(t < txts2.length) {
			    let link = getLinkElemToSearch(txts2[t].replace(/^\s*/, ""));
			    link.textContent = txt;
			    antElem1.appendChild(link);
			} else {
			    let link = document.createElement('span');
			    link.textContent = txt;
			    antElem1.appendChild(link);
			}
		    }
		    
		    antElem.appendChild(antElem1);
		    
		    if(!show && relevant(thisText, baseForms)) {
			atLeastOne = 1;
			show = 1;
		    }
		}
	    }
	}

	// Translations, one language at a time

	let langs = {};
	let noofLangs = 0;
	for(var a = 0; a < ant2.length; a++) {
	    for(const lang in ant2[a]) {
		if(!langs.hasOwnProperty(lang)) {
		    noofLangs++;
		}
		langs[lang] = a + 1;
	    }
	}
	for(const lang in langs) {
	    let tmp = document.createElement('span');
	    tmp.textContent = " \u2014 ";
	    tmp.dir = "ltr";
	    antElem.appendChild(tmp);

	    if(noofLangs > 1) {
		antElem.appendChild(createLanguageIndidator(lang, " "));
	    }

	    var antElem2 = document.createElement('span');
            assignLang(antElem2, lang);
	    
	    for(var a = 0; a < langs[lang]; a++) {
		if(a > 0) {
		    antElem2.textContent = ", ";
		}
		
		antElem2.textContent += ant2[a][lang];
		    		    
		if(!show && relevant(ant2[a][lang], baseForms)) {
		    atLeastOne = 1;
		    show = 1;
		}
	    }
	    antElem2.textConten += " ";
	    antElem.appendChild(antElem2);
	}
	
	if(!atLeastOne) {
	    antElem.className += ' notRelevant';
	}
    } else {
	var antElem = document.createElement('span');
	antElem.lang = BaseLanguageSwe;
	antElem.dir = "ltr";
	antElem.className = 'antonym';

	var head = document.createElement('span');
	head.className = 'clickableHeading';
	if(ant1.length > 1) {
	    head.textContent = "Motsatser";
	} else if(ant1.length == 1) {
	    head.textContent = "Motsats";
	}
	var mid = document.createElement('span');
	mid.textContent = ": ";
	
	antElem.appendChild(head);
	antElem.appendChild(mid);

	let show = showAll;

	for(var a = 0; a < ant1.length; a++) {

	    let prevTexts = [];
	    for(const lang in ant1[a]) {
		let thisText = ant1[a][lang];
		if(!prevTexts.includes(thisText)) {
		    let antElem1 = document.createElement('span');

		    antElem1.lang = BaseLanguageSwe;
		    antElem1.dir = "ltr";

		    let tmp = "";
		    if(a > 0) {
			tmp += ", ";
		    }
		    if(prevTexts.length > 0) {
			tmp += "/";
		    }
		    prevTexts.push(thisText);
			
		    antElem1.textContent = tmp;

		    let txts = thisText.split(",");
		    let txts2 = stripHTMLetc(thisText).split(",");
		    for(let t = 0; t < txts.length; t++) {
			if(t > 0) {
			    let tmp = document.createElement('span');
			    tmp.textContent = ", ";
			    antElem1.appendChild(tmp);
			}
			let txt = txts[t].replace(/^\s*/, "");
			if(t < txts2.length) {
			    let link = getLinkElemToSearch(txts2[t].replace(/^\s*/, ""));
			    link.textContent = txt;
			    antElem1.appendChild(link);
			} else {
			    let link = document.createElement('span');
			    link.textContent = txt;
			    antElem1.appendChild(link);
			}
		    }

		    antElem.appendChild(antElem1);
	    
		    if(!show && relevant(thisText, baseForms)) {
			atLeastOne = 1;
			show = 1;
		    }
		    if(!show) {
			antElem1.className += ' notRelevant';
		    }
		}
	    }
	}
	if(!atLeastOne) {
	    antElem.className += ' notRelevant';
	}
	antElem.appendChild(document.createElement('br'));
	refWrap.appendChild(antElem);
	parentElement.appendChild(refWrap);
    }
}

function stripHTMLonly(word) {
    let el = document.createElement('span');
    el.innerHTML = word;
    return el.textContent;
}

function stripHTMLetc(word) {

    // remove HTML markup
    
    let el = document.createElement('span');
    el.innerHTML = word;
    let w = el.textContent;

    // remove part-of-speech class
    for(let pname in PoSnames) {
	let p = w.indexOf(pname);
	if(p > 0 && p == w.length - pname.length) {
	    w = w.substr(0, p);
	}
    }

    // remove variant numbers
    w = w.replace(/ [0-9][0-9]*/, "");
    w = w.replace(/^\"/, "").replace(/\"$/, "");

    // remove comments
    w = w.replace(/\s*\([^)]*\)\s*/, "");

    // remove trailing or leading space
    w = w.replace(/^\s+/, "").replace(/\s+$/, "");
    
    return w;
}


// ----------------------------------------------------------------------
// Remove hyphens, parenthesis, compound marker, etc.
// ----------------------------------------------------------------------
function cleanWord(word) {
    return word.toLowerCase().replace(/[|.,:;()\"\-]*/g, "").replace(/ [0-9][0-9]*/g, "").replace(/\s*$/, "").replace(/^\s*/, "");
}

function getLinkElemToSearch(word) { // any language
    var aElem = document.createElement('a');
    var url = window.location.protocol + '//' + window.location.host + window.location.pathname;
    aElem.href = url + "?&word=" + word;
    aElem.onclick = function() {
	$("#searchQuery")[0].value = word;
	callLexin(true);
	return false;
    };
    return aElem;
}

// ----------------------------------------------------------------------
// List of languages with illustrations
// ----------------------------------------------------------------------
const langWithIllustration = {"sv":"swe", "fi":"fin", "sq":"sqi", "am":"amh", "ar":"ara", "bs":"bos", "el":"ell", "ku":"kmr", "fa":"far", "ru":"rus", "so":"som", "es":"spa", "ckb":"sdh", "ti":"tir", "tr":"tur"};

function illustrationToHTML(parentElement, ill, lang, langList, show) {
    let outerWrap = document.createElement('div');
    if(!show) {
	outerWrap.className = 'notRelevant';
    }
    parentElement.appendChild(outerWrap);
    if(ill.length == 0) {
	return;
    }
    var wrap = document.createElement('div');
    wrap.className = 'ill';
    var tmp = document.createElement('span');
    tmp.textContent = "Bild";
    tmp.lang = BaseLanguageSwe;
    tmp.dir = "ltr";
    tmp.className = 'imageLink';
    wrap.appendChild(tmp);
    let pictures = document.createElement('div');
    let picicon = getPictureIcon();
    tmp.appendChild(picicon);

	/* CG ADD START */
	tmp.onclick = () => {
		if($(pictures).find(".inlineImage").length == 0) {
			let li = $(parentElement).closest(".entryContent").closest("li");
			let word = li.find(".matchingWord").text().trim();

			// CG ADD - THIS FIXES THE "DETAIL PIC NOT SHOWN ERROR"
			word = word.replace(/\|/g, "");

			word = word.replace(/\s+\(\d+\)$/, "");
			
			console.log("CG sökord bild: \"" + word + "\"");

			// CG CHANGE - THIS FIXES THE "WRONG DETAIL PIC ERROR"
			for(var i = 0; i < ill.length; i++) {
				let parsedUrl = new URL(ill[i]);
				let urlParams = parsedUrl.searchParams;
				let page = urlParams.get("page");
    			let subpage = urlParams.get("subpage");

				let urls = bildtemaWords[word+"|"+page+"|"+subpage];		// CG: new key, includes pages 
				for (let url of urls || []) {
					addBildtemaInlineDetail(url, pictures);					// CG: detail picture
					console.log("CG " + word + " detaljbild: " + url);
				}
			}

			for(var i = 0; i < ill.length; i++) {
				addBildtemaInline(ill[i], pictures);						// CG: overview picture
				console.log("CG " + word + " översiktsbild: " + ill[i]);
			}
		}
		if(!pictures.style.display || pictures.style.display == 'none') {
			pictures.style.display = 'block';
		} else {
			pictures.style.display = 'none';
		}
		return false;
    };
	/* CG ADD END */

	/* CG REMOVE START */
	// load images on click
    /*tmp.onclick = () => {
		if($(pictures).find(".inlineImage").length == 0) {
			let li = $(parentElement).closest(".entryContent").closest("li");
			let word = li.find(".matchingWord").text().trim();

			// CG ADD - THIS FIXES THE "DETAIL PIC NOT SHOWN ERROR"
			word = word.replace(/\|/g, "");

			word = word.replace(/\s+\(\d+\)$/, "");
			//console.log("li", li, word);
			let urls = bildtemaWords[word];					// CG: here the picture for current lemma is looked up
			//console.log("CG " + word + " " + urls);
			for (let url of urls || []) {
				addBildtemaInlineDetail(url, pictures);		// CG: detail picture
				console.log("CG " + word + " detaljbild " + url);
			}
			for(var i = 0; i < ill.length; i++) {
				addBildtemaInline(ill[i], pictures);		// CG: overview picture
				console.log("CG " + word + " översiktsbild " + ill[i]);
			}
		}
		if(!pictures.style.display || pictures.style.display == 'none') {
			pictures.style.display = 'block';
		} else {
			pictures.style.display = 'none';
		}
		return false;
    };*/
	/* CG REMOVE END */

    wrap.append(pictures);
    outerWrap.appendChild(wrap);
}

function getPictureIcon() {
    let im = document.createElement('div');
    im.className = 'picWrap';
    let icon = document.createElement('img');
    icon.src = '/images.svg';
    icon.className = 'picIcon';
    icon.title = "Öppna sida med bilder";
    im.appendChild(icon);

    return im;
}


// ----------------------------------------------------------------------
// function addBildtemaInline(url, parent)
// ----------------------------------------------------------------------
// Make the "parent" element clickable, and when clicked it displays
// the bildtema image at "url". This is done by loading the whole
// bildtema web site inside a div element.
// TODO: This does not work very well. The size of the div should be set to something better. The placement of the div is not great either.
// ----------------------------------------------------------------------
function addBildtemaInline(url, parent) {
    let inlineImg = document.createElement('div');
    inlineImg.style.display = 'block';
    inlineImg.innerHTML = "";
    inlineImg.className = 'inlineImage';
    inlineImg.style.width = "100%";
    parent.appendChild(inlineImg);

    let cleanurl = url.replace("bildetema.html", "bildetema-clean.html");
    let parsedUrl = new URL(url);
    let urlParams = parsedUrl.searchParams;
    let page = urlParams.get("page");
    let subpage = urlParams.get("subpage");
    if (subpage == null) {
		subpage = 1;
    }

    //console.log("page", page, "subpage", subpage);
    inlineImg.innerHTML='<img src="/bilder/bildtema-' + page + '-' + subpage + '.png" style="width:100%;">';

	// add external Bildtema link
    let link = $("<a></a>");
    link.attr("href", url);
    link.text("Visa i Bildteman");
    $(parent).append(link);

	// CG ADD - FIX "DISABLE BILDTEMA" BUG
	link.addClass("bildtemaLink");
	$(".bildtemaLink").
	condShow(settings.btlink.val);

	// open link in new tab
	link.attr("target", "_blank");
}

function addBildtemaInlineDetail(url, parent) {
    let inlineImg = document.createElement('div');
    inlineImg.style.display = 'block';
    inlineImg.innerHTML = "";
    inlineImg.className = 'inlineImage';
    inlineImg.style.width = "100%";
    inlineImg.style.margin = "1em 0";
    $(inlineImg).css("text-align", "center");
//    inlineImg.style.height = "123px";
    parent.appendChild(inlineImg);
    inlineImg.innerHTML='<img src="/bilder/' + url + '" style=""></object>';
}


// ----------------------------------------------------------------------
// function refToHTML(parentElement, refs, lang, show)
// ----------------------------------------------------------------------
// Sometimes the JSON field contains HTML code. Currently, <i> will be
// replaced with <em>
// ----------------------------------------------------------------------
function refToHTML(parentElement, refs, baseForms, showAll) {
    // check each type
    for(var r = 0; r < refs.length; r++) {
	let show = showAll;
	let prevTexts = [];
	for(const lang in refs[r]) {
	    const ref = refs[r][lang];

	    if(ref.val) {
		let thisText = stripHTMLonly(ref.val);
		thisText = thisText.replace(/"/g, "");
		
		if(!prevTexts.includes(thisText)) {
		    prevTexts.push(thisText);
		    
		    if(!show && relevant(ref.val, baseForms)) {
			show = 1;
		    }

		    let refWrap = document.createElement('div');
		    refWrap.className = "referenceContainer";
		    if(!show) {
			refWrap.className += ' notRelevant';
		    }
		    parentElement.appendChild(refWrap);
		    
		    if(ref.type == "antonym") {
			var wrap = document.createElement('span');
			wrap.className = 'antonym';
			
			var hElem = document.createElement('span');
			hElem.className = 'referenceHead';
			hElem.textContent = referenceDict[ref.type];
			hElem.lang = BaseLanguageSwe;
			hElem.dir = "ltr";

			var mid = document.createElement('span');
			mid.textContent = ": ";
			
			var tElem = document.createElement('span');
			tElem.className = 'referenceInfo';
			// These are returned with HTML reserved characters escaped in the JSON string (?)

			let txts = thisText.split(",");
			let txts2 = stripHTMLetc(ref.val).split(",");
			for(let t = 0; t < txts.length; t++) {
			    if(t > 0) {
				let tmp = document.createElement('span');
				tmp.textContent = ", ";
				tElem.appendChild(tmp);
			    }
			    let txt = txts[t].replace(/^\s*/, "");
			    if(t < txts2.length) {
				let link = getLinkElemToSearch(txts2[t].replace(/^\s*/, ""));
				link.textContent = txt;
				tElem.appendChild(link);
			    } else {
				let link = document.createElement('span');
				link.textContent = txt;
				tElem.appendChild(link);
			    }
			}

			tElem.lang = BaseLanguageSwe;
			tElem.dir = "ltr";

			wrap.appendChild(hElem);
			wrap.appendChild(mid);
			wrap.appendChild(tElem);

			if(ref.spec) {
			    let sp = document.createElement('span');
			    sp.textContent = "(" + ref.spec + ")";
			    sp.lang = BaseLanguageSwe;
			    sp.dir = "ltr";
			    tElem.appendChild(sp);
			}
			
			refWrap.appendChild(wrap);
			
		    } else if(ref.type == "see" || ref.type == "compare") {
			var hElem = document.createElement('span');
			hElem.className = 'referenceHead';
			hElem.textContent = referenceDict[ref.type];
			hElem.lang = BaseLanguageSwe;
			hElem.dir = "ltr";
			
			var mid = document.createElement('span');
			mid.textContent = ": ";
			
			var tElem = document.createElement('span');
			tElem.className = 'referenceInfo';

			let txts = thisText.split(",");
			let txts2 = stripHTMLetc(ref.val).split(",");
			for(let t = 0; t < txts.length; t++) {
			    if(t > 0) {
				let tmp = document.createElement('span');
				tmp.textContent = ", ";
				tElem.appendChild(tmp);
			    }
			    let txt = txts[t].replace(/^\s*/, "");
			    if(t < txts2.length) {
				let link = getLinkElemToSearch(txts2[t].replace(/^\s*/, ""));
				link.textContent = txt;
				tElem.appendChild(link);
			    } else {
				let link = document.createElement('span');
				link.textContent = txt;
				tElem.appendChild(link);
			    }
			}

			tElem.lang = BaseLanguageSwe;
			tElem.dir = "ltr";
			
			refWrap.appendChild(hElem);
			refWrap.appendChild(mid);
			refWrap.appendChild(tElem);

		    } else if(ref.type == "animation") {
			let wrap =  document.createElement('div');
			let hElem = document.createElement('span');
			hElem.className = 'referenceHead';
			hElem.textContent = "Video: ";
			hElem.lang = BaseLanguageSwe;
			hElem.dir = "ltr";
			
			let tElem = document.createElement('a');
			tElem.className = 'referenceInfo';
			tElem.href = ref.val;
			tElem.textContent = "Visa film";
			tElem.lang = BaseLanguageSwe;
			tElem.dir = "ltr";
			
			wrap.appendChild(hElem);
			wrap.appendChild(tElem);

			// Inlinde the videos when clicked
			let imElem = document.createElement('div');
			imElem.className = 'picWrap';
			
			imElem.title = "Titta på videoklippet";
			imElem.onclick = function() { loadAndShowHideVideo(this, ref.val); return false;};
			
			let im = document.createElement('img');
			im.src = "video.svg";
			im.className = 'vidIcon';
			imElem.appendChild(im);
			
			imElem.lang = BaseLanguageSwe;
			imElem.dir = "ltr";

			wrap.appendChild(imElem);
			refWrap.appendChild(wrap);
		    }
		}
	    }
	}
    }
}

function loadAndShowHideVideo(elem, url) {
    let children = elem.parentElement.children;
    let seen = 0;
    for(let c = 0; c < children.length; c++) {
	if(children[c].className == "vidContainer") {
	    seen = 1;
	    if(children[c].style.display == 'none') {
		children[c].style.display = 'block';
	    } else {
		children[c].style.display = 'none';
	    }
	}
    }
    if(!seen) {
	let cont = document.createElement('div');
	cont.className = "vidContainer";
	let vid = document.createElement('video');
	vid.controls = true;
	vid.src = url;
	cont.appendChild(vid);

	elem.parentElement.appendChild(cont);
    }
}

function pluralize(number, singular, plural) {
    if (number == 1) {
	return singular;
    } else {
	return plural;
    }
}

function compoundToHTML(parentElement, comps1, comps2, baseForms, showAll, moreThanOneLanguage) {
    let atLeastOne = showAll;
	
    if(comps2) {
	const longest = Math.max(comps1.length, comps2.length);

	var compElem = document.createElement('div');
	compElem.lang = BaseLanguageSwe;
	compElem.dir = "ltr";
	compElem.className = 'compounds';

	var tmp = document.createElement('span');
	compElem.appendChild(tmp);
	let head = createTextSpan(pluralize(longest, "Sammansättning", "Sammansättningar"), 'clickableHeading');
	let mid = createTextSpan(": ");
	tmp.appendChild(head);
	tmp.appendChild(mid);
	tmp.lang = BaseLanguageSwe;
	tmp.dir = "ltr";
	
	var uElem = document.createElement('ul');
	uElem.className = 'compoundList';
	compElem.appendChild(uElem);

	let ids = [];
	let source_compounds = {};
	let target_compounds = {};
	let langs = [];

	for (let compound of comps1) {
	    for (let lang in compound) {
		if (!langs.includes(lang)) {
		    langs.push(lang);
		}
		let content = compound[lang];
		if (!ids.includes(content.id)) {
		    ids.push(content.id);
		    source_compounds[content.id] = content.w;
		}
	    }
	}

	for (let compound of comps2) {
	    for (let lang in compound) {
		let content = compound[lang];
		let id = content.id.replace(/_[0-9]+$/, "");
		if (content.w) {
		    if (!target_compounds[id]) {
			target_compounds[id] = {};
		    }
		    if (!target_compounds[id][lang]) {
			target_compounds[id][lang] = [];
		    }
		    target_compounds[id][lang].push(content.w);
		}
	    }
	}

	for (let id of ids) {
	    let show = showAll;
	    var li = document.createElement('li');
	    let source_compound = source_compounds[id];
	    let target_compound_langs = target_compounds[id];

	    let tmp = makeWordsClickable(source_compound);
	    tmp.lang = BaseLanguageSwe;
	    tmp.dir = "ltr";
	    li.appendChild(tmp);

	    if(show || relevant(source_compound, baseForms)) {
		show = 1;
		atLeastOne = 1;
	    }

	    for (let lang in target_compound_langs) {
		let lang_compounds = target_compound_langs[lang];


		let tmp = createTextSpan(" \u2014 ");
	        tmp.dir = "ltr";
		li.appendChild(tmp);

		if(moreThanOneLanguage) {
		    li.appendChild(createLanguageIndidator(lang));
		}

		let languageSpan = createLanguageSpan(lang);
		languageSpan.className = "languageWrapper translation";

		let translationNodes = [];
		for (let lang_compound of lang_compounds) {
		    translationNodes.push(createTextSpan(lang_compound));

		    if(show || relevant(lang_compound, baseForms)) {
			show = 1;
			atLeastOne = 1;
		    }
		}

		let separator = createTextSpan(getSeparatorForLang(lang));
		appendWithSeparator(languageSpan, translationNodes, separator);
		li.appendChild(languageSpan);
	    }
	    
	    if(!show) {
		li.className += ' notRelevant';
	    }
	    uElem.appendChild(li);
	}

	if(!atLeastOne) {
	    compElem.className += ' notRelevant';
	}
	parentElement.appendChild(compElem);

    } else {
	var compElem = document.createElement('div');
	compElem.className = 'compounds';

	var tmp = document.createElement('span');
	compElem.appendChild(tmp);
	var head = document.createElement('span');
	var mid = document.createElement('span');
	if(comps1.length > 1) {
	    head.textContent = "Sammansättningar";
	} else if(comps1.length == 1) {
	    head.textContent = "Sammansättning";
	}
	head.className = 'clickableHeading';
	mid.textContent = ": ";
	tmp.appendChild(head);
	tmp.appendChild(mid);
	tmp.lang = BaseLanguageSwe;
	tmp.dir = "ltr";
	
	var uElem = document.createElement('ul');
	uElem.className = 'compoundList';
	compElem.appendChild(uElem);
	
	for(var c = 0; c < comps1.length; c++) {
	    let first = 1;
	    let li = document.createElement('li');
	    let showItem = 0;
	    for(const lang in comps1[c]) {
		let spn = undefined;
		if(first) {
		    first = 0;
		    spn = makeWordsClickable(comps1[c][lang].w);
		} else {
		    spn = makeWordsClickable(" \u2014 " + comps1[c][lang].w);
		}

		spn.lang = BaseLanguageSwe;
		spn.dir = "ltr";

		li.appendChild(spn);

		if(showAll || relevant(comps1[c][lang].w, baseForms)) {
		    atLeastOne = 1;
		    showItem = 1;
		} 		
	    }
	    if(!showItem) {
		li.className += ' notRelevant';
	    }
	    uElem.appendChild(li);
	}
	
	if(!atLeastOne) {
	    compElem.className += ' notRelevant';
	}
	parentElement.appendChild(compElem);
    }
}

function examplesToHTML(parentElement, ex1, ex2, baseForms, showAll, moreThanOneLanguage) {
    let atLeastOne = showAll;
	
    if(ex2) {
	const longest = Math.max(ex1.length, ex2.length);

	var exElem = document.createElement('div');
	exElem.className = 'examples';

	var tmp = document.createElement('span');
	var head = document.createElement('span');
	var mid = document.createElement('span');
	head.textContent = "Exempel";
	mid.textContent = ": ";
	head.className = 'clickableHeading';
	tmp.appendChild(head);
	tmp.appendChild(mid);
	tmp.lang = BaseLanguageSwe;
	tmp.dir = "ltr";
	exElem.appendChild(tmp);

	var uElem = document.createElement('ul');
	uElem.className = 'exampleList';
	exElem.appendChild(uElem);

	for(var cc = 0; cc < longest; cc++) {
	    var eli = document.createElement('li');
	    let show = showAll;
	    
	    if(cc < ex1.length) {
		let prevTexts = [];

		for(const lang in ex1[cc]) {
		    let thisText = ex1[cc][lang];

		    if(!prevTexts.includes(thisText)) {
			if(prevTexts.length > 0) {
			    let tmp = document.createElement('span');
			    tmp.textContent = ", ";
			    eli.appendChild(tmp);
			}
			prevTexts.push(thisText);
			let left = makeWordsClickable(thisText);
			left.lang = BaseLanguageSwe;
			left.dir = "ltr";

			eli.appendChild(left);

			if(showAll || relevant(thisText, baseForms)) {
			    show = 1;
			    atLeastOne = 1;
			}
		    }
		}
		let tmp = document.createElement('span');
	        tmp.textContent = " \u2014 ";
	        tmp.dir = "ltr";
		eli.appendChild(tmp);
	    }
	    if(cc < ex2.length) {
		for(let lang in ex2[cc]) {

		    if(moreThanOneLanguage) {
			eli.appendChild(createLanguageIndidator(lang));
		    }
		    
		    var right = document.createElement('span');
		    right.textContent = ex2[cc][lang] + " "; // TODO: make foreign language words clickable too?
                    assignLang(right, lang);
                    right.className = 'translatedExample';
		    eli.appendChild(right);

		    if(showAll || relevant(ex2[cc][lang], baseForms)) {
			show = 1;
			atLeastOne = 1;
		    }
		}
	    }
	    if(!show) {
		eli.className += ' notRelevant';
	    }
	    
	    uElem.appendChild(eli);
	}
	
	if(!atLeastOne) {
	    exElem.className += ' notRelevant';
	}
	parentElement.appendChild(exElem);

    } else { // no translations
	var exElem = document.createElement('div');
	exElem.className = 'examples';

	var tmp = document.createElement('span');
	var head = document.createElement('span');
	var mid = document.createElement('span');
	head.textContent = "Exempel";
	mid.textContent = ": ";
	head.className = 'clickableHeading';
	tmp.appendChild(head);
	tmp.appendChild(mid);
	tmp.lang = BaseLanguageSwe;
	tmp.dir = "ltr";
	exElem.appendChild(tmp);

	var uElem = document.createElement('ul');
	uElem.className = 'exampleList';
	exElem.appendChild(uElem);
	
	for(var cc = 0; cc < ex1.length; cc++) {
	    let show = 0;

	    var eli = document.createElement('li');
	    let first = 1;
	    for(const lang in ex1[cc]) {
		let spn = undefined;
		if(first) {
		    first = 0;
		    spn = makeWordsClickable(ex1[cc][lang]);
		} else {
		    spn = makeWordsClickable(" \u2014 " + ex1[cc][lang]);
		}
		eli.appendChild(spn);
		spn.lang = BaseLanguageSwe;
		spn.dir = "ltr";
		
		if(showAll || relevant(ex1[cc][lang], baseForms)) {
		    show = 1;
		    atLeastOne = 1;
		}
	    }
	    uElem.appendChild(eli);
	    if(!show) {
		eli.className += ' notRelevant';
	    }
	}
	
	if(!atLeastOne) {
	    exElem.className += ' notRelevant';
	}
	parentElement.appendChild(exElem);
    }
}

function idiomsToHTML(parentElement, id1, id2, baseForms, showAll, moreThanOneLanguage) {
    let atLeastOne = showAll;
	
    if(id2) {
	const longest = Math.max(id1.length, id2.length);

	var iElem = document.createElement('div');
	iElem.lang = BaseLanguageSwe;
	iElem.dir = "ltr";
	iElem.className = 'idioms';

	var tmp = document.createElement('span');
	var head = document.createElement('span');
	var mid = document.createElement('span');
	head.textContent = "Uttryck";
	mid.textContent = ": ";
	head.className = 'clickableHeading';
	tmp.appendChild(head);
	tmp.appendChild(mid);
	tmp.lang = BaseLanguageSwe;
	tmp.dir = "ltr";
	
	iElem.appendChild(tmp);
	
	var uElem = document.createElement('ul');
	uElem.className = 'idiomList';
	iElem.appendChild(uElem);
	
	for(var i = 0; i < longest; i++) {
	    var li = document.createElement('li');
	    let show = 0;
	    
	    if(i < id1.length) {
		let prevTexts = [];
		for(const lang in id1[i]) {
		    let thisText = "";
		    if(id1[i][lang].h != "") {
			thisText = id1[i][lang].h;
		    }
		    if(id1[i][lang].d != "") {
			thisText += " " + id1[i][lang].d;
		    }
		    if(!prevTexts.includes(thisText)) {
			var tmp = document.createElement('span');
			var h = document.createElement('span');
			h.className = 'idiomHead';
			if(prevTexts.length > 0) {
			    h.appendChild(", " + makeWordsClickable(id1[i][lang].h));
			} else {
			    h.appendChild(makeWordsClickable(id1[i][lang].h));
			}
			prevTexts.push(thisText);

			h.lang = BaseLanguageSwe; // First we have the Swedish text
			h.dir = "ltr";

			tmp.appendChild(h);

			var t = document.createElement('span');
			t.className = 'idiomTail';
			t.appendChild(makeWordsClickable(" " + id1[i][lang].d));

			t.lang = BaseLanguageSwe; // First we have the Swedish text
			t.dir = "ltr";

			tmp.appendChild(t);
			
			if(showAll || relevant(thisText, baseForms)) {
			    show = 1;
			    atLeastOne = 1;
			}
			li.appendChild(tmp);
		    }		    
		}
	    }
	    
	    if(i < id2.length) {
		for(const lang in id2[i]) {
		    let tmp = document.createElement('span');
		    let hh = "";
		    if(moreThanOneLanguage) {
			li.appendChild(createTextSpan(" \u2014 "));
			li.appendChild(createLanguageIndidator(lang));
		    } else {
			li.appendChild(createTextSpan(" \u2014 "));
		    }
		    
		    if(id2[i][lang].h != "") {
			tmp.appendChild(createTextSpan(hh + id2[i][lang].h + " ", 'idiomHeadTrans', lang));

			if(showAll || relevant(id2[i][lang].h, baseForms)) {
			    show = 1;
			    atLeastOne = 1;
			}
		    }
		
		    if(id2[i][lang].d != "") {
			tmp.appendChild(createTextSpan(id2[i][lang].d, 'idiomTailTrans', lang));

			if(showAll || relevant(id2[i][lang].d, baseForms)) {
			    show = 1;
			    atLeastOne = 1;
			}
		    }

		    li.appendChild(tmp);
		}
	    }
	    if(!show) {
		li.className += ' notRelevant';
	    }
	    
	    uElem.appendChild(li);
	}

	if(!atLeastOne) {
	    iElem.className += ' notRelevant';
	}
	parentElement.appendChild(iElem);	
    } else {    
	var iElem = document.createElement('div');
	iElem.lang = BaseLanguageSwe;
	iElem.dir = "ltr";
	iElem.className = 'idioms';

	var tmp = document.createElement('span');
	tmp.appendChild(createTextSpan("Uttryck", 'clickableHeading'));
	tmp.appendChild(createTextSpan(": "));
	tmp.lang = BaseLanguageSwe;
	tmp.dir = "ltr";
	
	iElem.appendChild(tmp);
	
	var uElem = document.createElement('ul');
	uElem.className = 'idiomList';
	iElem.appendChild(uElem);
	
	for(var i = 0; i < id1.length; i++) {
	    var li = document.createElement('li');
	    let show = 0;

	    let first = 1;
	    let prevTexts = [];
	    for(const lang in id1[i]) {
		let thisText = id1[i][lang].h;
		if(thisText != "" && !prevTexts.includes(thisText)) {
		    prevTexts.push(thisText);
		    
		    var h = document.createElement('span');
		    h.className = 'idiomHead';
		    if(first) {
			first = 0;
			h.appendChild(makeWordsClickable(thisText + " "));
		    } else {
			h.appendChild(makeWordsClickable(" \u2014 " + thisText + " "));
		    }
		    
		    h.lang = BaseLanguageSwe;
		    h.dir = "ltr";

		    li.appendChild(h);

		    if(showAll || relevant(thisText, baseForms)) {
			show = 1;
			atLeastOne = 1;
		    }
		}

		if(id1[i][lang].d != "") {
		    var t = document.createElement('span');
		    t.className = 'idiomTail';
		    t.appendChild(makeWordsClickable(id1[i][lang].d));

		    t.lang = BaseLanguageSwe;
		    t.dir = "ltr";

		    li.appendChild(t);

		    if(showAll || relevant(id1[i][lang].d, baseForms)) {
			show = 1;
			atLeastOne = 1;
		    }
		}
		if(!show) {
		    li.className += ' notRelevant';
		}
	    
		uElem.appendChild(li);
	    }
	}

	if(!atLeastOne) {
	    iElem.className += ' notRelevant';
	}
	parentElement.appendChild(iElem);
    }
}

function relevant(text, baseForms) {
    if(text && text.length > 0) {
	let cleanText = cleanWord(text);
	
	for(let bf = 0; bf < baseForms.length; bf++) {
	    if(cleanText.indexOf(baseForms[bf]) >= 0) {
		// Todo: maybe this should be improved, only allowing substring matches if a compound marker is present and only match full words otherwise?
		return 1;
	    }
	}
    }
    return 0;
}

function derToHTML(parentElement, der1, der2, baseForms, showAll, moreThanOneLanguage) {
    let atLeastOne = 0;
	
    if(der2) {
	const longest = Math.max(der1.length, der2.length);

	var derElem = document.createElement('div');
	derElem.lang = BaseLanguageSwe;
	derElem.dir = "ltr";
	derElem.className = 'derivation';
	var tmp = document.createElement('span');
	derElem.appendChild(tmp);

	var head = document.createElement('span');
	head.className = 'clickableHeading';
	var mid = document.createElement('span');
	if(longest > 1) {
	    head.textContent = "Avledningar";
	} else if(longest == 1) {
	    head.textContent = "Avledning";
	}
	mid.textContent = ": ";
	tmp.appendChild(head);
	tmp.appendChild(mid);
	tmp.lang = BaseLanguageSwe;
	tmp.dir = "ltr";
	
	var uElem = document.createElement('ul');
	uElem.className = 'derivationList';
	derElem.appendChild(uElem);

	for(var c = 0; c < longest; c++) {
	    var li = document.createElement('li');
	    let show = 0;

	    if(c < der1.length) {
		let prevTexts = [];
		for(const lang in der1[c]) {
		    let thisText = der1[c][lang];
		    if(!prevTexts.includes(thisText)) {
			let tmp = document.createElement('span');

			if(prevTexts.length > 0) {
			    tmp.appendChild(makeWordsClickable(", " + thisText));
			} else {
			    tmp.appendChild(makeWordsClickable(thisText));
			}
			prevTexts.push(thisText);			

			tmp.lang = BaseLanguageSwe; // The first part is the Swedish derivation
			tmp.dir = "ltr";
			
			li.appendChild(tmp);
			
			if(showAll || relevant(thisText, baseForms)) {
			    show = 1;
			    atLeastOne = 1;
			}
		    }
		}
		let tmp = document.createElement('span');
		tmp.textContent = " \u2014 ";
	        tmp.dir = "ltr";
		li.appendChild(tmp);		
	    }

	    if(c < der2.length) {
		for(const lang in der2[c]) {
		    let tmp;
		    
		    if(moreThanOneLanguage) {
			li.appendChild(createLanguageIndidator(lang, " "));
		    }
		    
		    tmp = document.createElement('span');
		    tmp.textContent = der2[c][lang];
                    assignLang(tmp, lang);
		    li.appendChild(tmp);

		    if(showAll || relevant(der2[c][lang], baseForms)) {
			show = 1;
			atLeastOne = 1;
		    }
		}
	    }

	    if(!show) {
		li.className += ' notRelevant';
	    }
	    uElem.appendChild(li);
	}
	
	if(!atLeastOne) {
	    derElem.className += ' notRelevant';
	}

	parentElement.appendChild(derElem);

    } else {
	var derElem = document.createElement('div');
	derElem.lang = BaseLanguageSwe;
	derElem.dir = "ltr";
	derElem.className = 'derivation';
	var tmp = document.createElement('span');
	derElem.appendChild(tmp);

	var head = document.createElement('span');
	head.className = 'clickableHeading';
	var mid = document.createElement('span');
	if(der1.length > 1) {
	    head.textContent = "Avledningar";
	} else if(der1.length == 1) {
	    head.textContent = "Avledning";
	}
	mid.textContent = ": ";
	tmp.appendChild(head);
	tmp.appendChild(mid);
	tmp.lang = BaseLanguageSwe;
	tmp.dir = "ltr";
	
	var uElem = document.createElement('ul');
	uElem.className = 'derivationList';
	derElem.appendChild(uElem);

	let prevTexts = [];
	for(var c = 0; c < der1.length; c++) {
	    for(const lang in der1[c]) {
		let thisText = der1[c][lang];
		if(!prevTexts.includes(thisText)) {
		    prevTexts.push(thisText);
		    
		    var li = document.createElement('li');

		    li.appendChild(makeWordsClickable(der1[c][lang]));
		    li.lang = BaseLanguageSwe; // first part is the Swedish derivation
		    li.dir = "ltr";
		    uElem.appendChild(li);

		    if(showAll || relevant(der1[c], baseForms)) {
			atLeastOne = 1;
		    } else {
			li.className += ' notRelevant';
		    }
		}
	    }
	}

	if(!atLeastOne) {
	    derElem.className += ' notRelevant';
	}
	
	parentElement.appendChild(derElem);
    }
}

function makeWordsClickable(text, allWords) {
    let res = document.createElement('span');

    // deal with <i> tags in the text
    let p = text.indexOf("<i>");
    let p2 = text.indexOf("</i>");
    if(p >= 0 && p2 > p) {
	let head = text.substring(0, p);
	let mid = text.substring(p + 3, p2);
	let tail = text.substring(p2 + 4);
	let headEl = makeWordsClickable(head, allWords);
        let midEl = makeWordsClickable(mid, allWords);
	let tailEl = makeWordsClickable(tail, allWords);
	res = headEl;
        midEl.style.fontStyle = 'italic';
	res.appendChild(midEl);
	res.appendChild(tailEl);
    } else if(text) {
	const words = text.split(/\s/);
	
	let lastPos = 0;

	let unclickable = "";
	
	for(let i = 0; i < words.length; i++)  {
	    let w = words[i];

	    if(w != "") {
		w = w.replace(/^[|.,:;()\"]*/, "");
		w = w.replace(/[|.,:;()\"]*$/, "");
		
		if(allWords || isIndexed(w.replace("|", ""))) {
		    let el = document.createElement('span');
		    
		    let pos = text.indexOf(w, lastPos);
		    if(pos > lastPos) {
			unclickable += text.substring(lastPos, pos);
		    }
		    if(unclickable != "") {
			el.textContent = unclickable;
			res.appendChild(el);
			unclickable = "";
			el = document.createElement('span');
		    }
		    
		    el.className = 'longClickLink';
		    el.textContent = w;
		    res.appendChild(el);
		    lastPos = pos + w.length;
		} else {
		    let pos = text.indexOf(w, lastPos);
		    unclickable += text.substring(lastPos, pos + w.length);
		    lastPos = pos + w.length;
		}
	    }
	}
	unclickable += text.substring(lastPos);
	
	if(unclickable != "") {
	    let el = document.createElement('span');
	    el.textContent = unclickable;
	    res.appendChild(el);
	    unclickable = "";
	}
    }
    return res;
}

function explToHTML(parentElement, ex1, ex2, baseForms, showAll) {
    let show = showAll;
    if(ex2) {
	var exElem = document.createElement('div');
	exElem.className = 'explanation';
	// No settings for explanations?

	var wrap = document.createElement('span');
	var head = document.createElement('span');
	head.textContent = "\u25C7 Förklaring";
	head.lang = BaseLanguageSwe;
	head.dir = "ltr";
	head.className = 'clickableHeading';
	wrap.appendChild(head);

	var mid = document.createElement('span');
	mid.textContent = ": ";
	wrap.appendChild(mid);

	let prevTexts = [];
	for(const lang in ex1) {
	    let thisText = ex1[lang];
	    if(!prevTexts.includes(thisText)) {
		let tmp = undefined;
		if(prevTexts.length > 0) {
		    tmp = makeWordsClickable(", " + ex1[lang]);
		} else {
		    tmp = makeWordsClickable(ex1[lang]);
		}
		prevTexts.push(thisText);
		
		tmp.lang = BaseLanguageSwe; // first part is the Swedish text
		tmp.dir = "ltr";
		
		wrap.appendChild(tmp);

		if(show || relevant(thisText, baseForms)) {
		    show = 1;
		}
	    }
	}

	exElem.appendChild(wrap);
	exElem.appendChild(document.createElement('br'));

	let langs = 0;
	for(let lang in ex2) {
	    langs++;
	}
	if(langs <= 1) {
	    for(const lang in ex2) {
		let tail = document.createElement('span');
		tail.textContent = "(" + ex2[lang] + ")"; // TODO: make foreign language words clickable too?

                assignLang(tail, lang);

		exElem.appendChild(tail);

		if(show || relevant(ex2[lang], baseForms)) {
		    show = 1;
		}
	    }
	} else {
	    for(const lang in ex2) {
		exElem.appendChild(createLanguageIndidator(lang, " "));
		
		let tail = document.createElement('span');
		tail.textContent = ex2[lang]; // TODO: make foreign language words clickable too?
                assignLang(tail, lang);

		exElem.appendChild(tail);
		
		exElem.appendChild(document.createElement('br'));

		if(show || relevant(ex2[lang], baseForms)) {
		    show = 1;
		}
	    }
	}
	
	if(!show) {
	    exElem.className += ' notRelevant';
	}
	parentElement.appendChild(exElem);

    } else {
	var exElem = document.createElement('div');
	exElem.className = 'explanation';
	// No settings for explanations?

	var wrap = document.createElement('span');	
	var head = document.createElement('span');	
	head.textContent = "\u25C7 Förklaring";
	head.lang = BaseLanguageSwe;
	head.dir = "ltr";
	head.className = 'clickableHeading';

	let mid = document.createElement('span');
	mid.textContent = ": ";

	wrap.appendChild(head);
	wrap.appendChild(mid);
	
	let first = 1;
	for(const lang in ex1) {
	    if(first) {
		first = 0;
		wrap.appendChild(makeWordsClickable(ex1[lang]));
	    } else {
		wrap.appendChild(makeWordsClickable(" \u2014 " + ex1[lang]));		
	    }
	}
	wrap.lang = BaseLanguageSwe;
	wrap.dir = "ltr";
	
	exElem.appendChild(wrap);

	let show = 0;
	if(showAll) {
	    show = 1;
	} else {
	    for(const lang in ex1) {
		if(relevant(ex1[lang], baseForms)) {
		    show = 1;
		    break;
		}
	    }
	}
	if(!show) {
	    exElem.className += ' notRelevant';
	}
	parentElement.appendChild(exElem);
    }
}

// ----------------------------------------------------------------------
// getPhonetic(js)
// ----------------------------------------------------------------------
// Phonetics are sometimes lists (only the Swedish lexicon?) and
// sometimes only one object (all other lexicon?).
// ----------------------------------------------------------------------
function getPhonetic(js) {
    var res = [];
    if(js) {
	for(const lang in js) {
	    const j = js[lang];
	    if(j.Content) {
		var tmp = {'ph':"", 'file':undefined};
		tmp.ph = j.Content;
		if(j.File) {
		    tmp.file = j.File
		}
		res.push(tmp);
		
		return res; // we need only one copy of phonetics even if we have matches in several lexicon
	    }
	    if(j.length && typeof j !== 'string') {
		for(var p = 0; p < j.length; p++) {
		    var tmp = {'ph':"", 'file':undefined};
		    if(j[p].Content) {
			tmp.ph = j[p].Content;
		    }
		    if(j[p].File) {
			tmp.file = j[p].File;
		    }
		    res.push(tmp);
		}
		return res; // we need only one copy of phonetics even if we have matches in several lexicon
	    }
	}
    }
    return res;
}

function getAbbr(js) {
    if(js) {
	for(const lang in js) {
	    if(js[lang].Content) {
		return js[lang].Content;
	    }
	}
    }
    return "";
}

// ----------------------------------------------------------------------
// getWord(js)
// ----------------------------------------------------------------------
// Pick up the matching word.
// ----------------------------------------------------------------------
function getWord(js) {
    var res = {'w':"", 'var':""};
    if(js && js.Value) {
	for(const lang in js.Value) {
	    res.w = js.Value[lang];
	    if(js.Variant && js.Variant[lang]) {
		res.var = js.Variant[lang];
	    }
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getBase(js, w)
// ----------------------------------------------------------------------
// Get the base language information (the Swedish information). Uses
// the word 'w' when building the list of inflected forms.
// ----------------------------------------------------------------------
function getBase(js, w) {
    var res = {
	"alt":undefined,
	"ant":undefined,
	"com":undefined,
	"comp":undefined,
	"der":undefined,
	"ex":undefined,
	"expl":undefined,
	"mean":undefined, 
	"grinf":undefined,
	"idi":undefined,
	"ill":undefined,
	"infl":undefined,
	"phon":undefined,
	"ref":undefined,
	"use":undefined
    };

    if(js) {
	if(js.Alternate) {
	    res.alt = getAlternate(js.Alternate);
	}
	if(js.Antonym) {
	    res.ant = getAntonyms(js.Antonym);
	}
	if(js.Comment) {
	    res.com = getComment(js.Comment);
	}
	if(js.Compound) {
	    res.comp = getCompound(js.Compound);
	}
	if(js.Derivation) {
	    res.der = getDerivations(js.Derivation);
	}
	if(js.Example) {
	    res.ex = getExamples(js.Example);
	}
	if(js.Explanation) {
	    res.expl = getExplanation(js.Explanation);
	}
	if(js.Graminfo) {
	    res.grinf = getGraminfo(js.Graminfo, w);
	}
	if(js.Idiom) {
	    res.idi = getIdioms(js.Idiom);
	}
	if(js.Illustration) {
	    res.ill = getIllustrations(js.Illustration);
	}
	if(js.Inflection) {
	    res.infl = getInflections(w, js.Inflection);
	}
	if(js.Meaning) {
	    res.mean = js.Meaning;
	}
	if(js.Phonetic) {
	    res.phon = getPhonetic(js.Phonetic);
	}
	if(js.Reference) {
	    res.ref = getReferences(js.Reference);
	}
	if(js.Usage) {
	    res.use = getUsage(js.Usage);
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getTarget(js)
// ----------------------------------------------------------------------
// Get the target language information (the foreign language
// information).
// ----------------------------------------------------------------------
function getTarget(js) {
    var res = {
	"ant":undefined,
	"com":undefined,
	"comp":undefined,
	"der":undefined,
	"ex":undefined,
	"expl":undefined,
	"idi":undefined,
	"syn":undefined,
	"trans":undefined,
	"cycle":undefined
    };
    
    if(js) {
	if(js.Antonym) {
	    res.ant = getAntonyms(js.Antonym);
	}
	if(js.Comment) {
	    res.com = getComment(js.Comment);
	}
	if(js.Compound) {
	    res.comp = getCompound(js.Compound);
	}
	if(js.Derivation) {
	    res.der = getDerivations(js.Derivation);
	}
	if(js.Example) {
	    res.ex = getExamples(js.Example);
	}
	if(js.Explanation) {
	    res.expl = getExplanation(js.Explanation);
	}
	if(js.Idiom) { // LSL3
	    res.idi = getIdioms(js.Idiom);
	}
	if(js.Idioms) { // LSL4
	    res.idi = getIdioms(js.Idioms);
	}
	if(js.Synonym) {
	    res.syn = getSynonyms(js.Synonym);
	}
	if(js.Translation) {
	    res.trans = [js.Translation];
	}
	if(js.Cycle) {
	    res.cycle = getCycles(js.Cycle);
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getSynonyms(js)
// ----------------------------------------------------------------------
// Get a list of non-empty synonym strings.
// ----------------------------------------------------------------------
function getSynonyms(js) {
    var res = {};
    if(js) {
	for(const lang in js) {
	    let rr = []
	    if(js[lang].length && typeof js[lang] !== 'string') {
		for(var s = 0; s < js[lang].length; s++) {
		    if(js[lang][s] != "") {
			rr.push(js[lang][s]);
		    }
		}
	    }
	    res[lang] = rr;
	}
    }
    return res;
}

function getExplanation(js) {
    if(js) {
	var res = {};
	for(const lang in js) {
	    if(js[lang].Content) {
		res[lang] = js[lang].Content; // lsl4
	    } else if(typeof js[lang] == 'string') {
		res[lang] = js[lang]; // lsl3
	    }
	}
	return res;
    }
    return {};
}

// ----------------------------------------------------------------------
// getExamples(js)
// ----------------------------------------------------------------------
// 
// ----------------------------------------------------------------------
function getExamples(js) {
    var res = [];
    if(js) {
	for(const lang in js) {
	    for(var ex = 0; ex < js[lang].length; ex++) {
		if(js[lang][ex].Content) {
		    if(ex >= res.length) {
			var tmp = {};
			tmp[lang] = js[lang][ex].Content;
			res.push(tmp);
		    } else {
			res[ex][lang] = js[lang][ex].Content;
		    }
		}
	    }
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getReferences(js)
// ----------------------------------------------------------------------
// References include antonyms, "see also", "compare to", and
// animation references.
// ----------------------------------------------------------------------
const referenceDict = {"antonym":"Motsats", "see":"Se", "compare":"Jämför", "animation":"Filmklipp"};
function getReferences(js) {
    var res = []
    if(js) {
	for(const lang in js) {
	    let j = js[lang];
    	    for(var ref = 0; ref < j.length; ref++) {
		if(referenceDict.hasOwnProperty(j[ref].Type)) {
		    if(ref >= res.length) {
			res.push({});
		    }
		    if(j[ref].Type && j[ref].Value) {
			res[ref][lang] = {'type':j[ref].Type, 'val':j[ref].Value};
		    }
		    if(j[ref].Spec) {
			res[ref][lang].spec = j[ref].Spec;
		    }
		} else {
		    console.log("WARNING: JSON contains reference of unknown type '" + j[ref].Type + "'. " + JSON.stringify(j));
		}
	    }
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getIdioms(js)
// ----------------------------------------------------------------------
// Get expressions the word is used in.
// ----------------------------------------------------------------------
function getIdioms(js) {
    var res = [];
    if(js) {
	for(const lang in js) {
	    for(var i = 0; i < js[lang].length; i++) {
		var tmp = {'h':"", 'd':""};
		
		if(js[lang][i].Content && js[lang][i].Content != "") {
		    tmp.h = js[lang][i].Content;
		}
		if(js[lang][i].Definition) {
		    if(js[lang][i].Definition.Content) {
			tmp.d = js[lang][i].Definition.Content;
		    }
		}

		if(js[lang][i].Translation) {
		    let hh = [];
		    let dd = [];
		    for(let tr = 0; tr < js[lang][i].Translation.length; tr++) {
			if(js[lang][i].Translation[tr].Content) {
			    hh.push(js[lang][i].Translation[tr].Content);
			}
			if(js[lang][i].Translation[tr].Definition) {
			    dd.push(js[lang][i].Translation[tr].Definition);
			}
		    }
		    if(hh.length > 0) {
			tmp.h = hh.join(", ");
		    }
		    if(dd.length > 0) {
			tmp.d = dd.join(", ");
		    }
		}
		
		if(i >= res.length) {
		    let t = {};
		    t[lang] = tmp;
		    res.push(t);
		} else {
		    res[i][lang] = tmp;
		}
	    }
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getDefinition(js)
// ----------------------------------------------------------------------
// Get definition string, or empty string if no 'Content' field.
// ----------------------------------------------------------------------
function getDefinition(js) {
    if(js) {
	for(const lang in js) {
	    if(js[lang].Content) {
		return js[lang].Content;
	    }
	}
    }
    return "";
}

// ----------------------------------------------------------------------
// getAlternate(js)
// ----------------------------------------------------------------------
// Get alternate forms.
// ----------------------------------------------------------------------
function getAlternate(js) {
    var res = [];
    if(js) {
	for(const lang in js) {
	    const j = js[lang];
	    if(j.length && typeof j !== 'string') { // lsl4 looks like this
		for(var a = 0; a < j.length; a++) {
		    if(j[a].Content) {
			res.push(j[a].Content); // TODO: also has Phonetic and Spec, but all info is also in js.Value so maybe ignore js.Alternate?
		    }
		}
	    } else {
		res.push(j); // lsl3 lookups look like this
	    }
	    
	    break;
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getAntonyms(js)
// ----------------------------------------------------------------------
// Get antonyms.
// ----------------------------------------------------------------------
function getAntonyms(js) {
    var res = [];
    if(js) {
	for(const lang in js) {
	    let j = js[lang];
	    if(j.length && typeof j != 'string') {
		for(var a = 0; a < j.length; a++) {
		    if(j[a].length > 0) {
			if(a >= res.length) {
			    res.push({});
			}
			res[a][lang] = j[a];
		    }
		}
	    } else if(j.Content) {
		if(res.length <= 0) {
		    res.push({});
		}
		res[0][lang] = j.Content;
	    } else {
		if(res.length <= 0) {
		    res.push({});
		}
		res[0][lang] = j;
	    }
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getIllustrations(js)
// ----------------------------------------------------------------------
// Get links to illustrations. 
// ----------------------------------------------------------------------
function getIllustrations(js) {
    var res = [];
    if(js) {
	for(const lang in js) {
	    let j = js[lang];
	    for(var i = 0; i < j.length; i++) {
		if(j[i].Value && j[i].Type && j[i].Type == "picture") {
		    res.push(j[i].Value);
		}
	    }
	    break;
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getCompound(js)
// ----------------------------------------------------------------------
// Get componds a word can be used in.
// ----------------------------------------------------------------------
function getCompound(js) {
    var res = [];
    if(js) {
	for(var lang in js) {
	    let j = js[lang];
	    for(var cc = 0; cc < j.length; cc++) {
		var tmp = {};
		if(j[cc].Content) {
		    tmp.w = j[cc].Content;
		}
		if(j[cc].ID) {
		    tmp.id = j[cc].ID;
		}
		if(j[cc].Inflection) {
		    tmp.infl = j[cc].Inflection; // array of strings
		}

		if(cc >= res.length) {
		    let t = {};
		    t[lang] = tmp;
		    res.push(t);
		} else {
		    res[cc][lang] = tmp;
		}
	    }
	}
    }
    
    return res;
}

// ----------------------------------------------------------------------
// getLexeme(js)
// ----------------------------------------------------------------------
// This seems to be only for the Swedish-Swedish lookups.
// ----------------------------------------------------------------------
function getLexeme(js) {
    var res = [];

    if(js) {
	for(var l = 0; l < js.length; l++) {
	    const lex = js[l];
	    
	    var tmp = {};

	    if(lex.Abbreviate) {
		tmp.abbr = getAbbr(lex.Abbreviate);
	    }
	    if(lex.Comment) {
		tmp.com = getComment(lex.Comment);
	    }
	    if(lex.Compound) {
		tmp.comp = getCompound(lex.Compound);
	    }
	    if(lex.Cycle) {
		tmp.cycle = getCycles(lex.Cycle);
	    }
	    if(lex.Definition) {
		tmp.def = getDefinition(lex.Definition);
	    }
	    if(lex.Example) {
		tmp.ex = getExamples(lex.Example);
	    }
	    if(lex.Explanation) {
		tmp.expl = getExplanation(lex.Explanation);
	    }
	    if(lex.Gramcom) {
		tmp.gramComment = getGramcom(lex.Gramcom);
	    }
	    if(lex.Graminfo) {
		tmp.grinf = getGraminfo(lex.Graminfo);
	    }
	    if(lex.Idioms) {
		tmp.idi = getIdioms(lex.Idioms);
	    }
	    if(lex.Illustration) {
		tmp.ill = getIllustrations(lex.Illustration);
	    }
	    if(lex.Reference) {
		tmp.ref = getReferences(lex.Reference);
	    }
	    if(lex.TargetLang) {
		tmp.targ = getTarget(lex.TargetLang);
	    }
	    if(lex.Lexemeno) {
		tmp.lexno = lex.Lexemeno;
	    }

	    res.push(tmp);
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getDerivations(js)
// ----------------------------------------------------------------------
// This is an array in the JSON, but seems to always have 1 element.
// ----------------------------------------------------------------------
function getDerivations(js) {
    var res = [];
    for(const lang in js) {
	if(js[lang].length && typeof js[lang] !== 'string') {
	    for(var g = 0; g < js[lang].length; g++) {
		if(js[lang][g].Content) {
		    if(g >= res.length) {
			res.push({});
		    }
		    res[g][lang] = js[lang][g].Content;
		}
	    }
	}
    }
    return res;
}

class GraminfoWord {
    capturedWord;
    spaceBefore;

    constructor(word) {
        this.capturedWord = word;
        this.spaceBefore = false;
    }

    stringValue() {
        return this.capturedWord;
    }

    expandedValue() {
        let span = document.createElement('span');
	span.textContent = this.capturedWord.replace("|", "") + " ";
        return span;
    }

    toString() {
        return this.stringValue();
    }
}

class GraminfoGeneric {
    s;
    spaceBefore;

    constructor(s) {
        this.s = s;
        this.spaceBefore = false;
    }

    stringValue() {
        return this.s;
    }

    expandedValue() {
        let span = document.createElement('span');
	span.textContent = this.s;
        return span;
    }

    toString() {
        return this.stringValue();
    }
}

class GraminfoVariable {
    s;
    expanded;
    spaceBefore;

    constructor(s) {
        if (s == "A" || s == "B" || s == "C" || s == "ngn") {
            this.expanded = "någon";
        } else if (s == "x" || s == "y" || s == "z" || s == "ngt") {
            this.expanded = "något";
        } else if (s == "S") {
            this.expanded = "sats";
        } else {
            this.expanded = s.toLowerCase();
        }
        this.s = s;
        this.spaceBefore = false;
    }

    stringValue() {
        return this.s;
    }

    expandedValue() {
        let span = document.createElement('span');
	span.textContent = this.expanded;
	span.className = "metavariable";
        return span;
    }

    toString() {
        return this.stringValue();
    }
}

function graminfoString(l) {
    return l.map(graminfo => graminfo.map(e => e.toString()).join("")).join(";");
}

function graminfoItem(s, w) {
    if (s == "&") {
        return new GraminfoWord(w)
    } else if (s == "A" || s == "B" || s == "C" || s == "x" || s == "y" || s == "z" || s == "ngn" || s == "ngt" || s == "några") {
        return new GraminfoVariable(s)
    } else if (["SATS", "INF", "VERB", "S", "ADJ", "PLATS", "RIKTNING", "RIKTNIG", "MÅTT", "SÄTT", "TAL", "TID", "FRÅGESATS", "PRED", "Sats", "SUMMA", "SUP", "TIDPUNKT"].includes(s)) {
        return new GraminfoVariable(s)
    } else {
        return new GraminfoGeneric(s)
    }
}


function graminfoFixes(s) {
    const patchesToGraminfo = {
	"& (på B/x; över x)":"& (på B/x); & (över x)", // this needs to be applied before splitting on ";"
	"& a":"& A",
	"a är & om b/x":"A är & om B/x",
	"a är & (som x)":"A är & (som x)",
	"a & att+SATS/att+INF":"A & att+SATS/att+INF:",
	"a & att+SATS/att+INF":"A & att+SATS/att+INF",
	"a kan inte hjälpa att + SATS":"A kan inte hjälpa att + SATS",
	"a låtsas inte om x/att + S":"A låtsas inte om x/att + S",
	"det & för a":"det & för A",
	"x & a":"x & A",
	"x & y/a":"x & y/A",
	"A & (b)":"A & (B)",
	"A & (b) för x/c/att + INF":"A & (B) för x/C/att + INF",
	"A & (B) för x/c/att + INF":"A & (B) för x/C/att + INF",
	"A & b + RIKTNING":"A & B + RIKTNING",
	"A & b (till) att+INF":"A & B (till) att+INF",
	"A & (b) x":"A & (B) x",
	"A & b x":"A & B x",
	"A & (för b (om x))":"A & (för B (om x))",
	"A & med b":"A & med B",
	"A & med b/x":"A & med B/x",
	"A & till b":"A & till B",
	"A & upp x/b":"A & upp x/B",
	"A & x (till b)":"A & x (till B)",
	"& (för b/x/att+INF)":"& (för B/x/att+INF)",
	"hjärtlig (mot b)":"hjärtlig (mot B)",
	"& (mot b)":"& (mot B)",
	"& (på b/x)":"& (på B/x)",
	"& på/ över x/b":"& på/ över x/B",
	"x/A & y/b":"x/A & y/B",
	"A & B/x/sig mot c/y":"A & B/x/sig mot C/y",
	"RIKTNIG":"RIKTNING",
	"att+VERB/SATS":"att+VERB/att+SATS"
    };

    for(let fix in patchesToGraminfo) {
	s = s.replace(fix, patchesToGraminfo[fix]);
    }
    return s;
}

// ----------------------------------------------------------------------
// getGraminfo(js)
// ----------------------------------------------------------------------
// Swedish results and bilingual results have different formats.
// ----------------------------------------------------------------------
function getGraminfo(js, w) {
    var res = {};
    if(js) {
	for(const lang in js) {
	    let rr = []
	    if(typeof js[lang] == 'string') { // lsl3 lookups 
		rr.push(graminfoFixes(js[lang]).split(/([\s/;()+])/).map(s => graminfoItem(s, w)));
	    } else if(js[lang].length && typeof js[lang] !== 'string') { // lsl4 lookups
		for(var g = 0; g < js[lang].length; g++) {
		    if(js[lang][g].Content) {
			rr.push(graminfoFixes(js[lang][g].Content).split(/([\s/;()+])/).map(s => graminfoItem(s, w)));
		    }
		}
	    }
	    res[lang] = rr;
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getGramcom(js)
// ----------------------------------------------------------------------
// Grammar related comment (?)
// Todo: This field can have HTML code such as <i> inside.
// ----------------------------------------------------------------------
function getGramcom(js) {
    var res = {};
    if(js) {
	for(const lang in js) {
	    let rr = [];
	    if(js[lang].Content) {
		rr.push(js[lang].Content);
	    }
	    res[lang] = rr;
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getUsage(js)
// ----------------------------------------------------------------------
// TODO: Check if this always is a string. Check if we can merge
// Usage, Gramcom, Graminfo.
// ----------------------------------------------------------------------
function getUsage(js) {
    if(js) {
	return js; // already correctly formatted {lang1:val1, ...}
    }
    return "";
}

// ----------------------------------------------------------------------
// getComment(js)
// ----------------------------------------------------------------------
// TODO: check if this can be single objects and arrays. Check for all
// places where comments can appear.
// ----------------------------------------------------------------------
function getComment(js) {
    var res = {};
    if(js) {
	for(const lang in js) {
	    var rr = []
	    if(js[lang].Content) {
		rr.push(js[lang].Content);
	    }
	    if(js[lang].length && typeof js[lang] !== 'string') {
		for(var c = 0; c < js[lang].length; c++) {
		    if(js[lang][c].Content) {
			rr.push(js[lang][c].Content);
		    }
		}
	    }
	    if(typeof js[lang] == 'string') {
		rr.push(js[lang]);
	    }
	    if(rr.length > 0) {
		res[lang] = rr;
	    }
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// getCycles(js)
// ----------------------------------------------------------------------
// 
// ----------------------------------------------------------------------
function getCycles(js) {
    var res = [];
    if(js) {
	for(var c = 0; c < js.length; c++) {
	    var tmp = {};
	    if(js[c].Abbreviate) {
		tmp.abbr = getAbbr(js[c].Abbreviate);
	    }
	    if(js[c].Comment) {
		tmp.com = getComment(js[c].Comment);
	    }
	    if(js[c].Compound) {
		tmp.comp = getCompound(js[c].Compound);
	    }
	    if(js[c].Definition) {
		tmp.def = getDefinition(js[c].Definition);
	    }
	    if(js[c].Example) {
		tmp.ex = getExamples(js[c].Example);
	    }
	    if(js[c].Graminfo) {
		tmp.grinf = getGraminfo(js[c].Graminfo);
	    }
	    if(js[c].Reference) {
		tmp.ref = getReferences(js[c].Reference);
	    }
	    if(js[c].Translation) {
		tmp.trans = [js[c].Translation];
	    }

	    res.push(tmp);
	}
    }
    return res;
}

let multilangDisplay = "none";

/* --------- TURN ON SINGLE/MULTIPLE LANGUAGE SETTING --------- */
function multiLangOrNot() {
	// show several languages
    if (settings.multiple_languages.val) {
		// current display already shows that?
		if (multilangDisplay == "multi") {
			return;
		}
    } 
	// show single language
	else {
		// current display already shows that?
		if (multilangDisplay == "single") {
			return;
		}
    }

    let lc = $(".select-wrapper");
    $(".multilang-wrapper").remove();

	// turn on several languages
    if(settings.multiple_languages.val) {
		// hide single language dropdown
		lc.css("display", "none");

		// add new button
		let multilangchoicebutton = $("<div class='multilang-wrapper'><button id='multiLanguageChoiceButton'>Välj språk</button></div>");
		lc.after(multilangchoicebutton);

		let multilangchoice = $("#multilangchoice");
		let columnwrapper = $("<div class='multilangcolumnwrapper'></div>");
		
		// build language array
		let languages = $("#languageChoice").children("option").map((i, e) => {
			let langcode = $(e).attr("value");
			let langname = $(e).text();
			return {code:langcode,name:langname}
		}).get();

		// divide language options into two columns
		let halfway = (languages.length-1) / 2 + 1;
		let firsthalf = languages.slice(0, halfway);
		let secondhalf = languages.slice(halfway);
		for (let langhalf of [firsthalf, secondhalf]) {
			let column = $("<div class='multilangcolumn'></div>");
			for (let lang of langhalf) {
				let langcheckbox = $("<input type='checkbox' name='multilangchoice'>");
				langcheckbox.attr("value", lang.code);
				langcheckbox.attr("id", "multilangchoice-" + lang.code);
				let langcheckbox_wrapper = $("<div class='langcheckboxWrapper'>	  	  	  </div>");
				langcheckbox_wrapper.append(langcheckbox);
				let langcheckbox_label = $("<label>Avledningar</label>");
				langcheckbox_label.attr("for", "multilangchoice-" + lang.code);
				langcheckbox_wrapper.append(langcheckbox_label);
				langcheckbox_label.text(lang.name);
				column.append(langcheckbox_wrapper);
			}
			columnwrapper.append(column)
		}

		// insert language options on page
		$(multilangchoice).append(columnwrapper);
		$("#theForm").append(multilangchoice);

		// clicking "choose language" (SE: "Välj språk") button 
		multilangchoicebutton.click((e) => {
			let active = multilangchoice.is(":visible");
			dismissSettings();
			if (active) {
				$("#multilangchoice").hide();
				e.preventDefault();
				return;
			}
			
			$(".settingsIcon").addClass("change");
			$("#multilangchoice").show();
			e.preventDefault();
		});

		let selectedLanguages = [$("#languageChoice")[0].value];
		setMultilangchoice(selectedLanguages);
		multilangDisplay = "multi";
    } 
	// turn on single language
	else {
		// TODO: what do we do if there is more than one selected language?
		let selectedLanguages = getMultilangchoice();
		if (selectedLanguages.length > 0) {
			$("#languageChoice")[0].value = selectedLanguages[0];
		} else {
			$("#languageChoice")[0].value = "swe";
		}

		lc.css("display", "block");
		$("#multilangchoice").empty();
		multilangDisplay = "single";
    }
}

/* --------- CHECK WHICH LANGUAGES ARE CHECKED --------- */
function getMultilangchoice() {
    let lexicons = [];

    for (let langchoicewrapper of $("#multilangchoice .multilangcolumn").children(".langcheckboxWrapper")) {
		let langchoice = $(langchoicewrapper).find("input");
		let langcode = $(langchoice).attr("value");
		if (langchoice[0].checked) {
			// console.log(langcode);
			lexicons.push(langcode);
		}
    }

    return lexicons;
}

function getSelectedLexicon() {
//    console.log("getSelectedLexicon");
    let dicts = $("#languageChoice");
    if(!dicts?.length) {
        return [];
    }

    let lexiconEl = dicts[0];
    if(!lexiconEl) {
        return [];
    }

    let lexicons;
    if(settings.multiple_languages.val) {
	lexicons = getMultilangchoice();
    } else {
        lexicons = [lexiconEl.value];
    }
    return lexicons.filter(opt => languageMap.hasOwnProperty(opt));
}

function setMultilangchoice(list) {
    console.log("setMultilangchoice", list);
    for (let langchoicewrapper of $("#multilangchoice .multilangcolumn").children(".langcheckboxWrapper")) {
	let langchoice = $(langchoicewrapper).find("input");
	let langcode = $(langchoice).attr("value");
	langchoice[0].checked = list.includes(langcode);
    }
}

function setSelectedLexicon(list) {
    let dicts = $("#languageChoice");
    if(dicts && dicts.length) {
    	let lexiconEl = dicts[0];
    	if(lexiconEl) {
    	    if(list.length > 1) {
    		if(!settings.multiple_languages.val) {
    		    settings.multiple_languages.val = 1;
		    multiLangOrNot();
    		}
    		let options = lexiconEl.options;
		setMultilangchoice(list);
    	    } else if(list.length == 1) {
    		if(settings.multiple_languages.val) {
		    setMultilangchoice(list);
    		} else {
    		    lexiconEl.value = list[0];
    		}
    	    }
    	}
    }
}

function inArrayAsContent(arr, w) {
    for(let i = 0; i < arr.length; i++) {
	if(arr[i].Content && arr[i].Content.replace("|", "") == w.replace("|", "")) {
	    return 1;
	}
    }
    return 0;
}
function inArrayAsSubstr(arr, w) {
    for(let i = 0; i < arr.length; i++) {
	if(arr[i].Content) {
	    let ww = w.replace("|", "");
	    let aa = arr[i].Content.replace("|", "");
	    if(ww.indexOf(aa) >= 0 || aa.indexOf(ww) >= 0) {
		return 1;
	    }
	}
    }
    return 0;
}

function calculateScore(js, word, lang) {
    let score = 7;
    if(js.Value && cleanWord(js.Value[lang]) == word) {
	// matching word
	score = 0;
	
	if(js.TargetLang == undefined || js.TargetLang.Translation == undefined) {
	    score += 0.5; // prioritize any search results that have a translation over other similar results
	}
    } else if(js.BaseLang) {
	for(let lng in js.Value) {
	    if(score > 1 && js.BaseLang.Inflection && js.BaseLang.Inflection[lng] && inArrayAsContent(js.BaseLang.Inflection[lng], word)) {
		// inflection
		score = 1;
	    } else if(score > 2 && js.TargetLang && js.TargetLang.Translation && js.TargetLang.Translation[lng] && js.TargetLang.Translation[lng].indexOf(word) >= 0) {
		// translation
		score = 2;
	    } else if(score > 3 && cleanWord(js.Value[lng]).indexOf(word) >= 0 || word.indexOf(cleanWord(js.Value[lng])) >= 0) {
		// matching word substring
		const tmpW = cleanWord(js.Value[lng]);
		const p1 = tmpW.indexOf(word);
		const p2 = word.indexOf(tmpW);

		const d1 = tmpW.length - p1;
		const d2 = word.length - p2;

		if(p1 >= 0 && d1 == word.length) {
		    score = 3;
		} else if(p2 >= 0 && d2 == tmpW.length) {
		    score = 3;
		} else {
		    score = 4;
		}
	    } else if(score > 5 && ((js.BaseLang.Compound && js.BaseLang.Compound[lng] && inArrayAsSubstr(js.BaseLang.Compound[lng], word))
				    || (js.TargetLang && js.TargetLang.Compound && js.TargetLang.Compound[lng] && inArrayAsSubstr(js.TargetLang.Compound[lng], word)))) {
		// in compounds examples
		score= 5;
	    } else if(score > 6 && ((js.BaseLang.Example && js.BaseLang.Example[lng] && inArrayAsSubstr(js.BaseLang.Example[lng], word))
				    || (js.BaseLang.Meaning && js.BaseLang.Meaning[lng] && inArrayAsSubstr(js.BaseLang.Meaning[lng], word))
				    || (js.BaseLang.Idiom && js.BaseLang.Idiom[lng] && inArrayAsSubstr(js.BaseLang.Idiom[lng], word))
				    || (js.TargetLang &&
					((js.TargetLang.Example && js.TargetLang.Example[lng] && inArrayAsSubstr(js.TargetLang.Example[lng], word))
					 || (js.TargetLang.Meaning && js.TargetLang.Meaning[lng] && inArrayAsSubstr(js.TargetLang.Meaning[lng], word))
					 || (js.TargetLang.Idiom && js.TargetLang.Idiom[lng] && inArrayAsSubstr(js.TargetLang.Idiom[lng], word))
					))
				   )) {
		score = 6;
	    } else {
		if(score > 7) {
		    score = 7;
		}
	    }

	    if(js.TargetLang == undefined || js.TargetLang.Translation == undefined) {
		score += 0.5; // prioritize any search results that have a translation over other similar results
	    }
	}
    } else { // no baselang, so probably Swedish lexicon
	for(let lng in js.Value) {
	    if(score > 1 && js.Inflection && js.Inflection[lng] && inArrayAsContent(js.Inflection[lng], word)) {
		// inflections
		score = 1;
	    } else if(score > 3 && (cleanWord(js.Value[lng]).indexOf(word) >= 0
				    || word.indexOf(cleanWord(js.Value[lng])) >= 0)) {
		// matching word substring
		let tmpW = cleanWord(js.Value[lng]);
		const p1 = tmpW.indexOf(word);
		const p2 = word.indexOf(tmpW);

		const d1 = tmpW.length - p1;
		const d2 = word.length - p2;

		if(p1 >= 0 && d1 == word.length) {
		    score = 3;
		} else if(p2 >= 0 && d2 == tmpW.length) {
		    score = 3
		} else {
		    score = 4;
		}
	    } else if(score > 5 && js.Lexeme && js.Lexeme.Compound && js.Lexeme.Compound[lng] && inArrayAsSubstr(js.Lexeme.Compound[lng], word)) { // also cycles?
		// in compounds examples
		score = 5;
	    } else if(score > 6 && js.Lexeme) {
		for(let l = 0; l < js.Lexeme.length; l++)  {
		    let lex = js.Lexeme[l];
		    if((lex.Example && lex.Example[lng] && inArrayAsSubstr(lex.Example[lng], word))
		       || (lex.Meaning && lex.Meaning[lng] && inArrayAsSubstr(lex.Meaning[lng], word))
		       || (lex.Idiom && lex.Idiom[lng] && inArrayAsSubstr(lex.Idiom[lng], word))
		      ) {  // also cycles?
			score = 6;
		    }
		}
	    } else {
		if(score > 7) {
		    score = 7;
		}
	    }

	    score += 0.5; // prioritize any search results that have a translation over other similar results
	}
    }
    return score;
}

/* --------- DETERMINE ORDER OF SEARCH RESULTS --------- */
function rankSearchResults(results, searchQuery) {
    // 0 Rank exact match first
    // 1 Rank matches with search term in Inflections second
    // 2 Rank matches with search term in Translation next
    // 3 Rank matches that are themselves compound words with the search term as one part next, as the last part
    // 4 Rank matches that are themselves compound words with the search term as one part next, not as the last part
    // 5 Rank matches with Compounds examples with the search term next
    // 6 Rank matches with the search term in idioms or examples next
    // 7 Anything else

    let scores = [];
    let word = cleanWord(searchQuery);
    for(let r = 0; r < results.length; r++) {
		var js = results[r];
		let lang = results[r].lang;
		
		if(js) {
			let score = calculateScore(js, word, lang);
			scores.push({'v':score, 'obj':js});
		}
    }

    for(const score of scores) {
	//        console.log("score", score.v, score.obj.Value, score.obj.lang);
    }
    scores.sort((a, b) => {
        if (b.v < a.v) {
            return 1;
        }
        if (b.v > a.v) {
            return -1;
        }
        let a_is_swe = a.obj.lang == "swe";
        let b_is_swe = b.obj.lang == "swe";
        if (a_is_swe > b_is_swe) {
            return 1;
        }
        if (a_is_swe < b_is_swe) {
            return -1;
        }
        let a_word = a.obj.Value[a.obj.lang];
        let b_word = b.obj.Value[b.obj.lang];
        if (!a_word || !b_word) {
            return 0;
        }
        if (a_word > b_word) {
            return 1;
        }
        if (a_word < b_word) {
            return -1;
        }
        return 0;
    });

    for(const score of scores) {
//        console.log("score", score.v, score.obj.Value, score.obj.lang);
    }

    let res = [];
    for(let i = 0; i < scores.length; i++) {
	res.push(scores[i].obj);
    }

    res = reOrderResultsWithSeeReferences(res);
    
    return res;
}


function reOrderResultsWithSeeReferences(ls) {
    let res = [];
    let ses = {};
    let before = {};

    ls.forEach((entry, i) => {
	if(entry.Type && (entry.Type == "se" || Object.values(entry.Type).some(type => type == "se"))) {
	    ses[i] = i;
	}
        if (entry.Reference) {
	    ses[i] = i;
        }
    })

    for(let idx of Object.keys(ses)) {
	let js = ls[idx];
	let ref = "";
	let org = "";

        let reference_lsl3 = Object.values(js.BaseLang?.Reference ?? []).flat().find(reference => reference.Value && reference?.Type == "see");
        let reference_lsl4 = Object.values(js.Reference ?? []).flat().find(reference => reference.Value && reference?.Type == "see");
        if (reference_lsl3) {
	    org = reference_lsl3.Value;
        }

	if(reference_lsl4) {
	    org = reference_lsl4.Value;
	}

        if (!reference_lsl3 && !reference_lsl4) {
            return ls;
        }

	ref = stripHTMLetc(org);

	let candidates = [];

        ls.forEach((entry, i) => {
            if (Object.values(entry.Value).some(v => v == ref)) {
		candidates.push(i);
            }
	})

	// remove candidates from different LSL version
	candidates = candidates.filter(candidate => ls[candidate].lsl == js.lsl);


	// remove candidates using part-of-speech
        if(candidates.length > 1) {
            let pos = Object.keys(PoSnames).find(pos => org.indexOf(pos) > 0 && org.indexOf(pos) == org.length - pos.length);
            if(pos) {
                let fewer = candidates.filter(candidate => Object.values(ls[candidate].Type ?? {}).some(type => type == pos));
                if(fewer.length > 0) {
                    candidates = fewer;
                }
            }
        }


	if(candidates.length == 1) {
	    let candidate = candidates[0];
	    ses[idx] = candidate;
	    before[candidate] = idx;
	}
    }

    for(let i = 0; i < ls.length; i++) {
	if(ses.hasOwnProperty(i) && ses[i] != i) {
	    if(ses[i] < i) {
		// skip for now
	    } else {
		res.push(ls[i]);
		res.push(ls[ses[i]]);
	    }
	} else if(before.hasOwnProperty(i)) {
	    if(before[i] < i) {
		// skip here
	    } else {
		res.push(ls[before[i]]);
		res.push(ls[i]);
	    }
	} else {
	    res.push(ls[i]);
	}
    }
    
    return res;
}

var relevantExplanationElement = null;
function openPageDescription(elem) {
    
    if(!relevantExplanationElement) {
	relevantExplanationElement = document.createElement('div');
	relevantExplanationElement.className = 'LexinExplanationsWrapper';

	let inner = document.createElement('div');
	inner.className = 'LexinExplanations';


	inner.onclick = function(event) {
	    relevantExplanationElement.style.display = "none";
	}

	inner.onkeydown = function(event) {
	    if (event.key == "Escape") {
		relevantExplanationElement.style.display = "none";
	    }
	}

	relevantExplanationElement.onclick = function(event) {
	    relevantExplanationElement.style.display = "none";
	}

	relevantExplanationElement.onkeydown = function(event) {
	    if (event.key == "Escape") {
		relevantExplanationElement.style.display = "none";
	    }
	}
	
	relevantExplanationElement.style.top = 0;
	inner.style.height = "100%";

	relevantExplanationElement.appendChild(inner);
	document.body.appendChild(relevantExplanationElement);
    } 



    if(elem) {
	if(elem.className.indexOf('clickableHeading') >= 0) {

	    let inner = relevantExplanationElement.children[0];
	    
	    if(elem.textContent == '\u25C7 Förklaring') {		
		openHelpSakuppl(inner);
	    } else if(elem.className.indexOf('phonetic') >= 0) {
		openHelpPhon(inner, elem.textContent);
	    } else if(elem.className.indexOf('PoS') >= 0) {
		openHelpPoS(inner, elem.textContent);
	    } else if(elem.textContent.indexOf('Användning') >= 0) {
		openHelpUse(inner);
	    } else if(elem.textContent.indexOf('Konstruktioner') >= 0) {
		openHelpConstr(inner);
	    } else if(elem.textContent.indexOf('Motsats') >= 0) {
		openHelpAnt(inner);
	    } else if(elem.textContent == 'Jämför') {
		openHelpCompare(inner);
	    } else if(elem.textContent == 'Se') {
		openHelpSee(inner);
	    } else if(elem.textContent.indexOf('Avstavning') >= 0) {
		openHelpHyp(inner);
	    } else if(elem.textContent.indexOf('Förkortning') >= 0) {
		openHelpAbbr(inner);
	    } else if(elem.textContent.indexOf('Variantform') >= 0) {
		openHelpVar(inner);
	    } else if(elem.textContent.indexOf('Avledning') >= 0) {
		openHelpDer(inner);
	    } else if(elem.textContent.indexOf('Sammansättning') >= 0) {
		openHelpComps(inner);
	    } else if(elem.textContent == 'Uttryck') {
		openHelpIdioms(inner);
	    } else if(elem.textContent == 'Exempel') {
		openHelpExamples(inner);
	    } else if(elem.textContent.indexOf("Video") >= 0) {
		openHelpVideo(inner);
	    } else if(elem.textContent == 'referenceHead') {
		console.log("openPageDescription: Element is an unknown type of clickableHeading", elem);
	    } else {
		console.log("openPageDescription: Element is an unknown type of clickableHeading", elem);
	    }
	    relevantExplanationElement.style.display = 'block';
	    inner.focus();
	    $(inner).prepend('<button title="Stäng" class="closeHelp" type="button">	  <img src="/closebutton.svg">	</button>');

	    return;
	} else { // not 'clickableHeading'
	    console.log("openPageDescription: Element is not a clickableHeading", elem);
	}
    } else { // no 'elem'
	console.log("openPageDescription: No element, open help page");
    }
    // -----------------------------------------------------
    // Not a clickable heading, so typically the Help button
    // -----------------------------------------------------
    
    let searchBar = $("#theForm2")[0];
    if(searchBar) {
	searchBar.style.display = 'none';
    }
    
    let explDiv = $("#LexinExplanationsWrapper")[0];
    $("#LexinExplanationsWrapper").empty().append(helpElement);
    explDiv.style.display = 'block';

    if(!explDiv.onkeydown) {
	explDiv.onkeydown = function(event) {
	    if (event.key == "Escape") {
		explDiv.style.display = "none";
		if(searchBar) {
		    searchBar.style.display = 'block';
		}
	    }
	}
    }

    $(".LexinExplanations button.closeHelp").click(() => {
	explDiv.style.display = "none";
	if(searchBar) {
	    searchBar.style.display = 'block';
	}
    });
    
    let anchor = $("#LexinExplanations")[0];

    if(anchor) {
	anchor.scrollIntoView();
    }

    explDiv.focus();
}


// ----------------------------------------------------------------------
// jQuery.condShow(shouldBeShown)
// ----------------------------------------------------------------------
// Show or hide the element based on a boolean
// ----------------------------------------------------------------------

$.fn.condShow = function(shouldBeShown) {
    if (shouldBeShown) {
		this.show();
    } else {
		this.hide();
    }
};

// ----------------------------------------------------------------------
// initialShowHide()
// ----------------------------------------------------------------------
// Set the initial show()/hide() status of dynamically created
// elements.
// ----------------------------------------------------------------------

function initialShowHide() {
    // lemma list triggers
    /* // Turn off for now
    $(".matchingWord").on("click", function() {
	showLemmaList(this.textContent);
    });
    let ll = document.getElementById('lemmaList');
    if(ll && ll.style.display != 'none') {
	resizeLemmaList(ll);
    }
    */
    
	// SE: Avledningar
    $(".derivation").
	condShow(settings.derivations.val);

	// SE: Bilder
    $(".ill").
	condShow(settings.illustrations.val);

	// SE: Bildtema - THIS DOES NOT DO ANYTHING ATM
    $(".ims").
	condShow(settings.im.val);

	// CG ADD - FIX "DISABLE BILDTEMA" BUG
    $(".bildtemaLink").
	condShow(settings.btlink.val);

	// SE: Böjning
    $(".inflections").
	condShow(settings.inflections.val);

	// SE: Definition
    $(".meaning").
	condShow(settings.definition.val);

	// SE: Exempel
    $(".examples").
	condShow(settings.examples.val);

	// SE: Förkortningar
    $(".abbr").
	condShow(settings.abbr.val);

	// SE: Konstruktioner
    $(".gramInfo").
	condShow(settings.constructions.val);

	// SE: Motsatser
    $(".antonym").
	condShow(settings.antonyms.val);

	// SE: Ordklass
    $(".PoS").
	condShow(settings.pos.val);

	// SE: Sammansättningar
    $(".compounds").
	condShow(settings.compounds.val);

	// SE: Svenska kommentarer
    $(".comment_se").
	condShow(settings.comments_se.val);

	// SE: Synonymer till översättningar
    $(".synonyms").
	condShow(settings.synonyms.val);

	// SE: Uppslagsord
    $(".matchingWord").
	condShow(settings.word.val);

	// SE: Uttal
    $(".pronunciation").			// class name
	condShow(settings.pron.val);	// settings name

	// SE: Uttryck
    $(".idioms").
	condShow(settings.expressions.val);

	// SE: Variantform
    $(".alt_form").
	condShow(settings.alt.val);

	// SE: Översättning
    $(".translation").
	condShow(settings.translation.val);

	// SE: Översättningskommentarer
    $(".comment_tr").
	condShow(settings.comments_other.val);


//    if(settings.expand.val) {
//	$(".notRelevant").show();
//    } else {
	$(".notRelevant").hide();
//    }
    
    $(".PoS").addClass("clickableHeading");
    $(".phonetic").addClass("clickableHeading");
    $(".referenceHead").addClass("clickableHeading");

    if(settings.clickable_headings.val) {
	$(".clickableHeading").addClass('makeClickableHeadingsStandOut');
	
	$(".clickableHeading").off('click');
	$(".clickableHeading").on('click', function () {
	    openPageDescription(this);
	});
    }
    
    if(settings.clickable_words.val && false) { /* Turn off for now */
	$(".longClickLink").addClass('makeClickableStandOut');
	
	$(".longClickLink").off('dblclick');
	$(".longClickLink").on('dblclick', function () {
	    $("#searchQuery").val(this.textContent);
	    callLexin(true);
	});

	$(".longClickLink").off('mousedown');
	$(".longClickLink").off('mouseup');
	$(".longClickLink").off('mousemove');
	$(".longClickLink").off('mouseleave');

	$(".longClickLink").off('touchstart');
	$(".longClickLink").off('touchend');
	$(".longClickLink").off('touchcancel');
	$(".longClickLink").off('touchmove');
	$(".longClickLink").off('touchleave');

	$(".longClickLink").on('mousedown', function(e) {
	    touchStart(e, this.textContent);
            // $("#searchQuery").val(this.textContent);
            // callLexin(true);
	});
	$(".longClickLink").on('mouseup', function(e) {
	    if(touchTimer) {
		clearTimeout(touchTimer);
		touchTimer = null;
	    }
	});
	$(".longClickLink").on('mouseleave', function(e) {
	    if(touchTimer) {
		clearTimeout(touchTimer);
		touchTimer = null;
	    }
	});
	$(".longClickLink").on('mousemove', function(e) {
	    if(touchTimer && touchStartPos) {
		if(Math.abs(touchStartPos.x - e.clientX) >= touchMoveLimit
		   || Math.abs(touchStartPos.y - e.clientY) >= touchMoveLimit) {
		    clearTimeout(touchTimer);
		    touchTimer = null;
		}
	    }
	});

	$(".longClickLink").on('touchstart', function(e) {
	    touchStart(e, this.textContent);
	});
	$(".longClickLink").on('touchcancel', function(e) {
	    if(touchTimer) {
		clearTimeout(touchTimer);
		touchTimer = null;
	    }
	});
	$(".longClickLink").on('touchend', function(e) {
	    if(touchTimer) {
		clearTimeout(touchTimer);
		touchTimer = null;
	    }
	});
	$(".longClickLink").on('touchleave', function(e) {
	    if(touchTimer) {
		clearTimeout(touchTimer);
		touchTimer = null;
	    }
	});
	$(".longClickLink").on('touchmove', function(e) {
	    if(touchTimer && touchStartPos) {
		if(Math.abs(touchStartPos.x - e.clientX) >= touchMoveLimit
		   || Math.abs(touchStartPos.y - e.clientY) >= touchMoveLimit) {
		    clearTimeout(touchTimer);
		    touchTimer = null;
		}
	    }
	});

    } else {
	$(".longClickLink").removeClass('makeClickableStandOut');

	$(".longClickLink").off('dblclick');
	$(".longClickLink").off('mousedown');
	$(".longClickLink").off('mouseup');
	$(".longClickLink").off('mousemove');
	$(".longClickLink").off('mouseleave');
	$(".longClickLink").off('touchstart');
	$(".longClickLink").off('touchend');
	$(".longClickLink").off('touchcancel');
	$(".longClickLink").off('touchmove');
	$(".longClickLink").off('touchleave');
    }
}

// ----------------------------------------------------------------------
// Simulate long-press on mobile devices where double click is not typically used.
// ----------------------------------------------------------------------
let touchTimer = null;
let touchStartPos = null;
const touchTimerDuration = 900; // how long do you have to press and hold to count as longpress
const touchMoveLimit = 10; // how much movement is allowed while still counting as longpress
function touchStart(e, word) {
    if (!touchTimer) {
	touchStartPos = { 'x':e.clientX, 'y':e.clientY };
        touchTimer = setTimeout(function () {
	    touchTimer = null;
	    touchStartPos = null;
            $("#searchQuery").val(word);
            callLexin(true);
	}, touchTimerDuration);
    }
}

// ----------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------
// Todo: maybe this should be in settings.js?
// ----------------------------------------------------------------------
var settings = {
    'multiple_languages':{'text':'Sök på flera språk samtidigt.', 'val':0},
    'clickable_words':{'text':'Tillåt sökning genom att klicka på sökbara ord.', 'val':1},
    'clickable_headings':{'text':'Gör rubriker klickbara för att öppna hjälptext.', 'val':1},
    'add_swedish_results':{'text':'Lägg till enspråkiga svenska resultat vid sökning i tvåspråkiga lexikon.', 'val':0},
    
    'completion':{'text':'Visa kompletteringsförslag under sökrutan.', 'val':1},
    'keyb_se':{'text':'Visa alltid svenskt tangentbord med å, ä, ö.', 'val':0},
    'keyb_other':{'text':'Visa alltid tangentbord för språk med andra skrivtecken.', 'val':0},
    'corr':{'text':'Visa även liknande ord (t.ex. om du har stavat fel).', 'val':1},
    'expand':{'text':'Expandera uppslagningsresultaten.', 'val':0},
    
    'derivations':{'text':'avledningar', 'val':1},
    'illustrations':{'text':'bilder', 'val':1},
    'im':{'text':'bildtema', 'val':1},
    'inflections':{'text':'böjning', 'val':1},
    'definition':{'text':'definition', 'val':1},
    'examples':{'text':'exempel', 'val':1},
    'abbr':{'text':'förkortningar', 'val':1},
    'constructions':{'text':'konstruktioner', 'val':1},
    'antonyms':{'text':'motsatser', 'val':1},
    'pos':{'text':'ordklass', 'val':1},
    'compounds':{'text':'sammansättningar', 'val':1},
    'comments_se':{'text':'svenska kommentarer', 'val':1},
    'synonyms':{'text':'synonymer till översättningar', 'val':1},
    'word':{'text':'uppslagsord', 'val':1},
    'pron':{'text':'uttal', 'val':1},

	// CG ADD - FIX "DISABLE BILDTEMA LINK" BUG
	'btlink':{'text':'bildtemalänk', 'val':1},

    'expressions':{'text':'uttryck', 'val':1},
    'alt':{'text':'variantform', 'val':1},
    'translation':{'text':'översättning', 'val':1},
    'comments_other':{'text':'översättningskommentarer ', 'val':1}
}

// ----------------------------------------------------------------------------------
// savedWords
// ----------------------------------------------------------------------------------
// Search queries saved by the user using the "Save Word"
// option. Todo: maybe this should be in saveWords.js
// ----------------------------------------------------------------------------------
var savedWords = [];

// ----------------------------------------------------------------------------------
// saveToLocalStorage
// ----------------------------------------------------------------------------------
// Save "saved words" and settings to local storage to remember them
// for the next session.
// ----------------------------------------------------------------------------------
function saveToLocalStorage() {
    if (typeof Storage !== 'undefined') {
	localStorage.settings = JSON.stringify(settings);
	localStorage.savedWords = JSON.stringify(savedWords);
    }
}

// ----------------------------------------------------------------------------------
// loadFromLocalStorage
// ----------------------------------------------------------------------------------
// Load settings from previous sessions. Also load "saved words",
// previous search queries saved by the user.
// ----------------------------------------------------------------------------------
function loadFromLocalStorage() {
    if (typeof Storage !== 'undefined') {

	if(localStorage.settings !== 'undefined') {
	    try {
		var tmp = JSON.parse(localStorage.settings);
		for(const prop in settings) {
		    if(tmp.hasOwnProperty(prop)) {
			settings[prop] = tmp[prop];
		    }
		}
		$(document).trigger("lexin_settings_loaded");
	    } catch(e) {
		console.log("WARNING: Local storage settings corrupt? Using default settings.");
	    }
	}

	multiLangOrNot();
	
	if(localStorage.savedWords !== 'undefined') {
	    try {
		var tmp = JSON.parse(localStorage.savedWords);
		savedWords = tmp;
	    } catch(e) {
		console.log("WARNING: Local storage list of saved words corrupt?");
	    }
	}
    }
}

// --------------------------------------------------------------------
// When the browser tab is unloaded (i.e. the user leaves the site in
// some way), save our state to the local storage so the user settings
// are remembered next time the user comes back.
// --------------------------------------------------------------------
window.onbeforeunload = function (event) {
    saveToLocalStorage();
    return false;
};



// --------------------------------------------------------------------
// registerPartsselectionUpdate(selector, settingsName)
// --------------------------------------------------------------------
// Register conditional show/hide update for parts selection
// --------------------------------------------------------------------
function registerPartsselectionUpdate(selector, settingsName) {
    $(document).on("lexin_settingsupdate_" + settingsName, function () {
		$(selector).condShow(settings[settingsName].val);
    });
}

class PromisedVariable {
    promise;
    resolve;
    
    constructor(word) {
        this.resolve = null;
        this.promise = new Promise((resolve, reject) => { this.resolve = resolve; });
    }
}


let dbServer = new PromisedVariable();
let initDone = new PromisedVariable();
let bildtemaDone = new PromisedVariable();

// --------------------------------------------------------------------
// When the browser tab is loaded restore the previous state from the
// local storage so the user settings are remembered each time the
// user comes back.
// --------------------------------------------------------------------
$(document).ready(function() {
    if (flags.loadResources) {
	(async () => { bildtemaDone.resolve(await (async () => {
	    await Promise.all([
		loadHelp(),
		loadBildtema()
	    ]);
	})())})();

    }
    permbartop = $(".permbar").offset().top;

    if (flags.loadResources) {
	loadFromLocalStorage();
    }
    
    $("#theForm2").submit(function(e) {
	dismissSettings();
	callLexin(true);
	e.preventDefault();
    });

    // --------------------------------------------------------------------
    // When loading the page with a URL that has a search query, do that search.
    // --------------------------------------------------------------------

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const inpLangs = urlParams.get('languages');
    const inpWord = urlParams.get('word');
    const inpSettings = urlParams.get('settings');

    const showSettings = inpSettings == "show";
    
    if(inpLangs && inpLangs.length > 0) {
	setSelectedLexicon(inpLangs.split(","));
	updateKeyboardLanguage();
    }

    if (showSettings) {
	openCloseSettings(".settingsIcon");
    }

    // --------------------------------------------------------------------
    // Listen to changes in the settings, update HTML when necessary.
    // --------------------------------------------------------------------

    registerPartsselectionUpdate(".derivation", "derivations");
    registerPartsselectionUpdate(".ill", "illustrations");
    registerPartsselectionUpdate(".ims", "im");
    registerPartsselectionUpdate(".inflections", "inflections");
    registerPartsselectionUpdate(".meaning", "definition");
    registerPartsselectionUpdate(".examples", "examples");
    registerPartsselectionUpdate(".abbr", "abbr");
    registerPartsselectionUpdate(".gramInfo", "constructions");
    registerPartsselectionUpdate(".gramUsage", "constructions");
    registerPartsselectionUpdate(".antonym", "antonyms");
    registerPartsselectionUpdate(".PoS", "pos");
    registerPartsselectionUpdate(".compounds", "compounds");
    registerPartsselectionUpdate(".comment_se", "comment_se");
    registerPartsselectionUpdate(".synonyms", "synonyms");
    registerPartsselectionUpdate(".matchingWord", "word");
    registerPartsselectionUpdate(".pronunciation", "pron");

	// CG ADD - FIX "DISABLE BILDTEMA LINK" BUG
	registerPartsselectionUpdate(".bildtemaLink", "btlink");

    registerPartsselectionUpdate(".idioms", "expressions");
    registerPartsselectionUpdate(".alt_form", "alt");
    registerPartsselectionUpdate(".translation", "translation");
    registerPartsselectionUpdate(".comment_tr", "comments_other");

    $(document).on("lexin_settingsupdate_clickable_headings", function () {
	if(settings.clickable_headings.val) {
	    $(".clickableHeading").addClass('makeClickableHeadingsStandOut');
	    
	    $(".clickableHeading").off('click');
	    $(".clickableHeading").on('click', function () {
		openPageDescription(this);
	    });
	} else {
	    $(".clickableHeading").removeClass('makeClickableHeadingsStandOut');
	    
	    $(".clickableHeading").off('click');
	}
    });

    $(document).on("lexin_settingsupdate_clickable_words", function () {
	if(settings.clickable_words.val && false) { /* Turn off for now */
	    $(".longClickLink").addClass('makeClickableStandOut');
	    
	    $(".longClickLink").off('dblclick');
	    $(".longClickLink").on('dblclick', function () {
		$("#searchQuery").val(this.textContent);
		callLexin(true);
	    });
	    $(".longClickLink").off("taphold");
   	    $(".longClickLink").on("taphold", function() {
		$("#searchQuery").val(this.textContent);
		callLexin(true);
	    });
	} else {
	    $(".longClickLink").removeClass('makeClickableStandOut');

	    $(".longClickLink").off('dblclick');
	    $(".longClickLink").off("taphold");
	}
    });

    $(document).on("lexin_settingsupdate_multiple_languages", function () {
	multiLangOrNot();
    });
    
    $(document).on("lexin_settingsupdate_expand", function () {
//	if(settings.expand.val) {
//	    $(".notRelevant").show();
//	} else {
	    $(".notRelevant").hide();
//	}
    });
    (async () => { initDone.resolve(await (async () => {
        if (window.navigator.storage && window.navigator.storage.persist) {
	    let persist = await window.navigator.storage.persist();
	    console.log(Date.now(), persist);
        }

	try {
	    dbServer.resolve(await db.open({
		server: 'lexin-test-1',
		version: 6,

		schema: {
		    entries: {
			
			// CG REMOVE
			key: {keyPath: 'id', autoIncrement: true},

			// CG ADD
			//key: { keyPath: 'lang' },

			indexes: {
			    lang: {},

				// CG REMOVE
			    langid: {keyPath: ['lang', 'ID']},

				// CG ADD
				//lang_ID_VariantID: { keyPath: ['lang','ID','VariantID'], unique: true },

			    search: {keyPath: 'index', multiEntry:true}
			}
		    },
		    metadata: {
				// CG REMOVE
				key: {keyPath: 'id', autoIncrement: true},

				// CG ADD
				//key: { keyPath: 'lang' },

				indexes: {
					lang: {}
				}
		    }
		}
	    }));
	    
	    console.log(Date.now(), "created database");
	} catch(error) {
	    console.log("Could not open database", error)
	}
	if(inpWord) {
	    $("#searchQuery")[0].value = inpWord;
	    await callLexin(false);
	}
    })())})();
});

if (typeof exports !== 'undefined') {
    exports.callLexin = callLexin
    exports.dbServer = dbServer
    exports.initDone = initDone
    exports.bildtemaDone = bildtemaDone
    exports.getSelectedLexicon = getSelectedLexicon
    exports.setSelectedLexicon = setSelectedLexicon
    exports.settings = settings
    exports.flags = flags;
    exports.lexinService = lexinService;
}

/* --------- CG ADD POPUP FUNCTIONALITY BELOW --------- */

function showPopup() {
  document.getElementById('popup').style.display = 'block';
  document.body.classList.add("modal-open");
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
  document.body.classList.remove("modal-open");
  document.querySelectorAll("#popup input[type='text']").forEach(el => el.value = "");
  document.querySelectorAll("#popup textarea").forEach(el => el.value = "");
  document.querySelectorAll("#popup input[type='radio']").forEach(el => el.checked = false);
}

let originalPopupHTML = "";

document.addEventListener("DOMContentLoaded", () => {
    originalPopupHTML = document.getElementById("popup").innerHTML;
});

function restorePopupContent() {
    document.getElementById("popup").innerHTML = originalPopupHTML;
}

function sendFeedback() {
	// current search word(s)
	console.log("CG FEEDBACK QUERY: " + $("#searchQuery").val());

	// current language(s)
	let selectedLangs = $(".multilangcolumn input[name='multilangchoice']:checked").get();
	selectedLangs.forEach(lang => {
		let label = $(`label[for='${lang.id}']`).text();
		console.log("CG FEEBACK LANG: " + label);
	});

	document.getElementById("popup").innerHTML = "<div class='popupTitle' style='text-align: center;'>Tack för din återkoppling!</div>";

	setTimeout(() => {
        closePopup();
        restorePopupContent();
    }, 2000);
}
