// ----------------------------------------------------------------------
// Autocomplete for Lexin search queries.
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// autocompleteIndexOfWord(word, lang)
// ----------------------------------------------------------------------
// Returns -1 if 'word' is not indexed, otherwise it returns the index
// number.
// ----------------------------------------------------------------------
function autocompleteIndexOfWord(word, lang) {
    if(!getAutocompleteArray) {
	return -1;
    }

    if(word) {
	let arr = getAutocompleteArray(lang);
	
	var al = arr.length;
	var m = 0;
	var n = al - 1;

	var WORD = word.toUpperCase();
		
	while (m <= n) {
	    var k = (n + m) >> 1; // binary search
	    
	    var w2 = arr[k].toUpperCase();
	    
	    if(WORD > w2) {
		m = k + 1;
	    } else if(WORD < w2) {
		n = k - 1;
	    } else {
		// found it
		return k;
	    }
	}
    }
    return -1;
}

// ----------------------------------------------------------------------
// isIndexed(word)
// ----------------------------------------------------------------------
// Returns true if the word is an indexed word in the currently
// selected lexicon. Not used for the autocompletion but is provided
// as a service if anyone needs this info.
// ----------------------------------------------------------------------
function isIndexed(word) {
    if(word) {

	let langs = getSelectedLexicon();
	
	if(!getAutocompleteArray) {
	    return false;
	}

	let alreadyCheckedArrs = [];
	for(let l = 0; l < langs.length; l++) {
	    let lang = langs[l];
	    let arr = getAutocompleteArray(lang);

	    if(!alreadyCheckedArrs.includes(arr)) {
		var al = arr.length;
		var m = 0;
		var n = al - 1;

		var WORD = word.toUpperCase();
		
		while (m <= n) {
		    var k = (n + m) >> 1; // binary search

		    var w2 = arr[k].toUpperCase();

		    if(WORD > w2) {
			m = k + 1;
		    } else if(WORD < w2) {
			n = k - 1;
		    } else {
			// found it
			return true;
		    }
		}
	    }
	}
    }
    return false;
}

// ----------------------------------------------------------------------
// compareSubstr(head, hl, val)
// ----------------------------------------------------------------------
// Check if the first 'hl' letters of the word 'val' are 'head'.
// ----------------------------------------------------------------------
function compareSubstr(head, hl, val) {
    var hd = head.toUpperCase();
    var v;
    
    if(val.length > hl) {
	v = val.substr(0, hl).toUpperCase();
    } else {
	v = val.toUpperCase();
    }

    if(v == hd) {
	return 0;
    }
    if(v < hd) {
	return 1;
    }
    return -1;
}

// ----------------------------------------------------------------------
// getCompletions(head, arr, MAXLIMIT)
// ----------------------------------------------------------------------
// Get possible completions starting with 'head' in (sorted) array
// 'arr'. Binary search the array to find one word starting with
// 'head', the linear search forward and backward to find all words
// starting with head. Returns an array with all matching words.
//
// Accepts at most 'TOTAL' suggestions, and returns an empty array if
// there are too many matches. Searches at most BEFORE words backwards
// and AFTER words forward (both BEFORE and AFTER default to the same
// value as TOTAL).
// ----------------------------------------------------------------------
function getCompletions(head, arr, MAXLIMIT) {
    var res = [];

    const TOTAL = 10; // When there are more matches than this, give up
    if(!MAXLIMIT) {
	MAXLIMIT = TOTAL;
    }
    const BEFORE = MAXLIMIT, AFTER = MAXLIMIT;

    
    if(head) {
	var al = arr.length;
	var m = 0;
	var n = al - 1;
	var hl = head.length;
	
	while (m <= n) {
            var k = (n + m) >> 1; // binary search
	    
            var cmp = compareSubstr(head, hl, arr[k]);
            if(cmp > 0) {
		m = k + 1;
            } else if(cmp < 0) {
		n = k - 1;
            } else {
		// found one match

		var bef = 0;
		var aft = 0;
		
		while(bef < BEFORE && k - bef >= 0 && !compareSubstr(head, hl, arr[k - bef])) {
		    bef++;
		}
		while(aft < AFTER && k + aft < al && !compareSubstr(head, hl, arr[k + aft])) {
		    aft++;
		}
		
		if(bef + aft - 1 < MAXLIMIT) {
		    for(var i = k - bef + 1; i < k + aft; i++) {
			res.push(arr[i]);
		    }
		}
		m = n + 1; // stop searching
            }
	}
    }
    return res;
}

// ----------------------------------------------------------------------
// setupAutocomplete(inp)
// ----------------------------------------------------------------------
// Start using autocomplete on the input element 'inp'
// ----------------------------------------------------------------------
function setupAutocomplete(inp) {
    var currentFocus; // currently marked autocomplete suggestion

    // ----------------------------------------------------------------------
    // When the input field content changes, update the list of
    // autocomplete suggestions.
    // ----------------------------------------------------------------------
    inp.addEventListener("input", function(e) {
	var head = this.value;
	var hl;

	closeAllAutocompl();
	currentFocus = -1;

	if(!settings.completion.val) {
	    return false;
	}
	
	if(!head) {
	    return false;
	} else {
	    hl = head.length;
	}
	
	// different languages have different words, notably Swedish has more
	let langs = getSelectedLexicon();
	
	if(!getAutocompleteArray) {
	    return false;
	}

	let alreadyCheckedArrs = [];
	let allComps = [];

	if(head.indexOf("ʃ") >= 0) {
	    allComps = expandSje(head);
	} else {

	    for(let l = 0; l < langs.length; l++) {
		let lang = langs[l];
		let arr = getAutocompleteArray(lang);

		if(!alreadyCheckedArrs.includes(arr)) {
		    
		    let comps = getCompletions(head, arr);
		    
		    if(comps.length > 0 && allComps.length < comps.length) {
			allComps = comps;
		    }
		}
	    }
	    
	}
	
	if(allComps.length > 0) {
	    let comps = allComps;
	    
	    var dv = document.createElement("DIV");
	    dv.setAttribute("id", this.id + "autocomplete-list");
	    dv.setAttribute("class", "autocomplete-items");
	    
	    this.parentNode.appendChild(dv);

	    for(var c = 0; c < comps.length; c++) {

		var compsEl = document.createElement("DIV");
		compsEl.innerHTML = "<strong>" + comps[c].substr(0, hl) + "</strong>";
		compsEl.innerHTML += comps[c].substr(hl);
		compsEl.innerHTML += "<input type='hidden' value=\"" + comps[c] + "\">";

		compsEl.addEventListener("click", function(e) {
		    let tmp = this.getElementsByTagName("input")[0].value;
		    tmp  = tmp.replace(/\s*\(.*\)$/, "").replace(/,.*$/, "");
		    inp.value = tmp;
		    inp.focus();
		    closeAllAutocompl();
		    $(inp.form).submit();
		});
		
		dv.appendChild(compsEl);
	    }
	    return true;
	}
	return false;
    });

    // ----------------------------------------------------------------------
    // Listen for keypresses. Trap UP, DOWN, ENTER, and ESC to move
    // up/down in the list of suggestions, use a suggestion, and to
    // close the autocomplete list.
    // ----------------------------------------------------------------------
    inp.addEventListener("keydown", function(e) {
	var el = document.getElementById(this.id + "autocomplete-list");
	if(el) {
	    el = el.getElementsByTagName("div");
	}
	
	if(e.keyCode == 40) {
            // DOWN
            currentFocus++;
            addEmph(el);
	    e.preventDefault(); // we do not want to move the cursor in the input box
	} else if(e.keyCode == 38) {
	    // UP
            currentFocus--;
            addEmph(el);
	    e.preventDefault(); // we do not want to move the cursor in the input box
	} else if(e.keyCode == 13) {
            // ENTER
            if(currentFocus > -1) {
		e.preventDefault();
		if(el) {
		    el[currentFocus].click();
		    currentFocus = -1;
		}
            }
	} else if(e.keyCode == 27) {
	    // ESC
	    removeEmph(el);
	    currentFocus = -1;
	    closeAllAutocompl();	    
	}
    });
    
    // ----------------------------------------------------------------------
    // Add emphasis on the currently selected (with the arrow keys)
    // autocomplete suggestion.
    // ----------------------------------------------------------------------
    function addEmph(el) {
	if(!el) {
	    return false;
	}

	removeEmph(el);
	
	if(currentFocus >= el.length) {
	    currentFocus = 0;
	}
	if(currentFocus < 0) {
	    currentFocus = (el.length - 1);
	}
	el[currentFocus].classList.add("autocomplete-emph");
    }

    // ----------------------------------------------------------------------
    // Remove emphasis on any suggestion that previously had emphasis
    // added.
    // ----------------------------------------------------------------------
    function removeEmph(el) {
	for (var i = 0; i < el.length; i++) {
	    el[i].classList.remove("autocomplete-emph");
	}
    }

    // ----------------------------------------------------------------------
    // Remove the autocomplete popup list.
    // ----------------------------------------------------------------------
    function closeAllAutocompl(el) {
	var au = document.getElementsByClassName("autocomplete-items");
	for (var a = 0; a < au.length; a++) {
	    if(el != au[a] && el != inp) {
		au[a].parentNode.removeChild(au[a]);
	    }
	}
    }

    // ----------------------------------------------------------------------
    // Listen for selections of autocomplete suggestions.
    // ----------------------------------------------------------------------
    document.addEventListener("click", function (e) {
	closeAllAutocompl(e.target);
    });
} 

// ----------------------------------------------------------------------
// Set up autocomplete on the input search query element.
// ----------------------------------------------------------------------
$(document).ready(function() {
    setupAutocomplete($("#searchQuery")[0]);
});

if (typeof exports !== 'undefined') {
    exports.isIndexed = isIndexed
}


function expandSje(text) {
    let res = [];

    let p = text.indexOf("ʃ");

    if(p < 0) {
	return [text];
    }

    let head = text.substr(0, p);
    let tails = replaceSje(text.substr(p + 1));

    let expandedComps = [];
    let langs = getSelectedLexicon();
    const TOTAL = 10; // When there are more matches than this, give up
    
    for(let t = 0; t < tails.length; t++) {
	let w = head + tails[t];


	let alreadyCheckedArrs = [];
	let allComps = [];
	for(let l = 0; l < langs.length; l++) {
	    let lang = langs[l];
	    let arr = getAutocompleteArray(lang);

	    if(!alreadyCheckedArrs.includes(arr)) {
	
		let comps = getCompletions(w, arr, 1000);
		if(comps.length > 0 && allComps.length < comps.length) {
		    allComps = comps;
		}
	    }
	}

	expandedComps = expandedComps.concat(allComps);
	
	if(isIndexed(w)) {
	    res.push(w);
	}
    }

    if(expandedComps.length > 0 && expandedComps.length < TOTAL) {
	res = expandedComps;
    } else if(expandedComps.length > 0) {
	res = [];
    }
    
    return res;
}

function replaceSje(tail) {
    const spellings = ['sj', 'sh', 'sk', 'stj', 'k', 'tj', 'rs', 'sch', 'ch', 'cc', 'ge', 'kj', 'q', 'ti', 'ssi', 'si', 'ssj', 'g', 'j', 'sc', 'skj', 's', 'ts'];

    let res = [];

    let p = tail.indexOf("ʃ");
    if(p < 0) {
	for(let sp = 0; sp < spellings.length; sp++) {	    
	    if( tail == ""
		|| ((spellings[sp] == "k") && (tail[0] == "e" || tail[0] == "e" || tail[0] == "i" || tail[0] == "y" || tail[0] == "ä" || tail[0] == "ö"))
		|| ((spellings[sp] == "sk") && (tail[0] == "e" || tail[0] == "e" || tail[0] == "i" || tail[0] == "o" || tail[0] == "u" || tail[0] == "y" || tail[0] == "å" || tail[0] == "ä" || tail[0] == "ö"))
		|| ((spellings[sp] == "g") && (tail[0] == "e"))
		|| ((spellings[sp] == "j") && (tail[0] == "o" || tail[0] == "u"))
		|| ((spellings[sp] == "s") && (tail[0] == "i"))
		|| (spellings[sp] != "k" && spellings[sp] != "sk" && spellings[sp] != "g" && spellings[sp] != "j" && spellings[sp] != "s")
	      ) {
		res.push(spellings[sp] + tail);
	    }
	}
    } else {
	let head = tail.substr(0, p);
	let tails = replaceSje(tail.substr(p + 1));

	for(let sp = 0; sp < spellings.length; sp++) {
	    let h = spellings[sp] + head;
	    for(let t = 0; t < tails.length; t++) {
		let tail = tails[t];
		if( tail == ""
		    || ((spellings[sp] == "k") && (tail[0] == "e" || tail[0] == "e" || tail[0] == "i" || tail[0] == "y" || tail[0] == "ä" || tail[0] == "ö"))
		    || ((spellings[sp] == "sk") && (tail[0] == "e" || tail[0] == "e" || tail[0] == "i" || tail[0] == "o" || tail[0] == "u" || tail[0] == "y" || tail[0] == "å" || tail[0] == "ä" || tail[0] == "ö"))
		    || ((spellings[sp] == "g") && (tail[0] == "e"))
		    || ((spellings[sp] == "j") && (tail[0] == "o" || tail[0] == "u"))
		    || ((spellings[sp] == "s") && (tail[0] == "i"))
		    || (spellings[sp] != "k" && spellings[sp] != "sk" && spellings[sp] != "g" && spellings[sp] != "j" && spellings[sp] != "s")
		  ) {
		    res.push(h + tails[t]);
		}
	    }
	}
    }

    return res;
}
