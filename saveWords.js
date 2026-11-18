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

	checkListEmpty();
} 

function closeSavedWords() {
    var h = document.getElementById("saveWordPopup");
    h.style.display = "none";
} 


// --------------------------------------------------------------------
// Save the latest search query to the savedWords array.
// --------------------------------------------------------------------
function savedWordsSaveCurrentWord(elem, id) {
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

	// show saved message
	const msg = document.getElementById(id);
  	msg.textContent = "Ordet sparades!";
	msg.style.paddingBottom = "5px";

	// fade in
	msg.classList.add("show");

	// fade out
	clearTimeout(msg._hideTimer);
		msg._hideTimer = setTimeout(() => {
		msg.classList.remove("show");
		setTimeout(() => { msg.textContent = ""; }, 200);
	}, 5000);

	// change button text
	button = document.getElementById("savedWordsSaveCurrent");
	button.textContent = "Sparat";

	checkListEmpty();
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
			
			// close menu on click
			aElem.addEventListener("click", function() {
				$("#searchQuery").focus();

				// desktop: do nothing
				if (window.matchMedia("(min-width: 1024px)").matches) {
					return;
				}
				// phone
				else {
					const menuButton = document.querySelector(".settingsIcon");
					if (menuButton && menuButton.classList.contains("change")) {
						openCloseSettings(menuButton);
					}
				}
			});

			let deleteBtn = document.createElement('button');
			deleteBtn.type = "button";
			deleteBtn.innerHTML = "&times;";
			/*deleteBtn.title = "Ta bort " + w;*/
			deleteBtn.className = "removeOneSavedWordButton";

			// accessibility
			deleteBtn.setAttribute("aria-label", "Ta bort '" + w + "' från sparade ord");
			deleteBtn.setAttribute("tabindex", "0");
			deleteBtn.setAttribute("role", "button");
			deleteBtn.addEventListener("keydown", function (e) {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					deleteBtn.click();
				}
			});

			deleteBtn.onclick = function () {
				//removeOneSavedWord(w);
				showValidationWordRemovalPopup(w);
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
		/*savedWords.sort();

		// ignore case
		savedWords.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });

		// sort according to swedish alphabet
		savedWords.sort((a, b) =>
            a.localeCompare(b, "sv", { sensitivity: "base" })
        );*/

		const collator = new Intl.Collator("sv", {
			sensitivity: "base", // ignore case/accents
			numeric: true        // sort numbers
		});
		savedWords.sort((a, b) => collator.compare(a, b));
		
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

	var cw = $("#searchQuery").val();
	var btn = $("#savedWordsSaveCurrent")[0];		// used
    //var btn2 = $("#savedWordsSaveCurrentWrd")[0];	// not used?
	if (cw == word) {
		btn.disabled = false;
		btn.textContent = "Spara ord";
		//btn2.disabled = false;
		//btn.title = "Spara senaste uppslagning";
		//btn2.title = "Spara senaste uppslagning";
	} 

    return savedWords;
}

// --------------------------------------------------------------------
// Empty the savedWords array and update the HTML.
// --------------------------------------------------------------------
function savedWordsClearWords() {
    if(savedWords && savedWords.length != 0) {
		savedWords = [];
		
		var uElem = getULfromSavedWords();
		
		var parentDiv = $("#savedWordsList")[0];
		parentDiv.innerHTML = null;
		parentDiv.appendChild(uElem);

		updateSaveCurrentButton();

		saveToLocalStorage();

		checkListEmpty();
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

    var btn = $("#savedWordsSaveCurrent")[0];		// used
    var btn2 = $("#savedWordsSaveCurrentWrd")[0];	// not used?

    //btn.innerText = "Spara \"" + cw + "\"";
    //btn2.innerText = "Spara \"" + cw + "\"";

	// search already saved
    if((savedWords && savedWords.includes(cw))) {
		btn.disabled = true;
		btn.textContent = "Sparat";
		//btn2.disabled = true;
		//btn.title = "Uppslagningen är redan sparad";
		//btn2.title = "Uppslagningen är redan sparad";
    } 
	// search is empty
	else if (cw == "") {
		btn.disabled = true;
		//btn2.disabled = true;
		//btn.title = "Uppslagningen är tom";
		//btn2.title = "Uppslagningen är tom";
	}
	else {
		btn.disabled = false;
		btn.textContent = "Spara ord";
		//btn2.disabled = false;
		//btn.title = "Spara senaste uppslagning";
		//btn2.title = "Spara senaste uppslagning";
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

/* --------- ENABLE/DISABLE FUNCTIONALITY & TEXT --------- */
function checkListEmpty() {
	var message = document.getElementById("emptyListMessage");
	var sortButton = document.getElementById("savedWordsSort");
	var clearButton = document.getElementById("savedWordsClear");

	// words saved
	if(savedWords && savedWords.length > 0) {
		message.style.display = "none";
		sortButton.disabled = false;
		clearButton.disabled = false;
	}
	// no words saved
	else {
		message.style.display = "block";
		sortButton.disabled = true;
		clearButton.disabled = true;
	}
}

/* --------- SHOW VALIDATION POPUP FOR WORD REMOVAL --------- */
function showValidationWordRemovalPopup(w) {
	// accessibility (tab focus)
	lastFocusedElement = document.activeElement;

	// add non-clickable shadow background
	const backdrop = document.getElementById("popupBackdrop");
	backdrop.hidden = false;

	// create popup
	const popup = document.createElement("div");
	popup.id = "validationPopup";
	popup.className = "popup";
	popup.style.display = 'block';
	popup.setAttribute("role", "dialog");
	popup.setAttribute("aria-modal", "true");

	// add heading
	const heading = document.createElement("h2");
	heading.id = "popupHeading";
	heading.textContent = "Bekräftelse";
	popup.append(heading);

	// add question (several words)s
	const questionText = document.createElement("p");
	if(w === undefined) {
		questionText.textContent = "Vill du verkligen ta bort alla ord?";
	}
	// add question (single word)
	else {
		questionText.textContent = "Vill du verkligen ta bort ordet '" + w + "'?";
	}
	popup.append(questionText);

	// add buttons
	const buttonContainer = document.createElement("div");
	buttonContainer.className = "validationButtons";
	const cancelButton = document.createElement("button");
	cancelButton.type = "button";
	cancelButton.textContent = "Avbryt";
	cancelButton.className = "cancelWordRemovalButton saveWordsButton ";
	const confirmButton = document.createElement("button");
	confirmButton.type = "button";
	confirmButton.textContent = "Ta bort";
	confirmButton.className = "confirmWordRemovalButton saveWordsButton ";
	buttonContainer.append(cancelButton, confirmButton);
	popup.append(buttonContainer);

	// add close functionality
	cancelButton.addEventListener("click", () => {
		closeValidationWordRemovalPopup(w);
		lastFocusedElement.focus();
	});

	// add remove functionality
	confirmButton.addEventListener("click", () => {
		// several words
		if(w === undefined) {
			savedWordsClearWords();
		}
		// single word
		else {
			removeOneSavedWord(w);
			checkListEmpty();
		}
		closeValidationWordRemovalPopup(w);
	});

	// accessibility (set dialog name)
	popup.setAttribute("aria-labelledby", "popupHeading");

	// accessibility (tab focus possible)
	popup.setAttribute("tabindex", "-1");

	document.body.appendChild(popup);
	document.body.classList.add("modal-open");

	// accessibility (start focus trap)
	if (popupTrapCleanup) popupTrapCleanup();
	popupTrapCleanup = trapFocus(popup);

	// accessibility (focus first element)
	const focusables = getFocusableElements(popup);
	(focusables[0] || popup).focus();	
}

/* --------- CLOSE VALIDATION POPUP FOR WORD REMOVAL --------- */
function closeValidationWordRemovalPopup(w) {
	// hide popup
	const popup = document.getElementById("validationPopup");
	popup.remove();
	document.body.classList.remove("modal-open");

	// remove non-clickable shadow background
	const backdrop = document.getElementById("popupBackdrop");
	backdrop.hidden = true;

	// accessibility (stop focus trap)
	if (popupTrapCleanup) {
		popupTrapCleanup();
		popupTrapCleanup = null;
	}

	// reset focus (several words)
	const saveWordsButton = document.getElementById("openSavedWords");
	saveWordsButton.focus();
}
