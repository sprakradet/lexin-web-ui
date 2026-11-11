// --------------------------------------------------------------------
// Shows the Help text.
// --------------------------------------------------------------------

/* --------- HELP PAGE: EXEMPEL --------- */
function openHelpExamples(inner) {
    inner.innerHTML = `
	<h2>Språkexempel</h2>
	<p>
		Språkexempel visar hur uppslagsordet kan användas. Det finns tre sorters 
		exempel: fria fraser och meningar (satser eller satsfragment),
		sammansatta ord, och fasta uttryck (idiom).
	</p>
        `;
}

/* --------- HELP PAGE: IDIOM --------- */
function openHelpIdioms(inner) {
    inner.innerHTML = `
	<h2>Språkexempel, Idiom ("Uttryck")</h2>
	<p>
		Språkexempel visar hur uppslagsordet kan användas. Det finns tre sorters 
		exempel: fria fraser och meningar (satser eller satsfragment),
		sammansatta ord, och fasta uttryck (idiom).
	</p>
	<h3>Idiom</h3>
	<p>
	  	Idiom är fraser och meningar som måste förklaras.
	</p>
	<p>
		Det är ofta svårt att gissa på vilket av orden i idiomet som man hittar 
		förklaringen i en ordbok. Hittar man idiomet <i>lovar guld och gröna 
		skogar</i> i artikeln <i>lovar</i>, <i>guld</i>, <i>grön</i> 
		eller <i>skog</i>? I Lexin hittar informationen i alla fyra 
		artiklarna. Det bör spara en del tid och energi.
	</p>
        `;
}

/* --------- HELP PAGE: SAMMANSÄTTNINGAR --------- */
function openHelpComps(inner) {
    inner.innerHTML = `
	<h2>Språkexempel, Sammansättning</h2>
	<p>
		Språkexempel visar hur uppslagsordet kan användas. Det finns tre sorters 
		exempel: fria fraser och meningar (satser eller satsfragment),
		sammansatta ord, och fasta uttryck (idiom).
	</p>
	<h3>Sammansättningar</h3>
	<p>
		När man gör en sammansättning av två eller flera ord på svenska ändras 
		ofta något litet. T.ex. <i>skog</i> + <i>dunge</i> blir 
		<i>skog<b>s</b>dunge</i>. Mycket ofta lägger man till ett 
		<i>s</i> som i det här fallet. Andra exempel är
		<i>berg<b>s</b></i>-<i>trakt</i>, 
		<i>dag<b>s</b></i>-<i>resa</i>.
	</p>
	<p>
		Om det första ordet är ett substantiv och slutar på <i>a</i> eller 
		<i>e</i> är det vanligt att den vokalen försvinner: <i>flicka</i> + 
		<i>grupp</i> blir <i>flick</i>-<i>grupp</i>, <i>skola</i> + 
		<i>klass</i> blir <i>skol</i>-<i>klass</i>.
	</p>
       `;
}

/* --------- HELP PAGE: ANVNÄNDNING --------- */
function openHelpUse(inner) {
    inner.innerHTML = `
	<h2>Användning</h2>
	<p>
		Användningskommentarer ger information om hur ett ord används eller 
		begränsningar av sammanhang ordet kan användas i.
	</p>
       `;
}

/* --------- HELP PAGE: AVLEDNINGAR --------- */
function openHelpDer(inner) {
    inner.innerHTML = `
	<h2>Avledning</h2>
	<p>
		Avledningar är ord gjorda av ett annat ord genom att lägga till en 
		förstavelse eller en ändelse, till exempel <i>allergi</i> och 
		<i>allergiker</i> (en person som har en allergi), eller <en>jogga</i> 
		och <i>joggning</i> (när man joggar).
	</p>
       `;
}

/* --------- HELP PAGE: FÖRTKORTNINGAR --------- */
function openHelpAbbr(inner) {
    inner.innerHTML = `
	<h2>Förkortning</h2>
	<p>
		"Förkortning" visar det vedertagna sättet att förkorta ordet, 
		t.ex. <i>dr</i> i stället för <i>doktor</i>, <i>kg</i> i stället 
		för <i>kilogram</i>, eller <i>SVT</i> i stället för <i>Sveriges 
		Television</i>.
	</p>
       `;
}

/* --------- HELP PAGE: UPPSLAGSORD --------- */
function openHelpVar(inner) {
    inner.innerHTML = `
	<h2>Uppslagsord</h2>
	<p>
		Ett uppslagsord kan följas av en alternativform. Ofta är det en annan 
		form som har samma uttal men annan stavning, t.ex. <i>sjal</i> och 
		<i>schal</i> eller <i>i dag</i> och <i>idag</i>. Det kan också 
		vara en talspråksvariant, t.ex. <i>sedan</i> och <i>sen</i>. Den 
		första formen är huvudformen och den form som rekommenderas. Uttal och 
		böjningsformer gäller uppslagsordet, inte alternativformen.
    </p>
       `;
}

/* --------- HELP PAGE: AVSTAVNNG --------- */
function openHelpHyp(inner) {
    inner.innerHTML = `
	<h2>Avstavning</h2>
	<p>
		Vissa ord ändras när de avstavas. Sammansatta ord med tre likadana 
		konsonanter i rad skrivs som två, men när ordet avstavas skrivs alla tre
		ut igen, t.ex. <i>äggula</i> som avstavas <i>ägg-gula</i> eller 
		<i>Halland</i> som avstavas <i>Hall-land</i>.
	</p>
       `;
}

/* --------- HELP PAGE: SE --------- */
function openHelpSee(inner) {
    inner.innerHTML = `
	<h2>"Se"-referens</h2>
	<p>
		"Se"-referenser hänvisar till ordet som en förkortning står för (t.ex. 
		<i>AD, Se: Arbetsdomstolen</i>) eller normalformen för en talspråklig
		variant (t.ex. <i>sen, Se: sedan</i>).
	</p>
       `;
}

/* --------- HELP PAGE: JÄMFÖR --------- */
function openHelpCompare(inner) {
    inner.innerHTML = `
	<h2>Jämförelse</h2>
	<p>
		"Jämför"-referenser visar liknande ord, t.ex. <i>förstaspråk</i> och 
		<i>andraspråk</i> och för partikelverb som både kan skrivas ihop och 
		isär med liknande betydelse, t.ex. <i>hålla av</i> och 
		<i>avhållen</i>.
	</p>
       `;
}

/* --------- HELP PAGE: MOTSATS --------- */
function openHelpAnt(inner) {
    inner.innerHTML = `
	<h2>Motsats</h2>
	<p>
		Ibland förklaras ord med ett motsatsord (en <i>antonym</i>).
	</p>
	<p>
		Syftet med att ge synonymer eller antonymer utöver definitionen är 
		dubbelt. Dels ökar det chansen att du förstår uppslagsordet – det räcker 
		ju att du förstår en av synonymerna (eller antonymerna). Dels kan det 
		bidra till att öka ditt aktiva svenska ordförråd.
	</p>
       `;
}

/* --------- HELP PAGE: GRAMMATISKA KONSTRUKTIONER --------- */
function openHelpConstr(inner) {
    inner.innerHTML = `
	<h2>Grammatiska konstruktioner</h2>
	<p>
	  Alla verb i ordboken - utom de som bara förekommer i idiom - har mönster 
	  som visar hur verbet används.
	</p>
	<p>
		Ett exempel är verbet <i>tycker om</i> som har mönstret <b>&lt;A 
		tycker om B/x/att+SATS&gt;</b>.
	</p>
	<p> 
		För att få hjälp med att förstå en grammatisk konstruktion kan du klicka 
		på mönstret. Då visas en kort förklaring till vad de olika delarna, 
		t.ex. <i>A</i> och <i>B</i>, betyder. En lista med alla 
		kombinationer visas också.
	</p>
    <p>
		A/B = en person, x/y = en sak
		<ul>
			<li>
				<span>
					<span></span>
					<span class="metavariable">någon</span>
					<span>tycker om </span>
					<span class="metavariable">någon</span>
					<span></span>
				</span>
			</li>
			<li>
				<span>
					<span></span>
					<span class="metavariable">någon</span>
					<span> tycker om </span>
					<span class="metavariable">något</span>
					<span></span>
				</span>
			</li>
			<li>
				<span>
					<span></span>
					<span class="metavariable">någon</span>
					<span> tycker om att + </span>
					<span class="metavariable">sats</span>
					<span></span>
				</span>
			</li>
		</ul>
	</p>
	<p>
		<i>A</i> och <i>B</i> är personer, <i>x</i> är en sak, och 
		<i>att+SATS</i> betyder att det också kan vara en fras eller en hel 
		sats. Tecknet "/" betyder "eller", så mönstret betyder att <i>en person
	    tycker om en person eller en sak eller att + en fras</i>. Exempel på 
		hur <i>tycker om</i> kan användas: (1) <cite>jag tycker om 
		Lisa</cite>, (2) <cite>jag tycker om jordgubbar</cite>, och (3) <i>jag
	    tycker om att spela fotboll</i>.
	</p>
	<p> 
		Mönster för verb är till för att visa möjliga sätt att använda verbet 
		utan att ge språkexempel för varje möjlighet. Det kan finnas fler 
		möjligheter, för vissa verb visas bara de vanligaste mönstren.
	</p>
	<p>
		I verbmönstren finns personer och saker. Det kan också finnas satsdelar 
		som <i>subjekt</i> och <i>objekt</i>. Det finns även ord som 
		beskriver betydelse, t.ex. <i>TID</i> och <i>PLATS</i>.
	</p>
       `;
}

/* --------- HELP PAGE: SAKUPPLYSNING --------- */
function openHelpSakuppl(inner) {
    inner.innerHTML = `
	<h2>Sakupplysning ("Förklaring")</h2>
	<p>
	  	En sakupplysning är en längre förklaring. Lexin innehåller 
		sakupplysningar till många "samhällsord".
	</p>
	<p>
	  	Normalt brukar annars ordböcker (lexikon) förklara ord och 
		uppslagsböcker (encyklopedier) förklara den verklighet som finns bakom 
		orden. Det är inte lätt att dra en gräns mellan ordförklaring och 
		sakförklaring. I Lexin finns sakförklaringar där det har ansetts
		lämpligt.
	</p>
	<p>
		Sakförklaringar finns dels för ord som är namnliknande (t.ex. 
		<i>LO</i>, <i>Domänverket</i>, <i>advent</i>) och vars innebörd 
		inte är lätt att förstå, dels som kompletterande information till ord 
		som också ges en vanlig ordförklaring (t.ex. <i>barnbidrag</i>, 
		<i>adoption</i>).
	</p>
		`;
}

/* --------- HELP PAGE: ORDKLASS --------- */
function openHelpPoS(inner, pos) {
    inner.innerHTML = `
	<h2>Ordklass</h2>
	<p>
        Ord tillhör en ordklass, t.ex. substantiv eller verb. Ordklasser som 
		förekommer i Lexin är: substantiv, adjektiv, verb, adverb, preposition, 
		pronomen, konjunktion, interjektion, räkneord, namn, artikel, 
		infinitivmärke och förkortning. Det finns också två klasser 
		<i>förled</i> och <i>efterled</i> som inte är riktiga ordklasser men 
		som används när uppslagsordet är förled eller efterled i sammansatta 
		ord.
	</p>
		`;
}

/* --------- HELP PAGE: UTTAL --------- */
function openHelpPhon(inner, phon) {
    let html = `
	<h2>Uttal</h2>
	<p> 
		Uttal visas med både <i>fonetisk skrift</i>, t.ex. [` + phon + 
		`], och med en ljudfil du kan lyssna på.
	</p>
    <h3>[` + phon + `]</h3>
	<ul>`;

    if(phon.indexOf('ʃ') >= 0) {
		html += '<li>Tecknet esh "ʃ" betyder <i>sje</i>-ljud, som i '
				+ '<i>sjunga</i> eller <i>7</i>.</li>';
    }
    if(phon.indexOf(':') >= 0) {
		html += '<li>Tecknet kolon ":" betyder att ljudet före kolon ":" är '
				+ 'långt, en lång vokal eller lång konsonant.</li>';
    }
    if(phon.indexOf('̣') >= 0) {
		html += '<li>Tecknet punkt " ̣" betyder att betoning ("tryck") ska vara '
				+ 'på stavelsen där punkt " ̣" finns.</li>';
    }
    if(phon.indexOf('ç') >= 0) {
		html += '<li>Tecknet cedilj-c "ç" betyder <i>tje</i>-ljud, som i '
				+ '<i>kikare</i>, <i>kjol</i>, eller <i>20</i>.</li>';
    }
    if(phon.search('[aeiouyåäöAEIOUYÅÄÖ]‿[aeiouyåäöAEIOUYÅÄÖ]') >= 0) {
		html += '<li>Bågen "‿" mellan två vokaler betyder <i>diftong</i>, '
				+ 'att de två vokalerna flyter ihop som t.ex. i '
				+ '<i>automat</i>.</li>';
    }
    if(phon.search('[^aeiouyåäöAEIOUYÅÄÖ]‿[^aeiouyåäöAEIOUYÅÄÖ]') >= 0) {
		html += '<li>Bågen "‿" mellan två konsonanter betyder att de två '
				+ 'bokstäverna före och efter bågen "‿" smålter ihop till ett '
				+ 'ljud. När <i>r</i> följs av <i>d</i>, <i>t</i>, '
				+ '<i>n</i>, <i>l</i> eller <i>s</i>, smälter ljuden '
				+ 'ofta ihop till ett enda ljud.</li>';
    }
    if(phon.indexOf('²') >= 0) {
		html += '<li>Den upphöjda tvåan "²" betyder <i>grav accent</i> (som '
				+ 'också kallas <i>accent 2</i>). När det inte finns någon '
				+ ' tvåa utan bara tryckmarkering, punkt " ̣" (eller ingen '
				+ 'tryckmarkering alls), betyder det att ordet har akut '
				+ 'accent.</li>';
    }
    if(phon.indexOf('ŋ') >= 0) {
		html += '<li>Tecknet eng "ŋ" betyder <i>ng</i>-ljud, som i '
				+ '<i>lång</i>, <i>dygn</i>, eller <i>bank</i>.</li>';
    }
    
    html += `</ul>
       `;

    inner.innerHTML = html;
}

/* --------- HELP PAGE: VIDEO --------- */
function openHelpVideo(inner) {
    inner.innerHTML = `
	<h2>Video</h2>
	<p>
		För vissa ord kan du se ett videoklipp som visar vad ordet betyder.
	</p>
	<p>
		Klicka på knappen "Visa video i Lexin" för att ladda videon och visa den 
		i Lexin.
	</p>
       `;
}

/* --------- HELP PAGE: IMAGE --------- */
function openHelpImage(inner) {
    inner.innerHTML = `
	<h2>Bild</h2>
	<p>
		Många ord har en eller flera bilder som hjälper till att förklara ordet. 
	</p>
	<p>
		Klicka på knappen "Visa bild i Lexin" för att ladda bilder och visa dem 
		i Lexin.
	</p>
       `;
}

/* --------- HELP PAGE: HOW TO USE LEXIN --------- */
async function openHelpUseLexin(inner) {
	const response = await fetch("help.html");
    const html = await response.text();
    const parser = new DOMParser();
    const helpDocument = parser.parseFromString(html, "text/html");
    inner.innerHTML = helpDocument.body.innerHTML;
}

async function openHelpUseLexin2(inner) {
	const response = await fetch("help_use_lexin.html");
    const html = await response.text();
    const parser = new DOMParser();
    const helpDocument = parser.parseFromString(html, "text/html");
    inner.innerHTML = helpDocument.body.innerHTML;
}

async function openHelpSearchResults(inner) {
	const response = await fetch("help_search_results.html");
    const html = await response.text();
    const parser = new DOMParser();
    const helpDocument = parser.parseFromString(html, "text/html");
    inner.innerHTML = helpDocument.body.innerHTML;
}

async function openHelpAboutLexin(inner) {
	const response = await fetch("help_about_lexin.html");
    const html = await response.text();
    const parser = new DOMParser();
    const helpDocument = parser.parseFromString(html, "text/html");
    inner.innerHTML = helpDocument.body.innerHTML;
}

async function openHelpLicenses(inner) {
	const response = await fetch("help_licenses.html");
    const html = await response.text();
    const parser = new DOMParser();
    const helpDocument = parser.parseFromString(html, "text/html");
    inner.innerHTML = helpDocument.body.innerHTML;
}

/* --------- PAGE: ACCESSIBILITY STATEMENT --------- */
async function openAccessibilityStatement(inner) {
	const response = await fetch("accessibility_statement.html");
    const html = await response.text();
    const parser = new DOMParser();
    const helpDocument = parser.parseFromString(html, "text/html");
    inner.innerHTML = helpDocument.body.innerHTML;
}

/* --------- OPEN HELP PAGE (NEW) --------- */
let lastHelpOpener = null;
let explanationTrapCleanup = null;
function openPageDescription(elem, button) {
	lastHelpOpener = button !== undefined ? button : elem;

	// clear content
	const content = document.getElementById("popupGeneralContent");
	content.innerHTML = "";

	// add text content
	if (typeof elem === "function") {
    	elem(content);
	}
	else {
		populateHelpPopup(content, elem);
	}
	
	// add non-clickable shadow background
	const backdrop = document.getElementById("popupBackdrop");
	backdrop.hidden = false;

	// show popup
	const popup = document.getElementById("popupGeneral");
	popup.hidden = false;
	document.body.classList.add("help-open");

	initHelpOpenMoreInfo();
	
	// change/trap focus
	popup.setAttribute("tabindex", "-1");
	if (explanationTrapCleanup) {
		explanationTrapCleanup();
	}
	explanationTrapCleanup = trapFocus(popup);
	const focusables = getFocusableElements(popup);
	(focusables[0] || popup).focus();
}

/* --------- ADD CONTENT TO HELP PAGE (NEW) --------- */
async function populateHelpPopup(content, elem) {
	// general help page
	if (elem === "help_use_lexin") {
		await openHelpUseLexin(content);
	}
	else if (elem === "help_use_lexin2") {
		await openHelpUseLexin2(content);
	}
	else if (elem === "help_search_results") {
		await openHelpSearchResults(content);
	}
	else if (elem === "help_about_lexin") {
		await openHelpAboutLexin(content);
	}
	else if (elem === "help_licenses") {
		await openHelpLicenses(content);
	}
	// accessibility statement page
	else if (elem === "accessibility_statement") {
		await openAccessibilityStatement(content);
	}

	else if (elem.textContent === "förklaring") {
		openHelpSakuppl(content);
	}
	else if (elem.classList.contains("phonetic")) {
		openHelpPhon(content, elem.dataset.phonetic);
	}
	else if (elem.textContent.includes("användning")) {
		openHelpUse(content);
	}
	else if (elem.textContent.includes("konstruktioner")) {
		openHelpConstr(content);
	}
	else if (elem.textContent.includes("motsats")) {
		openHelpAnt(content);
	}
	else if (elem.textContent === "jämför") {
		openHelpCompare(content);
	}
	else if (elem.textContent === "se") {
		openHelpSee(content);
	}
	else if (
		elem.textContent.includes("avstavning") ||
		elem.classList.contains("avstavning")
	) {
		openHelpHyp(content);
	}
	else if (
		elem.textContent.includes("förkortning") ||
		elem.classList.contains("förkortning")
	) {
		openHelpAbbr(content);
	}
	else if (elem.textContent.includes("variantform")) {
		openHelpVar(content);
	}
	else if (elem.textContent.includes("avledning")) {
		openHelpDer(content);
	}
	else if (elem.textContent.includes("sammansättning")) {
		openHelpComps(content);
	}
	else if (elem.textContent === "uttryck") {
		openHelpIdioms(content);
	}
	else if (elem.textContent === "exempel") {
		openHelpExamples(content);
	}
	else if (elem.textContent.includes("video")) {
		openHelpVideo(content);
	}
	else if (elem.textContent === "bild") {
		openHelpImage(content);
	}
	else if (elem.classList.contains("ordklass")) {
		openHelpPoS(content, "");
	}
	else {
		console.log(
			"unknown type of elem",
			elem
		);
	}
}

/* --------- CLOSE HELP PAGE (NEW) --------- */
function closePopupGeneral() {
	// hide non-clickable shadow background
	const backdrop = document.getElementById("popupBackdrop");
	backdrop.hidden = true;

	// hide popup
	const popup = document.getElementById("popupGeneral");
	popup.hidden = true;
	document.body.classList.remove("help-open");

	// accessibiliy (focus)
	if (explanationTrapCleanup) {
		explanationTrapCleanup();
		explanationTrapCleanup = null;
	}

	if (lastHelpOpener && typeof lastHelpOpener.focus === "function") {
		lastHelpOpener.focus();
	}

	const content = document.getElementById("popupGeneralContent");
	content.innerHTML = "";
}

/* --------- CLOSE HELP PAGE ON ESC (NEW) --------- */
document.addEventListener("keydown", function (event) {
	const popup = document.getElementById("popupGeneral");

	if (event.key === "Escape" && popup && !popup.hidden) {
		event.preventDefault();
		closePopupGeneral();
	}
});

/* --------- 'SHOW MORE' FUNCTIONALITY (NEW) --------- */
function initHelpOpenMoreInfo() {
	// do nothing if already initialized
	if (document.body.dataset.helpOpenMoreInfoInit === "1") return;
	document.body.dataset.helpOpenMoreInfoInit = "1";

	// set accessibility to open more info containers
	function setAccessibility(root = document) {
		const elements = root.querySelectorAll(".helpOpenMoreInfo");
		elements.forEach((elem) => {
			// accessibility already set
			if (elem.dataset.helpOpenMoreInfoA11y === "1") return;
			elem.dataset.helpOpenMoreInfoA11y = "1";

			elem.setAttribute("tabindex", "0");
			elem.setAttribute("role", "button");
			if (!elem.hasAttribute("aria-expanded")) {
				elem.setAttribute("aria-expanded", "false");
			}
		});
	}
	setAccessibility(document);
	const observer = new MutationObserver(() => setAccessibility(document));
	observer.observe(document.body, { childList: true, subtree: true });

	// add click handler (delegated)
	document.addEventListener("click", function (e) {
		const elem = e.target.closest(".helpOpenMoreInfo");
		if (!elem) return;

		const targetId = elem.getAttribute("data-target");
		if (!targetId) return;

		// find container
		const container = elem.closest("#LexinExplanationsWrapper, .LexinExplanationsWrapper") || document;
		const target = container.querySelector("#" + CSS.escape(targetId));
		if (!target) return;

		// toggle visibility
		const isOpen = target.style.display === "block";

		target.style.display = isOpen ? "none" : "block";
		elem.setAttribute("aria-expanded", String(!isOpen));
		elem.textContent = isOpen ? "Visa mer +" : "Visa mindre –";

		target.style.display = isOpen ? "none" : "block";
		elem.setAttribute("aria-expanded", String(!isOpen));
  });

  // accessibility
  document.addEventListener("keydown", function (e) {
	const elem = e.target.closest(".helpOpenMoreInfo");
	if (!elem) return;

	if (e.key === "Enter" || e.key === " ") {
	  e.preventDefault();
	  elem.click();
	}
  });
}

/* --------- FIX LINK BUG (LINK SHOULD NOT JUMP TO TOP OF PAGE) --------- */
document.addEventListener('click', (e) => {
	// find in-page link
	const link = e.target.closest('a[href^="#"]');
	if (!link) return;

	// ignore dummy links
	const href = link.getAttribute('href');
	if (!href || href === '#' || href === '#!') return;

	// get element
	const id = decodeURIComponent(href.slice(1));
	const target = document.getElementById(id);
	if (!target) return; 

	// stop buggy scroll behaviour
	e.preventDefault();
	e.stopPropagation();

	// scroll to correct part of page
	target.scrollIntoView({ block: 'start' });

	// accessibility: set focus
	if (!target.hasAttribute('tabindex')) {
		target.setAttribute('tabindex', '-1');
	}
	target.focus({ preventScroll: true });

	// update url
	history.pushState(null, '', `#${encodeURIComponent(id)}`);
})

/* --------- UP BUTTON JUMPS TO TOP OF PAGE --------- */
function jumpToTopOfPage() {
	/*window.scrollTo({
		top: 0,
		behavior: "smooth"
	});*/

	const content = document.getElementById("popupGeneral");
    content.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}