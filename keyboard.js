// --------------------------------------------------------------------
// Extra keyboard keys for characters the user may not have on their
// own keyboard.
// --------------------------------------------------------------------


// --------------------------------------------------------------------
// Show the Swedish keyboard
// --------------------------------------------------------------------
function keyboardUpdate() {
    if (settings.keyb_se.val) {
	$("#keybSE").show();
	for (const id of ["keybsweå", "keybsweä", "keybsweö"]) {
	    $("#" + id).off("click.keyboardPress");
	    $("#" + id).on("click.keyboardPress", function (event) {
		keyboardPress(this, event);
	    });
	}
    } else {
	$("#keybSE").hide();
    }

    if (settings.keyb_other.val) {
	$("#keybTrans").show();

	updateKeyboardLanguage();
    } else {
	$("#keybTrans").hide();
    }
}

function keybExpandSwe(elem) {
    var kb = document.getElementById("keybSE");
    if (kb.style.display === "block") {
	closeSettings();
	kb.style.display = "none";	
    } else {
	showSettings();
	kb.style.display = "block";
    }
}

// --------------------------------------------------------------------
// Keep track of what keyboard we have built currently.
// --------------------------------------------------------------------
var currentlyGeneratedKeyboards = [];

function generateGeezKeyboard(lang, layout, outerDiv) {
    let consonantDiv = document.createElement('div');
    outerDiv.appendChild(consonantDiv);
    $(consonantDiv).addClass('geezConsonants');
    let vowelDiv = document.createElement('div');
    outerDiv.appendChild(vowelDiv);
    $(vowelDiv).addClass('geezVowels');

    let vowelRowLength = 0;

    for(const row of layout) {
        let consonant = row[0];

	let btn = document.createElement('button');
	$(btn).addClass('geezConsonantCharacter');
	$(btn).addClass('keyboardKeyButton');
        $(btn).data("vowels", row);
	btn.innerText = consonant;
	btn.title = "Mata in " + consonant;
	btn.type = "button";
	btn.onclick = function() { geezConsonantCharacter(this); };

	consonantDiv.appendChild(btn);

        vowelRowLength = Math.max(row.length - 1, vowelRowLength);
    }

    for(const i of _.range(vowelRowLength)) {
	let btn = document.createElement('button');
	$(btn).addClass('geezVowelButton');
	$(btn).addClass('keyboardKeyButton');
        btn.id = "geez-vowel-" + i;
        btn.innerText = "\u00a0";
        btn.disabled = true;
	btn.type = "button";
	btn.onclick = function() { geezVowelButton(this); };

	vowelDiv.appendChild(btn);
    }

    outerDiv.appendChild(vowelDiv);
}

// --------------------------------------------------------------------
// Build a keyboard for language 'lang'
// --------------------------------------------------------------------
function generateKeysForLang(lang, clearOld) {
    if(clearOld || !currentlyGeneratedKeyboards.includes(lang)) {

	var keybDiv = $("#keybTrans")[0];
	
	if(clearOld) {
	    currentlyGeneratedKeyboards = [];
	    keybDiv.innerHTML = null;
	}

	let div = document.createElement('div');
	keybDiv.appendChild(div);
	
	if(keybLayouts.hasOwnProperty(lang) && keybLayouts[lang].layout != []) {
	    var lay = keybLayouts[lang].layout;

            if (lang === "am" || lang === "ti") {
                generateGeezKeyboard(lang, lay, div);
            } else {
	        for(const row of lay) {
		    for(const c of row) {
		        var btn = document.createElement('button');
		        btn.className = 'keyboardKeyButton';
		        btn.innerText = c;
		        btn.title = "Mata in " + c;
		        btn.type = "button";
		        btn.onclick = function() { keyboardPress(this); };

		        div.appendChild(btn);
		    }
	        }
            }
	}
	
	currentlyGeneratedKeyboards.push(lang);
    }
}


// --------------------------------------------------------------------
// Show the non-Swedish keyboard. Build a new keyboard if necessary
// (should already be built when language was selected, but maybe
// there are other ways to get here too).
// --------------------------------------------------------------------
function keybExpandTrans(elem) {
    var kb = document.getElementById("keybTrans");
    if (kb.style.display === "block") {
	kb.style.display = "none";	
    } else {
	kb.style.display = "block";

	updateKeyboardLanguage();
    }
}

// --------------------------------------------------------------------
// One of our on-screen keyboard buttons has been pressed, insert it
// in the input field at the cursor position.
// --------------------------------------------------------------------
function keyboardPress(elem, event) {

    if (event) {
	event.preventDefault();
    }
    
    var c = elem.innerText;

    var inp = $("#searchQuery")[0];

    if (inp.selectionStart || inp.selectionStart == '0') {
        const start = inp.selectionStart;
        const end = inp.selectionEnd;

	var s = inp.value;
	inp.value = s.substring(0, start)
            + c
            + s.substring(end, s.length);
	inp.selectionStart = start + 1;
	inp.selectionEnd = start + 1;
    } else { 
	inp.value += c;
    }
    inp.focus();
}


function geezConsonantCharacter(elem) {
    let c = elem.innerText;

    let vowelrow = $(elem).data("vowels");
    $(".geezVowelButton").each(function (i) {
        if (i < vowelrow.length) {
            this.disabled = false;
            this.innerText = vowelrow[i];
            this.title = "Mata in " + vowelrow[i];
        } else {
            this.disabled = true;
            this.innerText = "\u00a0";
        }
    });

    let inp = $("#searchQuery")[0];

    if (inp.selectionStart || inp.selectionStart == '0') {
        const start = inp.selectionStart;
        const end = inp.selectionEnd;

	let s = inp.value;
	inp.value = s.substring(0, start)
            + c
            + s.substring(end, s.length);
	inp.selectionStart = start + 1;
	inp.selectionEnd = start + 1;
    } else {
	inp.value += c;
    }
    inp.blur();
}

function geezVowelButton(elem) {
    let c = elem.innerText;

    let inp = $("#searchQuery")[0];

    if (inp.selectionStart || inp.selectionStart == '0') {
        const start = inp.selectionStart;
        const end = inp.selectionEnd;

	let s = inp.value;
	inp.value = s.substring(0, start-1)
            + c
            + s.substring(end, s.length);
	inp.selectionStart = start;
	inp.selectionEnd = start;
    } else {
	let s = inp.value;
	inp.value = s.substring(0, s.length-1) + c;
    }
    inp.blur();
    $(".geezVowelButton").each(function (i) {
        this.disabled = true;
        this.innerText = "\u00a0";
    });
}


// --------------------------------------------------------------------
// Keyboard layouts.
//
// Format is an array of arrays. One array is one row of buttons, each
// string in such an array gets one button.
// --------------------------------------------------------------------
const keybLayouts = {
    "sq":{'name':"Albanskt", 'layout':[['ç', 'ë', 'é']]},
    "am":{'name':"Amhariskt", 'layout':[
	['ሀ','ሁ','ሂ','ሃ','ሄ','ህ','ሆ'],
	['ለ','ሉ','ሊ','ላ','ሌ','ል','ሎ','ሏ'],
	['ሐ','ሑ','ሒ','ሓ','ሔ','ሕ','ሖ','ሗ'],
	['መ','ሙ','ሚ','ማ','ሜ','ም','ሞ','ሟ'],
	['ሠ','ሡ','ሢ','ሣ','ሤ','ሥ','ሦ','ሧ'],
	['ረ','ሩ','ሪ','ራ','ሬ','ር','ሮ','ሯ'],
	['ሰ','ሱ','ሲ','ሳ','ሴ','ስ','ሶ','ሷ'],
	['ሸ','ሹ','ሺ','ሻ','ሼ','ሽ','ሾ','ሿ'],
	['ቀ','ቁ','ቂ','ቃ','ቄ','ቅ','ቆ','ቈ','ቊ','ቋ','ቌ','ቍ'],
	['በ','ቡ','ቢ','ባ','ቤ','ብ','ቦ','ቧ'],
	['ቨ','ቩ','ቪ','ቫ','ቬ','ቭ','ቮ','ቯ'],
	['ተ','ቱ','ቲ','ታ','ቴ','ት','ቶ','ቷ'],
	['ቸ','ቹ','ቺ','ቻ','ቼ','ች','ቾ','ቿ'],
	['ኀ','ኁ','ኂ','ኃ','ኄ','ኅ','ኆ','ኈ','ኊ','ኋ','ኌ','ኍ'],
	['ነ','ኑ','ኒ','ና','ኔ','ን','ኖ','ኗ'],
	['ኘ','ኙ','ኚ','ኛ','ኜ','ኝ','ኞ','ኟ'],
	['አ','ኡ','ኢ','ኣ','ኤ','እ','ኦ','ኧ'],
	['ከ','ኩ','ኪ','ካ','ኬ','ክ','ኮ','ኰ','ኲ','ኳ','ኴ','ኵ'],
	['ኸ','ኹ','ኺ','ኻ','ኼ','ኽ','ኾ','ዀ','ዂ','ዃ','ዄ','ዅ'],
	['ወ','ዉ','ዊ','ዋ','ዌ','ው','ዎ'],
	['ዐ','ዑ','ዒ','ዓ','ዔ','ዕ','ዖ'],
	['ዘ','ዙ','ዚ','ዛ','ዜ','ዝ','ዞ','ዟ'],
	['ዠ','ዡ','ዢ','ዣ','ዤ','ዥ','ዦ','ዧ'],
	['የ','ዩ','ዪ','ያ','ዬ','ይ','ዮ'],
	['ደ','ዱ','ዲ','ዳ','ዴ','ድ','ዶ','ዷ'],
	['ጀ','ጁ','ጂ','ጃ','ጄ','ጅ','ጆ','ጇ'],
	['ገ','ጉ','ጊ','ጋ','ጌ','ግ','ጎ','ጐ','ጒ','ጓ','ጔ','ጕ'],
	['ጠ','ጡ','ጢ','ጣ','ጤ','ጥ','ጦ','ጧ'],
	['ጨ','ጩ','ጪ','ጫ','ጬ','ጭ','ጮ','ጯ'],
	['ጰ','ጱ','ጲ','ጳ','ጴ','ጵ','ጶ','ጷ'],
	['ጸ','ጹ','ጺ','ጻ','ጼ','ጽ','ጾ','ጿ'],
	['ፀ','ፁ','ፂ','ፃ','ፄ','ፅ','ፆ'],
	['ፈ','ፉ','ፊ','ፋ','ፌ','ፍ','ፎ','ፏ'],
	['ፐ','ፑ','ፒ','ፓ','ፔ','ፕ','ፖ','ፗ']
]},
    "ar":{'name':"Arabiskt",
	  'layout':[
	      ['،',
	       '؟',
	       'ء',
	       'آ',
	       'أ',
	       'ؤ',
	       'إ',
	       'ئ'],
	      ['ا',
	       'ب',
	       'ة',
	       'ت',
	       'ث',
	       'ج',
	       'ح',
	       'خ'],
	      ['د',
	       'ذ',
	       'ر',
	       'ز',
	       'س',
	       'ش',
	       'ص',
	       'ض'],
	      ['ط',
	       'ظ',
	       'ع',
	       'غ',
	       'ـ',
	       'ف',
	       'ق',
	       'ك'],
	      ['ل',
	       'م',
	       'ن',
	       'ه',
	       'و',
	       'ى',
	       'ي',
	       'ً'],
	      ['ٌ',
	       'ٍ',
	       'َ',
	       'ُ',
	       'ِ',
	       'ّ',
	       'ْ',
	       'پ']
	  ]},
    "az":{'name':"Azerbajdzjanskt", 'layout':[['ç','ə','ǧ','ı','ö','ş','ü']]},
    "bs":{'name':"Bosniskt", 'layout':[['č', 'ć', 'đ', 'š', 'ž']]},
    "el":{'name':"Grekiskt", 'layout':[['α','β','γ','δ','ε','ζ','η','θ'], ['ι','κ','λ','μ','ν','ξ','ο','π'], ['ρ','ς','σ','τ','υ','φ','χ','ψ'], ['ω']]},
    "hr":{'name':"Kroatiskt", 'layout':[['č','ć','đ','š','ž']]},
    "ku":{'name':"Kurdiskt (kurmanji)", 'layout':[['ç','ê','î','ş','û']]},
    "ps":{'name':"Pashto", 'layout':[
	['ث',
	 'ټ',
	 'ت',
	 'پ',
	 'ب',
	 'أ',
	 'ا',
	 'آ'],
	['ذ',
	 'ډ',
	 'د',
	 'ځ',
	 'څ',
	 'خ',
	 'ح',
	 'چ'],
	['ج',
	 'ښ',
	 'ش',
	 'س',
	 'ړ',
	 'ږ',
	 'ژ',
	 'ز'],
	['ر',
	 'غ',
	 'ع',
	 'ظ',
	 'ط',
	 'ض',
	 'ص',
	 'ڼ'],
	['ن',
	 'م',
	 'ل',
	 'ګ',
	 'ک',
	 'ق',
	 'ف',
	 'ئ'],
	['ې',
	 'ى',
	 'ي',
	 'ۍ',
	 'ه',
	 'ۀ',
	 'و',
	 'ُ'],
	['َ',
	 'ِ',
	 'ٓ']
    ]},
    "fa":{'name':"Persiskt",
	  'layout':[
	      ['ب',
	       'ا',
	       'أ',
	       'آ',
	       'ء',
	       'چ',
	       'ج',
	       'ث'],
	      ['ت',
	       'پ',
	       'ر',
	       'ذ',
	       'د',
	       'خ',
	       'ح',
	       'ص'],
	      ['ش',
	       'س',
	       'ژ',
	       'ز',
	       'غ',
	       'ع',
	       'ظ',
	       'ط'],
	      ['ض',
	       'ل',
	       'گ',
	       'ک',
	       'ق',
	       'ف',
	       'ه',
	       'ؤ'],
	      ['و',
	       'ن',
	       'م',
	       'ُ',
	       'ِ',
	       'ّ',
	       'ئ',
	       'ی'],
	      ['؛',
	       '،',
	       'ً',
	       'ْ',
	       'َ']
	      ]},
    "ru":{'name':"Ryskt", 'layout':[['а','б','в','г','д','е','ж','з'], ['и','й','к','л','м','н','о','п'],['р','с','т','у','ф','х','ц','ч'],['ш','щ','ъ','ы','ь','э','ю','я'],['ё']]},
    "sr":{'name':"Serbiskt (latinskt)", 'layout':[['č','ć','đ','ş','š','ž']]},
    "sr":{'name':"Serbiskt (kyrilliskt)", 'layout':[['а','б','в','г','д','е','ж','з'],['и','к','л','м','н','о','п','р'],['с','т','у','ф','х','ц','ч','ш'],['ђ','ј','љ','њ','ћ','џ']]},
    "ckb":{'name':"Kurdiskt (sorani)",
	   'layout':[
	       ['ت',
		'پ',
		'ب',
		'ئ',
		'ا',
		'د',
		'خ',
		'ح'],
	       ['چ',
		'ج',
		'س',
		'ژ',
		'ز',
		'ڕ',
		'ر',
		'ڤ'],
	       ['ف',
		'غ',
		'ع',
		'ش',
		'ڵ',
		'ل',
		'گ',
		'ك'],
	       ['ق',
		'و',
		'ه‌',
		'هـ',
		'ن',
		'م',
		'ێ',
		'ی'],
	       ['وو',
		'ۆ']
	   ]},
    "ti":{'name':"Tigrinskt", 'layout':[
	['ሀ','ሁ','ሂ','ሃ','ሄ','ህ','ሆ'],
	['ለ','ሉ','ሊ','ላ','ሌ','ል','ሎ'],
	['ሐ','ሑ','ሒ','ሓ','ሔ','ሕ','ሖ'],
	['መ','ሙ','ሚ','ማ','ሜ','ም','ሞ'],
	['ረ','ሩ','ሪ','ራ','ሬ','ር','ሮ'],
	['ሰ','ሱ','ሲ','ሳ','ሴ','ስ','ሶ'],
        ['ሸ','ሹ','ሺ','ሻ','ሼ','ሽ','ሾ'],
	['ቀ','ቁ','ቂ','ቃ','ቄ','ቅ','ቆ','ቈ','ቊ','ቋ','ቌ','ቍ'],
	['ቐ','ቑ','ቒ','ቓ','ቔ','ቕ','ቖ','ቘ','ቚ','ቛ','ቜ','ቝ'],
	['በ','ቡ','ቢ','ባ','ቤ','ብ','ቦ'],
        ['ቨ','ቩ','ቪ','ቫ','ቬ','ቭ','ቮ'],
	['ተ','ቱ','ቲ','ታ','ቴ','ት','ቶ'],
	['ቸ','ቹ','ቺ','ቻ','ቼ','ች','ቾ'],
	['ነ','ኑ','ኒ','ና','ኔ','ን','ኖ'],
	['ኘ','ኙ','ኚ','ኛ','ኜ','ኝ','ኞ'],
        ['አ','ኡ','ኢ','ኣ','ኤ','እ','ኦ'],
	['ከ','ኩ','ኪ','ካ','ኬ','ክ','ኮ','ኰ','ኲ','ኳ','ኴ','ኵ'],
	['ኸ','ኹ','ኺ','ኻ','ኼ','ኽ','ኾ','ዀ','ዂ','ዃ','ዄ','ዅ'],
	['ወ','ዉ','ዊ','ዋ','ዌ','ው','ዎ'],
	['ዐ','ዑ','ዒ','ዓ','ዔ','ዕ','ዖ'],
	['ዘ','ዙ','ዚ','ዛ','ዜ','ዝ','ዞ'],
        ['ዠ','ዡ','ዢ','ዣ','ዤ','ዥ','ዦ'],
	['የ','ዩ','ዪ','ያ','ዬ','ይ','ዮ'],
	['ደ','ዱ','ዲ','ዳ','ዴ','ድ','ዶ'],
	['ጀ','ጁ','ጂ','ጃ','ጄ','ጅ','ጆ'],
	['ገ','ጉ','ጊ','ጋ','ጌ','ግ','ጎ','ጐ','ጒ','ጓ','ጔ','ጕ'],
	['ጠ','ጡ','ጢ','ጣ','ጤ','ጥ','ጦ'],
	['ጨ','ጩ','ጪ','ጫ','ጬ','ጭ','ጮ'],
	['ጰ','ጱ','ጲ','ጳ','ጴ','ጵ','ጶ'],
        ['ጸ','ጹ','ጺ','ጻ','ጼ','ጽ','ጾ'],
        ['ፀ','ፁ','ፂ','ፃ','ፄ','ፅ','ፆ'],
	['ፈ','ፉ','ፊ','ፋ','ፌ','ፍ','ፎ'],
	['ፐ','ፑ','ፒ','ፓ','ፔ','ፕ','ፖ']
    ]},
    "tr":{'name':"Turkiskt", 'layout':[['ı','ö','ü','ç','ğ','ş']]},
    "uk":{'name':"Ukrainskt",'layout':[['а','б','в','г','ґ','д','е','є'], ['ж','з','и','і','ї','й','к','л'], ['м','н','о','п','р','с','т','у'], ['ф','х','ц','ч','ш','щ','ь','ю'], ['я']]}
};

// --------------------------------------------------------------------
// When the language changes, we need to build a new keyboard or hide
// the field completely if this language has no keyboard support.
// --------------------------------------------------------------------
function updateKeyboardLanguage() {
    if(!settings.keyb_other.val) {
	return false;
    }
    
    let langs = getSelectedLexicon();

    let first = true;
    let changed = false;
    let hits = 0;
    
    for(let l = 0; l < langs.length; l++) {
	let lang = langs[l];
	let langc = languageMap[lang];
    
	if(keybLayouts.hasOwnProperty(langc) && keybLayouts[langc].layout != []) {
	    if(!currentlyGeneratedKeyboards.includes(langc)) {
		changed = true;
		break;
	    } else {
		hits++;
	    }
	}
    }

    if(changed || hits != currentlyGeneratedKeyboards.length) { // some keyboard no longer needed, or some needed on not already built
	for(let l = 0; l < langs.length; l++) {
	    let lang = langs[l];
	    let langc = languageMap[lang];
	    
	    if(first) {
		first = false;
		generateKeysForLang(langc, true);
	    } else {
		generateKeysForLang(langc, false);
	    }
	}
    }
    if(currentlyGeneratedKeyboards.length > 0) {
	$("#transKeybWrapper")[0].style.display = "block";
    } else {
	$("#transKeybWrapper")[0].style.display = "none";
    }
}

// --------------------------------------------------------------------
// Listen to the language selection element, so we can build a new
// keyboard when the language changes.
//
// Also listen to the settings, to hide/show the keyboards when the
// settings for this change.
// --------------------------------------------------------------------

$(document).ready(function() {
    $("#languageChoice").change(function(e) {
	updateKeyboardLanguage();
	e.preventDefault();
    });

    updateKeyboardLanguage();

    $(document).on("lexin_settingsupdate_keyb_se", function () {
	keyboardUpdate();
    });
    $(document).on("lexin_settingsupdate_keyb_other", function () {
	keyboardUpdate();
    });
});

$(document).on("lexin_settings_loaded", function () {
    keyboardUpdate();
});

if (typeof exports !== 'undefined') {
    exports.updateKeyboardLanguage = updateKeyboardLanguage
}
