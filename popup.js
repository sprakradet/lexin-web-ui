// ----------------------------------------------------------------------
// Functionality for the feedback popup.
// ----------------------------------------------------------------------

let lastFocusedElement = null;

/* --------- SHOW POPUP --------- */
function showPopup() {
  // accessibility (tab focus)
  lastFocusedElement = document.activeElement;

  document.getElementById('popup').style.display = 'block';
  document.body.classList.add("modal-open");

  // accessibility (tab focus)
  const firstFocusable = popup.querySelector(
    'input:not([tabindex="-1"]), textarea, button, [tabindex]:not([tabindex="-1"])'
  );
  if (firstFocusable) {
    firstFocusable.focus();
  }
}

/* --------- CLOSE POPUP --------- */
function closePopup() {
  document.getElementById('popup').style.display = 'none';
  document.body.classList.remove("modal-open");
  document.querySelectorAll("#popup input[type='text']").forEach(el => el.value = "");
  document.querySelectorAll("#popup textarea").forEach(el => el.value = "");
  document.querySelectorAll("#popup input[type='radio']").forEach(el => el.checked = false);

  // accessibility (tab focus)
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

/* --------- RESTORE POPUP CONTENT --------- */
let originalPopupHTML = "";
document.addEventListener("DOMContentLoaded", () => {
    originalPopupHTML = document.getElementById("popup").innerHTML;
});
function restorePopupContent() {
    document.getElementById("popup").innerHTML = originalPopupHTML;
}

/* --------- CHECK IF FEEDBACK VALID --------- */
function isValidFeedback() {
	// detect spam
	const phoneNumber = document.getElementById("phoneNumber").value.trim();
    if (phoneNumber !== "") {
		console.log("spam detected")
        return false;
    }

	let valid = true;

	// check mandatory question
	const buttons = document.querySelectorAll("input[name='feedback']");
    const checked = document.querySelector("input[name='feedback']:checked");
    const firstButton = buttons[0];
    if (!checked) {
        firstButton.setCustomValidity("Välj ett alternativ.");
        firstButton.reportValidity();

		// accessibility
  		buttons.forEach(btn => btn.setAttribute("aria-invalid", "true"));

        valid = false;
    }
    else {
		firstButton.setCustomValidity("");

		// accessibility
  		buttons.forEach(btn => btn.removeAttribute("aria-invalid"));
	}

	// check comment length
	const firstComment = document.querySelector("textarea[name='comment']");
	if (firstComment.value.length > 500 ) {
		firstComment.setCustomValidity("Texten är för lång. Du kan skriva max 500 tecken.");
        firstComment.reportValidity();

		// accessibility
		firstComment.setAttribute("aria-invalid", "true");

        valid = false;
    }
    else {
		firstComment.setCustomValidity("");

		// accessibility
		firstComment.removeAttribute("aria-invalid");
	}

	// check mail address format
	const firstAddress = document.querySelectorAll("input[name='mailaddress']")[0];
	const re = /\S+@\S+\.\S+/;
	if (firstAddress.value != "" && (!re.test(firstAddress.value) || firstAddress.value.length > 254)) {
		firstAddress.setCustomValidity("Ange en giltig mejladress, t.ex. namn@domän.se");
        firstAddress.reportValidity();

		// accessibility
		firstAddress.setAttribute("aria-invalid", "true");

        valid = false;
    }
    else {
		firstAddress.setCustomValidity("");

		// accessibility
		firstAddress.removeAttribute("aria-invalid");
	}

	if(!valid) {
		return false;
	}
	return true;
}

/* --------- RETRIEVE USER'S CHOSEN LANGUAGE(S) --------- */
function getLangChoice () {
	let selectedLangsString = "";
	const isMultilang = document.getElementById("multiple_languagesSet").checked;

	// several languages chosen
	if (isMultilang) {
		let selectedLangs = $(".multilangcolumn input[name='multilangchoice']:checked").get();
		selectedLangs.forEach(lang => {
			let label = $(`label[for='${lang.id}']`).text();
			if (!(lang === selectedLangs[0])) {
				selectedLangsString = selectedLangsString + ",";
			}
			selectedLangsString = selectedLangsString + " " + label;
		});
		selectedLangsString = selectedLangsString.trim();
	}
	// single language chosen
	else {
		const selectedLang = document.getElementById("languageChoice");
		selectedLangsString = selectedLang.options[selectedLang.selectedIndex].text;
	}
	
	// no language chosen
	if(selectedLangsString == "") {
		selectedLangsString = "svenska";
	}
	
	return selectedLangsString;
}

/* --------- SEND FEEDBACK TO API --------- */
async function sendFeedback() {
	if (!isValidFeedback()) {
    	return;
	}

	// current search word(s)
	let query = $("#searchQuery").val();

	// current language(s)
	let selectedLangsString = getLangChoice();

	// current user browser 
	let browser = window.navigator.userAgent;

	// current user device
	const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(browser);
	let device = "dator";
	if(isMobile) {
		device = "mobil";
	}

	// prepare data
	const feedbackHelpful = document.querySelector("input[name='feedback']:checked")?.value || null;
	const feedbackComment = document.getElementById("comment").value.trim();
	const feedbackEmail = document.getElementById("mailaddress").value.trim();
	const phoneNumber = document.getElementById("phoneNumber").value.trim();	// spam
	const payload = {
		is_helpful: feedbackHelpful,
		comment: feedbackComment,
		email_address: feedbackEmail,
		languages: selectedLangsString,
		query: query,
		device: device,
		browser: browser,
		phone_number: phoneNumber												// spam
	};

	// post to api
	try {
		const response = await fetch("https://atlas.isof.se/flask_admin/api/feedback", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
    	});
		if (!response.ok) {
			console.error("Ett fel uppstod med responsen:", response.status);
			return;
		}
	} catch(error) {
		console.log("Ett fel uppstod med fetchen:", error);
	}

	// close window & reset form
	document.getElementById("popup").innerHTML = "<div class='popupTitle' style='text-align: center;'>Tack för din återkoppling!</div>";
	setTimeout(() => {
        closePopup();
        restorePopupContent();
    }, 2000);
}
