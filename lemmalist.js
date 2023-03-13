// ----------------------------------------------------------------------
// Show the lemma list. Also used to scrolle the lemma list to the
// current word even when the list is already shown.
// ----------------------------------------------------------------------
let lemmaListLength = -1; // used for scrolling, and to know if the list needs to be initialized
function showLemmaList(lemma) {
    let ll = document.getElementById('lemmaList');
    if(lemmaListLength < 0) {
	buildLemmaList(ll);
    }

    resizeLemmaList(ll);
    
    let w = document.getElementById('lemmaListWrapper');
    w.style.display = 'block';

    let idx = autocompleteIndexOfWord(cleanWord(lemma), "swe");
    if(idx >= 0) {
	let tmp = ll.scrollHeight * idx / lemmaListLength;
	ll.scrollTop = tmp;
    }
}

// ----------------------------------------------------------------------
// Resize the lemma list element to be as big as the search results.
// ----------------------------------------------------------------------
function resizeLemmaList(ll) {
    let rd = document.getElementById('resultsDiv');
    let positionInfo = rd.getBoundingClientRect();
    let h = positionInfo.height;
    ll.style.height = h + "px";
    ll.style.maxHeight = h + "px";
}

// ----------------------------------------------------------------------
// Build the lemma list for the first time.
// ----------------------------------------------------------------------
function buildLemmaList(parent) {
    parent.innerHTML = null;
    
    let words = getAutocompleteArray("swe");
    lemmaListLength = words.length;
    for(let i = 0; i < lemmaListLength; i++) {
	let w = words[i];
	let aElem = getLinkElemToSearch(w);
	aElem.textContent = w;
	parent.appendChild(aElem);
	parent.appendChild(document.createElement('br'));
    }
}

if (typeof exports !== 'undefined') {
    exports.resizeLemmaList = resizeLemmaList
}
