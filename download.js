// --------------------------------------------------------------------
// Handle the "Download" functionality.
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// openDownload(elem)
// --------------------------------------------------------------------
// Called when user clicks on the button to open the Download
// window.
// --------------------------------------------------------------------

let downloadableDictionaries;
let downloadableDictionariesDict;

async function openDownload() {
    var h = document.getElementById("downloadPopup");
    h.style.display = "block";

	// CG REMOVE 2025-09-25 - download works
    /*let testVersionDiv = document.createElement('div');
    testVersionDiv.className = "testVersionInfo";
    testVersionDiv.textContent = "Nedladdning av lexikon är inte fullt fungerande ännu, men du får gärna prova att ladda ner lexikon och testa.";
    $(".testVersionInfo").remove();
    $(h).prepend(testVersionDiv);*/

    downloadableDictionaries = await $.ajax({url:"lexin-downloadable.json", datatype: "json", type:"GET"});
    downloadableDictionariesDict = _.object(_.map(downloadableDictionaries, e => [e.lang, e]));
    let dbServerValue = await dbServer.promise;

    let metadata = await dbServerValue.metadata.query().all().execute();
    let downloadedLanguages = _.map(metadata, (e) => e.version ? e.lang : null);

    $("#selectDownloadLanguages").empty();
    let e = $("<option></option>");
    e.text("");
    e.val("");
    $("#selectDownloadLanguages").append(e);
    e.prop("selected", true);
    $("#languageChoice option").each(function () {
	let lang = $(this).val();
	let e = $("<option></option>");
	e.text($(this).text());
	e.val(lang);
	$("#selectDownloadLanguages").append(e);

	if (_.contains(downloadedLanguages, $(this).val())) {
	    e.prop("disabled", true);
	} else {
	    e.prop("selected", this.selected);
	}
    });
    $("#selectDownloadLanguages").off("change");
    $("#selectDownloadLanguages").on("change", function () {
	redrawDownload();
    });
    redrawDownload();

	// CG REMOVE
    /*$(".downloadStartButton").click(function (e) {
	startDownload();
    });*/

	// CG ADD - THIS POSSIBLY FIXES THE "DUPLICATE DOWNLOADS" BUG
	$(".downloadStartButton")
	.off("click.lexin")                // namespaced off
	.on("click.lexin", function (e) {
		e.preventDefault();
		startDownload();
	});
}

function startDownload() {
    _.each(downloadLanguages, language => {
	console.log("download", language);
	(async() => {
	    try {
		await doDownload(language.progressWrapper, language.lang);
	    } catch {
		language.progressWrapper.empty().append("Nedladdning misslyckades");
	    }
	})();
    });
}

function setAsDownloaded(wrapper, lang) {
    wrapper.empty().append("Nedladdat <button class='removeDownloadButton' type='button'></button>");
    wrapper.find("button").click(async function () {
	let progress = $("<progress></progress>");
	wrapper.empty().append(progress).val(0);
	await removeLanguage(lang, progress);
	let dbServerValue = await dbServer.promise;
	let metadataEntries = await dbServerValue.metadata.query("lang").only(lang).execute()
	await Promise.all(metadataEntries.map(e => {
	    console.log(Date.now(), "removebutton metadata remove id", e.id);
	    return dbServerValue.metadata.remove(e.id)
	}))
	wrapper.empty()
//	redrawDownload();
    });
}

function activateRedownloadButton(wrapper, lang) {
    wrapper.find("button").click(async function () {
	try {
	    await doDownload(wrapper, lang);
	} catch(e) {
	    console.log(e.stack);
	    console.log(e.name);
	    console.log(e.message);
	    wrapper.empty().append("Nedladdning misslyckades");
	}
    });
}

async function removeLanguage(lang, progress, wantedStatus) {
    console.log(Date.now(), "removeLanguage", lang);
    let dbServerValue = await dbServer.promise;
    let metadataEntries = await dbServerValue.metadata.query("lang").only(lang).execute()
    if (!wantedStatus) {
		wantedStatus = "removing";
    }
    await dbServerValue.metadata.query("lang").only(lang).modify({status:wantedStatus}).execute()

    let ids = await dbServerValue.entries.query("lang").only(lang).execute()
    console.log(Date.now(), "removeLanguage", ids.length);
    let chunks = _.chunk(ids, 100);
    let i = 0;
    for (const chunk of chunks) {
		let removePromises = _.map(chunk, (e, i) => {
			return dbServerValue.entries.remove(e.id)
	})
	await Promise.all(removePromises)
	i++;
	if (progress) {
	    progress.val(i/chunks.length);
	}
    }
    console.log(Date.now(), "removeLanguage removed all entries");
    console.log(Date.now(), "removeLanguage complete");

	// CG ADD
	// 1) Remove metadata row for this lang so UI logic won’t treat it as downloaded
	//await dbServerValue.metadata.remove(lang);

	// 2) Rebuild the whole download section (dropdown + list)
	//await redrawDownload();
}

async function doDownload(wrapper, lang) {
    let metadata = downloadableDictionariesDict[lang];
    let progress = $("<progress></progress>");
    wrapper.empty().append(progress).val(0);
    let dbServerValue = await dbServer.promise;

    await dbServerValue.metadata.add({"lang": lang, "version": metadata.version, "status": "adding"});
    console.log("doDownload", await dbServerValue.metadata.query().all().execute());
    
    let filename = downloadableDictionariesDict[lang].filename;

    console.log(Date.now(), "start fetching file");
    const json_dict = await $.ajax({
	xhr: function() {
	    let xhr = new window.XMLHttpRequest();
	    xhr.onprogress = (e) => {
//		console.log("progress", e);
		progress.val(e.loaded / metadata.size / 2);
	    };
	    return xhr;
	},
	url:filename,
	datatype: "json",
	type:"GET"
    });
    const entries_dict = json_dict.entries;
    await dbServerValue.metadata.query("lang").only(lang).modify({wordbase:json_dict.WordBase}).execute();
    console.log(Date.now(), "fetched file");
    await removeLanguage(lang, wrapper, "adding");
    let keys = Object.keys(entries_dict);
    for (const id of keys) {
	//	    console.log("entry", id);
	entries_dict[id].lang = lang;
	entries_dict[id].index = [];
	for (const type_index of entries_dict[id].indices) {
	    entries_dict[id].index.push(type_index[1])
	}
	delete entries_dict[id].indices;
    }
    console.log(Date.now(), "extended entries");
    let chunks = _.chunk(Object.values(entries_dict), 100);
    let i = 0;
    try {
	for (const chunk of chunks) {
	    await dbServerValue.entries.add(chunk);
	    i++;
	    progress.val(i / chunks.length / 2 + 0.5);
	}
	console.log(Date.now(), "stored entries");
	await dbServerValue.metadata.query("lang").only(lang).modify({status:"active"}).execute();
	console.log("doDownload", await dbServerValue.metadata.query().all().execute());
	setAsDownloaded(wrapper, lang);
//	redrawDownload();
    } catch {
	console.log("add failed for lang", lang, "chunk", i);
//	redrawDownload();
    }
}

let downloadLanguages;

// "draws" the current view for the download popup
async function redrawDownload() {
    let dbServerValue = await dbServer.promise;

    $("#downloadProgress").empty();

    let metadata = await dbServerValue.metadata.query().all().execute();
    console.log("redrawDownload downloadedLanguages", metadata);
    let downloadedLanguages = _.object(_.map(metadata, (e) => e.version ? [e.lang, e] : null));
    downloadLanguages = []
    
    $("#selectDownloadLanguages option").each(function () {
	let lang = $(this).val();
	if (lang == "") {
	    return;
	}
	if (this.selected || downloadedLanguages[lang]) {
	    let progress = $("<div class='progressWrapper'>Inte nedladdat</div>");
	    progress.attr("data-lang", lang);
	    let langLabel = $("<div class='downloadProgressLang'></div>");
	    langLabel.text($(this).text());
	    $("#downloadProgress").append(langLabel);
	    $("#downloadProgress").append(progress);
	    if (downloadedLanguages[lang]) {
		console.log("stored", downloadedLanguages[lang]);
		console.log("server", downloadableDictionariesDict[lang]);
		if (downloadedLanguages[lang].status != "active") {
		    progress.empty().append("<div class='downloadControls'>Misslyckades <button type='button' class='downloadFailedButton'>Ladda ner ny</button></div>");
		    activateRedownloadButton(progress, lang);
		} else if (downloadedLanguages[lang].version == downloadableDictionariesDict[lang].version) {
		    setAsDownloaded(progress, lang);
		} else {
		    progress.empty().append("Nedladdat <button type='button'>Ladda ner ny</button>");
		    activateRedownloadButton(progress, lang);
		}
	    } else {
		downloadLanguages.push({lang:lang, progressWrapper:progress});
	    }
	}
    });
}

function closeDownload() {
    var h = document.getElementById("downloadPopup");
    h.style.display = "none";
} 
