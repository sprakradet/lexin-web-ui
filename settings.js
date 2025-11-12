// --------------------------------------------------------------------
// Handle the settings
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// Called when the user clicks the Settings button.
// --------------------------------------------------------------------
function openCloseSettings(elem) {
    if ($(elem).hasClass("change")) {
		dismissSettings();
    } else {
		$("#settingsPopup").show();
		$(elem).addClass("change");
		showSettings();
		updateSaveCurrentButton();
    }
}

function dismissSettings() {
    $(".settingsIcon").removeClass("change");
    $("#settingsPopup").hide();
    $("#saveWordPopup").hide();
    $("#partsselection").hide();
    $("#downloadPopup").hide();
    $("#multilangchoice").hide();
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
			$("#settingsPopup").hide();
		});

		// choose display parts
		$("#openPartsSelection").off("click");
		$("#openPartsSelection").on("click", function () {
			$("#partsselection").show();

			$(".settingsIcon").addClass("change");
		
			$("#settingsPopup").hide();
		});

		// download lexicon
		$("#openDownload").off("click");
		$("#openDownload").on("click", function () {
			openDownload();

			$(".settingsIcon").addClass("change");
		
			$("#settingsPopup").hide();
		});
    }
}

// show help text
$(function () {
    $(".openHelp").on("click", function () {
	openPageDescription();
	// if ($("#helpPopup").css("display") === "block") {
	//     dismissSettings();
	// } else {
	//     $("#helpPopup").show();
	//     $(".settingsIcon").addClass("change");
	//     $("#settingsPopup").hide();
	// }
    });
});
