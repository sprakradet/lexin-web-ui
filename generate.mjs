/*
 * Generates static files for all lemmas
 *
 * Required node.js packages:  jsdom, fake-indexeddb
 *
 * Run like this:
 * node generate.js
 */

import {saveFullHTML, setupDOM, loadJSON} from "./testlib.js"

async function doGenerate(lexin, lang, term, filename) {
    lexin.setSelectedLexicon(lang);
    $("#searchQuery").val(term);
    let data = await lexin.callLexin(true);
    $("title").text("Lexin \u2013 " + term);
    $("meta[name=description]").text(term);
    let parameterWord = $("<input type='hidden' name='word'>");
    parameterWord.val(term);
    $("#settingsFormValues").empty().append(parameterWord);
    let parameterSettings = $("<input type='hidden' name='settings' value='show'>");
    $("#settingsFormValues").append(parameterSettings);
    $(".imageLink").click();
    $('.notRelevant').show();
    await saveFullHTML(filename);
}

async function generateFiles() {
    let options = {url: "https://lexin.se/"};
    let {lexin,dom} = await setupDOM(options, "index-static.html");
    console.log("waiting for bildtema init");
    await lexin.bildtemaDone.promise;
    console.log("bildtema inited");
    $("#searchQuery").off("blur");
    lexin.settings.add_swedish_results.val = 0;
    lexin.lexinService.getJson = async function(direction, lang, word) {
	return await loadJSON("./" + lang + "/" + word);
    };
    let getAutocompleteArray = global.getAutocompleteArray;
    let lemmalist = getAutocompleteArray("swe").filter(word => !word.includes("/"));
    for (let word of lemmalist) {
        await doGenerate(lexin, ["swe"], word, `./swe/${word}`)
    }
}
console.log("start");
await generateFiles()
console.log("exit");
