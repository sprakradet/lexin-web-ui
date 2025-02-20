// --------------------------------------------------------------------
// Shows the Help text.
// --------------------------------------------------------------------


function openHelpExamples(inner) {
    inner.innerHTML = `
	<h3>Språkexempel</h3>

	<p>
	  Språkexempel visar hur uppslagsordet kan
	  användas. Det finns tre sorters exempel: fria fraser och
	  meningar (satser eller satsfragment),
	  sammansatta ord, och
	  fasta uttryck (idiom).
	</p>
        `;
}

function openHelpIdioms(inner) {
    inner.innerHTML = `
	<h3>Språkexempel, Idiom ("Uttryck")</h3>

	<p>
	  Språkexempel visar hur uppslagsordet kan
	  användas. Det finns tre sorters exempel: fria fraser och
	  meningar (satser eller satsfragment),
	  sammansatta ord, och
	  fasta uttryck (idiom).
	</p>
        <h4>Idiom</h4>
        <p>
	  Idiom är fraser och meningar som måste förklaras.
	</p>
	<p>
	  Det är ofta svårt 
	  att gissa på vilket av orden i idiomet som man
	  hittar förklaringen i en ordbok. Hittar man idiomet <em>lovar
	  guld och gröna skogar</em> i
	  artikeln <em>lovar</em>, <em>guld</em>, <em>grön</em>
	  eller <em>skog</em>? I Lexin hittar informationen i alla fyra artiklarna. Det
	  bör spara en del tid och energi.
	</p>
        `;
}

function openHelpComps(inner) {
    inner.innerHTML = `
	<h3>Språkexempel, Sammansättningar</h3>

	<p>
	  Språkexempel visar hur uppslagsordet kan
	  användas. Det finns tre sorters exempel: fria fraser och
	  meningar (satser eller satsfragment),
	  sammansatta ord, och
	  fasta uttryck (idiom).
	</p>
        <h4>Sammansättningar</h4>
        <p>
          När man gör en sammansättning av två eller flera ord på svenska ändras ofta något litet.
          T.ex. "skog" + "dunge" blir "skog<strong>s</strong>dunge". Mycket ofta
          lägger man till ett <em>s</em> som i det här fallet. Andra exempel är <em>berg<strong>s</strong></em>-<em>trakt</em>, <em>dag<strong>s</strong></em>-<em>resa</em>).
        </p><p>
          Om det första ordet är ett substantiv och slutar på <em>a</em> eller <em>e</em> är det vanligt att den vokalen försvinner: 
          "flicka" + "grupp" blir <em>flick</em>-<em>grupp</em>, "skola" + "klass" blir <em>skol</em>-<em>klass</em>.
       </p>
       `;
}

function openHelpUse(inner) {
    inner.innerHTML = `
       <p>Användningskommentarer ger information om hur ett ord används eller begränsningar av sammanhang ordet kan användas i.</p>
       `;
}

function openHelpDer(inner) {
    inner.innerHTML = `
       <p>Avledningar är ord gjorda av ett annat ord genom att lägga till en förstavelse eller en ändelse, till exempel "allergi" och "allergiker" (en person som har en allergi), eller "jogga" och "joggning" (när man joggar).</p>
       `;
}

function openHelpAbbr(inner) {
    inner.innerHTML = `
       <p>"Förkortning" visar det vedertagna sättet att förkorta ordet, t.ex. "dr" i stället för "doktor", "kg" i stället för "kilogram", eller "SVT" i stället för "Sveriges Television".</p>
       `;
}

function openHelpVar(inner) {
    inner.innerHTML = `
	<p> Ett uppslagsord kan följas av en alternativform. 
	  Ofta är det en annan form som har samma uttal men annan
	  stavning, t.ex. <em>sjal</em> och <em>schal</em>
	  eller <em>i dag</em> och <em>idag</em>. Det kan också vara
	  en talspråksvariant, t.ex. <em>sedan</em>
	  och <em>sen</em>. Den första formen är huvudformen och
	  den form som rekommenderas. Uttal och böjningsformer gäller
	  uppslagsordet, inte alternativformen.
       </p>
       `;
}

function openHelpHyp(inner) {
    inner.innerHTML = `
       <p> Vissa ord ändras när de avstavas. Sammansatta ord med tre likadana konsonanter i rad skrivs som två, men när ordet avstavas skrivs alla tre ut igen, t.ex. "äggula" som avstavas "ägg-gula" eller "Halland" som avstavas "Hall-land".</p>
       `;
}

function openHelpSee(inner) {
    inner.innerHTML = `
       <p>"Se"-referenser hänvisar till ordet som en förkortning står för (t.ex. "AD, Se: Arbetsdomstolen") eller normalformen för en talspråklig variant (t.ex. "sen, Se: sedan").</p>
       `;
}

function openHelpCompare(inner) {
    inner.innerHTML = `
       <p>"Jämför"-referenser visar liknande ord, t.ex. "förstaspråk" och "andraspråk" och för partikelverb som både kan skrivas ihop och isär med liknande betydelse, t.ex. "hålla av" och "avhållen".</p >
       `;
}

function openHelpAnt(inner) {
    inner.innerHTML = `
       <p>
       Ibland förklaras ord med ett motsatsord (en <em>antonym</em>).
       </p>
	  <p>
	    Syftet med att ge synonymer eller antonymer utöver
	    definitionen är dubbelt. Dels ökar det chansen att du
	    förstår uppslagsordet – det räcker ju att du förstår en av
	    synonymerna (eller antonymerna). Dels kan det bidra till
	    att öka ditt aktiva svenska ordförråd.
	  </p>
       `;
}

function openHelpConstr(inner) {
    inner.innerHTML = `
	<h3>Grammatiska konstruktioner</h3>
	<p>
	  Alla verb i ordboken - utom de som bara förekommer i
	  idiom - har mönster som visar hur verbet används.
	</p>
	
	<p> Ett exempel är verbet <em>tycker om</em> som har mönstret
	  <strong>&lt;A tycker om B/x/att+SATS&gt;</strong>.</p>

	<p> För att få hjälp med att förstå en grammatisk konstruktion
	  kan du klicka på mönstret. Då visas en kort förklaring till
	  vad de olika delarna, t.ex. <em>A</em> och <em>B</em>,
	  betyder. En lista med alla kombinationer visas också.</p>

        <p>A/B = en person, x/y = en
        sak<ul><li><span><span></span><span
        class="metavariable">någon</span><span> tycker om </span><span
        class="metavariable">någon</span><span></span></span></li><li><span><span></span><span
        class="metavariable">någon</span><span> tycker om </span><span
        class="metavariable">något</span><span></span></span></li><li><span><span></span><span
        class="metavariable">någon</span><span> tycker om att +
        </span><span
        class="metavariable">sats</span><span></span></span></li></ul>
        </p>

	<p>
          <em>A</em> och <em>B</em> är
	  personer, <em>x</em> är en sak, och <em>att+SATS</em>
	  betyder att det också kan vara en fras eller en hel sats. Tecknet "/"
	  betyder "eller", så mönstret betyder att <em>en person
	    tycker om en person eller en sak eller att + en
	    fras</em>. Exempel på hur <em>tycker om</em> kan
	  användas: (1) <cite>jag tycker om Lisa</cite>,
	  (2) <cite>jag tycker om jordgubbar</cite>, och (3) <em>jag
	    tycker om att spela fotboll</em>.
	</p>


	<p> Mönster för verb är till för att visa möjliga sätt att
	  använda verbet utan att ge språkexempel för varje
	  möjlighet. Det kan finnas fler möjligheter,
	  för vissa verb visas bara de
	  vanligaste mönstren.</p>

	<p> I verbmönstren finns personer och saker. Det kan också
	  finnas satsdelar som <em>subjekt</em> och <em>objekt</em>. Det
	  finns även ord som beskriver betydelse, t.ex. <em>TID</em>
	  och <em>PLATS</em>.
       `;
}

function openHelpSakuppl(inner) {
    inner.innerHTML = `<h3>Sakupplysning ("Förklaring")</h3>
	<p>
	  En sakupplysning är en längre förklaring. Lexin innehåller
	  sakupplysningar till många "samhällsord".
        </p><p> Normalt brukar annars ordböcker (lexikon)
	  förklara ord och uppslagsböcker (encyklopedier) förklara den
	  verklighet som finns bakom orden. Det är inte lätt att dra
	  en gräns mellan ordförklaring och sakförklaring. I Lexin
	  finns sakförklaringar där det har ansetts
	  lämpligt.
        </p><p> Sakförklaringar finns dels för ord som är
	  namnliknande
	  (t.ex. <em>LO</em>, <em>Domänverket</em>, <em>advent</em>)
	  och vars innebörd inte är lätt att förstå, dels som
	  kompletterande information till ord som också ges en vanlig
	  ordförklaring (t.ex. <em>barnbidrag</em>, <em>adoption</em>).
	</p>`;
}

function openHelpPoS(inner, pos) {
    inner.innerHTML = `<h3>Ordklass</h3>
	<p>
          Ord tillhör en ordklass, t.ex. substantiv eller verb.
          Ordklasser som förekommer i Lexin är: substantiv, adjektiv,
          verb, adverb, preposition, pronomen, konjunktion, interjektion, räkneord,
          namn, artikel, infinitivmärke och förkortning.
          Det finns också två
          klasser <em>förled</em> och <em>efterled</em> som inte är
          riktiga ordklasser men som används när uppslagsordet är förled
          eller efterled i sammansatta ord.

	</p>`;
}

function openHelpPhon(inner, phon) {
    let html = `
	<h3>Uttal</h3>
	<p> Uttal visas med både <em>fonetisk skrift</em>,
	  t.ex. <strong>` + phon + `</strong>, och med en ljudfil du kan
	  lyssna på.</p>
        <h4>` + phon + `
        </h4>
	<ul>`;

    if(phon.indexOf('ʃ') >= 0) {
	html += '<li>"ʃ" betyder <em>sje</em>-ljud, som i "sjunga" eller "7".</li>';
    }
    if(phon.indexOf(':') >= 0) {
	html += '<li>":" betyder att ljudet före ":" är långt, en lång vokal eller lång konsonant.</li>';
    }
    if(phon.indexOf('̣') >= 0) {
	html += '<li>" ̣" betyder att betoning ("tryck") ska vara på stavelsen där " ̣" finns.</li>';
    }
    if(phon.indexOf('ç') >= 0) {
	html += '<li>"ç" betyder <em>tje</em>-ljud, som i "kikare", "kjol", eller "20".</li>';
    }
    if(phon.search('[aeiouyåäöAEIOUYÅÄÖ]‿[aeiouyåäöAEIOUYÅÄÖ]') >= 0) {
	html += '<li>"‿" mellan två vokaler betyder <em>diftong</em>, att de två vokalerna flyter ihop som t.ex. i "automat".</li>';
    }
    if(phon.search('[^aeiouyåäöAEIOUYÅÄÖ]‿[^aeiouyåäöAEIOUYÅÄÖ]') >= 0) {
	html += '<li>"‿" mellan två konsonanter betyder att de två bokstäverna före och efter "‿" smålter ihop till ett ljud. När "r" följs av d, t, n, l eller s, smälter ljuden ofta ihop till ett enda ljud.</li>';
    }
    if(phon.indexOf('²') >= 0) {
	html += '<li>"²" betyder <em>grav accent</em> (som också kallas "accent 2"). När det inte finns någon tvåa utan bara tryckmarkering, " ̣" (eller ingen tryckmarkering alls), betyder det att ordet har akut accent</li>';
    }
    if(phon.indexOf('ŋ') >= 0) {
	html += '<li>"ŋ" betyder <em>ng</em>-ljud, som i "lång", "dygn", eller "bank".</li>';
    }
    
    html += `</ul>
       `;

    inner.innerHTML = html;
}


function openHelpVideo(inner) {
    inner.innerHTML = `
       <h3>Video</h3>
       <p>Klicka på "Visa film" för att se ett videoklipp som visar vad ordet betyder.</p>
       <p>Klicka på ikonen <img src="/video.svg" class="vidIcon"/> för att ladda videon och visa den i Lexin.</p>
       `;
}
