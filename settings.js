// --------------------------------------------------------------------
// Handle the settings
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// Called when the user clicks the Settings button.
// --------------------------------------------------------------------
function openCloseSettings(elem) {
	// close
    if ($(elem).hasClass("change")) {
		// collapse expanded menu items
        $("#settingsPopup .expandMenuButton[aria-expanded='true']").each(function() {
            toggleExpandMenu(this);
        });

		dismissSettings();

		// accessibility
		//$(elem).attr("aria-label", "Visa inställningar");
      	$(elem).attr("aria-expanded", "false");
    } 
	//open
	else {
		$("#settingsPopup").show();
		$(elem).addClass("change");
		showSettings();
		updateSaveCurrentButton();

		// accessibility
		//$(elem).attr("aria-label", "Stäng inställningar");
      	$(elem).attr("aria-expanded", "true");
    }
}

function dismissSettings() {
    $(".settingsIcon").removeClass("change");

	// accessibility
	//$(".settingsIcon").attr("aria-label", "Visa inställningar")
  	$(".settingsIcon").attr("aria-expanded", "false");
	
    $("#settingsPopup").hide();
    //$("#saveWordPopup").hide();
    $("#partsselection").hide();
    $("#downloadPopup").hide();
    //$("#multilangchoice").hide();
    // $("#helpPopup").hide();
}

// --------------------------------------------------------------------
// Build and show HTML from the internal settings object.
// --------------------------------------------------------------------
function showSettings() {
    if(settings) {
		// handle checkboxes 
		for(let prop of Object.keys(settings)) {
			let elID = "#" + prop + "Set";
			let el = $(elID)[0];
			if(el) {
				if(settings[prop].val) {
					el.checked = true;
				} else {
					el.checked = false;
				}
				$(elID).off("change.updateSettings");
				$(elID).on("change.updateSettings", () => {
					console.log(prop, "changed", el.checked);
					settings[prop].val = el.checked;
					$(document).trigger("lexin_settingsupdate_" + prop);
					saveToLocalStorage();
				});
			}
		}

		// show saved words 
		$("#openSavedWords").off("click");
		$("#openSavedWords").on("click", function () {
			openSavedWords();
			$(".settingsIcon").addClass("change");
			//$("#settingsPopup").hide();
		});

		// choose display parts
		$("#openPartsSelection").off("click");
		$("#openPartsSelection").on("click", function () {
			$("#partsselection").show();
			$(".settingsIcon").addClass("change");
			//$("#settingsPopup").hide();
		});

		// download lexicon
		$("#openDownload").off("click");
		$("#openDownload").on("click", function () {
			openDownload();
			$(".settingsIcon").addClass("change");
			//$("#settingsPopup").hide();
		});
    }
}

// show help text
$(function () {
    $(".openHelp").on("click", function () {
	//openPageDescription();
	// if ($("#helpPopup").css("display") === "block") {
	//     dismissSettings();
	// } else {
	//     $("#helpPopup").show();
	//     $(".settingsIcon").addClass("change");
	//     $("#settingsPopup").hide();
	// }
    });
});

/* --------- UPDATE STATUS FOR CHECKBOXES --------- */
function updateCheckboxes() {
	if(settings) {
		for(let prop of Object.keys(settings)) {
			let elID = "#" + prop + "Set";
			let el = $(elID)[0];
			if(el) {
				if(settings[prop].val) {
					el.checked = true;
				} else {
					el.checked = false;
				}
				$(elID).off("change.updateSettings");
				$(elID).on("change.updateSettings", () => {
					console.log(prop, "changed", el.checked);
					settings[prop].val = el.checked;
					$(document).trigger("lexin_settingsupdate_" + prop);
					saveToLocalStorage();
				});
			}
		}
	}
}

/* --------- OPEN/CLOSE POPUP FOR ARTICLE PARTS FILTER --------- */
function openCloseArticleParts() {
	const articlePartsButton = document.getElementById("articlePartsButton");
	const articlePartsPopup = document.getElementById("articlePartsPopup");

	const shouldOpen = articlePartsPopup.hidden;
    articlePartsPopup.hidden = !shouldOpen;
    articlePartsButton.setAttribute("aria-expanded", String(shouldOpen));

	// open
	if (shouldOpen) {
		updateCheckboxes();
        $("#partsselection").show();
    } 
	// close 
	else {
        $("#partsselection").hide();
		articlePartsButton.focus();
    }
}

/* --------- CLOSE POPUP FOR ARTICLE PARTS FILTER --------- */
function closeArticleParts() {
    document.getElementById("articlePartsPopup").hidden = true;
	const articlePartsButton = document.getElementById("articlePartsButton");
    articlePartsButton.setAttribute("aria-expanded", "false");
    $("#partsselection").hide();
	articlePartsButton.focus();
}

/* --------- CLOSE POPUP FOR MULTILANG CHOICE --------- */
function closeMultiLangChoice() {
	document.getElementById("multilangchoice").hidden = true;
    const multiLanguageChoiceButton = document.getElementById("multiLanguageChoiceButton");
    multiLanguageChoiceButton.setAttribute("aria-expanded", "false");
    multiLanguageChoiceButton.focus();
}

/* --------- OPEN&/CLOSE MENU ITEM --------- */
function toggleExpandMenu(button) {
    const contentId = button.getAttribute("aria-controls");
    const content = document.getElementById(contentId);
    const isOpen = button.getAttribute("aria-expanded") === "true";

	// close menu
    /*if (isOpen) {
        content.hidden = true;
        button.setAttribute("aria-expanded", "false");
        const icon = button.querySelector(".expandMenuIcon");
        icon.textContent = "+";
    } */
	// open menu 
	/*else {
        content.hidden = false;
        button.setAttribute("aria-expanded", "true");
        const icon = button.querySelector(".expandMenuIcon");
        icon.textContent = "−";
    }*/

   	// close clicked item if already open
    if (isOpen) {
        content.hidden = true;
        button.setAttribute("aria-expanded", "false");
        button.querySelector(".expandMenuIcon").textContent = "+";
    }
    // open clicked item and close others
    else {
        // close
        const menu = button.closest(".expandMenu");
        for (const otherButton of menu.querySelectorAll(".expandMenuButton[aria-expanded='true']")) {
            const otherContentId = otherButton.getAttribute("aria-controls");
            const otherContent = document.getElementById(otherContentId);
            otherContent.hidden = true;
            otherButton.setAttribute("aria-expanded", "false");
            otherButton.querySelector(".expandMenuIcon").textContent = "+";
        }

        // open
        content.hidden = false;
        button.setAttribute("aria-expanded", "true");
        button.querySelector(".expandMenuIcon").textContent = "−";
    }
}