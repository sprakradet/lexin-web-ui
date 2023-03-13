// --------------------------------------------------------------------
// Handle the "Save word" functionality.
//
// TODO: should we have "save this word" options next to each search
// result in addition to "save search queary" ?
// --------------------------------------------------------------------


// --------------------------------------------------------------------
// openCloseSaveWords(elem)
// --------------------------------------------------------------------
// Called when user clicks on the button to open the Save Words
// window.
// --------------------------------------------------------------------
function openSavedWords() {
    var h = document.getElementById("saveWordPopup");
    h.style.display = "block";
    
    var uElem = getULfromSavedWords();

    var parentDiv = $("#savedWordsList")[0];
    parentDiv.innerHTML = null;
    parentDiv.appendChild(uElem);
} 

function closeSavedWords() {
    var h = document.getElementById("saveWordPopup");
    h.style.display = "none";
} 


// --------------------------------------------------------------------
// Save the latest search query to the savedWords array.
// --------------------------------------------------------------------
function savedWordsSaveCurrentWord(elem) {
    if(savedWords) {
	var cw = $("#searchQuery").val();

	if(!savedWords.includes(cw)) {
	    savedWords.push(cw);
    
	    var uElem = getULfromSavedWords();
	    
	    var parentDiv = $("#savedWordsList")[0];
	    parentDiv.innerHTML = null;
	    parentDiv.appendChild(uElem);

	    updateSaveCurrentButton();
	    
	    saveToLocalStorage();
	}
    }
}

// --------------------------------------------------------------------
// Build an HTML <ul> list from the savedWords array.
// --------------------------------------------------------------------
function getULfromSavedWords() {
    var uElem = document.createElement('ul');
    uElem.className = "savedWordsList";
    
    if(savedWords && savedWords.length && savedWords.length > 0) {
	var langs = getSelectedLexicon();

	for(var ww = 0; ww < savedWords.length; ww++) {
	    const w = savedWords[ww];
	    
	    var aElem = getLinkElemToSearch(w);
	    aElem.innerText = w;

	    let deleteBtn = document.createElement('div');
	    deleteBtn.innerHTML = "&times;";
	    deleteBtn.title = "Ta bort " + w;
	    deleteBtn.className = "removeOneSavedWordButton";
	    deleteBtn.onclick = function () {
		removeOneSavedWord(w);
	    };
		
	    var liElem = document.createElement('li');
	    liElem.appendChild(aElem);
	    liElem.appendChild(deleteBtn);
	    
	    uElem.appendChild(liElem);
	}
    }
    return uElem;
}

// --------------------------------------------------------------------
// Sort the savedWords array and update the HTML.
// --------------------------------------------------------------------
function savedWordsSortWords(elem) {
    if(savedWords) {
	savedWords.sort();
	
	var uElem = getULfromSavedWords();
	
	var parentDiv = $("#savedWordsList")[0];
	parentDiv.innerHTML = null;
	parentDiv.appendChild(uElem);

	saveToLocalStorage();
    }
}

// --------------------------------------------------------------------
// Remove 'word' from savedWords array.
// --------------------------------------------------------------------
function removeOneSavedWord(word) {
    let i = 0;
    while (i < savedWords.length) {
	if (savedWords[i] == word) {
	    savedWords.splice(i, 1);
	} else {
	    ++i;
	}
    }

    var uElem = getULfromSavedWords();
	
    var parentDiv = $("#savedWordsList")[0];
    parentDiv.innerHTML = null;
    parentDiv.appendChild(uElem);

    saveToLocalStorage();

    return savedWords;
}

// --------------------------------------------------------------------
// Empty the savedWords array and update the HTML.
// --------------------------------------------------------------------
function savedWordsClearWords(elem) {
    if(savedWords && savedWords.length != 0) {
	savedWords = [];
	
	var uElem = getULfromSavedWords();
	
	var parentDiv = $("#savedWordsList")[0];
	parentDiv.innerHTML = null;
	parentDiv.appendChild(uElem);

	updateSaveCurrentButton();

	saveToLocalStorage();
    }
}

// --------------------------------------------------------------------
// In Lexin you can press a button and get the search results for all
// saved words at once, which can be a very VERY long list of
// results. TODO: should we implement this as well? Currently
// disabled.
// --------------------------------------------------------------------
function savedWordsSearchAll(elem) {
    // Todo: Do we really need this function?
}

// --------------------------------------------------------------------
// Show the HTML for the savedWords array etc.
// --------------------------------------------------------------------


// --------------------------------------------------------------------
// Update the "Save current word" button to display the current word
// when a new search is performed. Also used to disable/enable the
// button when the current word can/cannot be stored in the savedWords
// array (to avoid duplicate entries).
// --------------------------------------------------------------------
function updateSaveCurrentButton() {
    var cw = $("#searchQuery").val();

    var btn = $("#savedWordsSaveCurrent")[0];
    var btn2 = $("#savedWordsSaveCurrentWrd")[0];

    btn.innerText = "Spara \"" + cw + "\"";
    btn2.innerText = "Spara \"" + cw + "\"";

    if(savedWords && savedWords.includes(cw)) {
	btn.disabled = true;
	btn2.disabled = true;
    } else {
	btn.disabled = false;
	btn2.disabled = false;
    }
}

// --------------------------------------------------------------------
// Listen to the search form so we can update the "Save current word"
// button apropriately.
// --------------------------------------------------------------------
$(document).ready(function() {
    $("#theForm2").submit(function(e) {
	updateSaveCurrentButton();
	e.preventDefault();
    });
});
