/*
 * Tests lexin client
 *
 * Required node.js packages:  jsdom, fake-indexeddb
 *
 * Can be run in two ways:
 *  1) node test.js --without-framework
 *  2) With the jest test framework
 */

const { saveHTML, setupDOM, saveJSON } = require("./testlib")

async function doTest(lexin, lang, term, filename) {
    lexin.setSelectedLexicon(lang);

    $("#searchQuery").val(term);
    let data = await lexin.callLexin(true);
    await saveHTML(filename);
    await saveJSON(filename, data);
}

async function doTestWithClick(lexin, lang, term, filename, clickTarget) {
    lexin.setSelectedLexicon(lang);

    $("#searchQuery").val(term);
    let data = await lexin.callLexin(true);
    $(clickTarget).click();
    await saveHTML(filename);
    await saveJSON(filename, data);
}

async function generateFiles() {
    let options = {url: "https://lexin.se/"};
    let {lexin} = await setupDOM(options, "index.html");
    lexin.settings.add_swedish_results.val = 1;
    console.log("waiting for bildtema init");
    await lexin.bildtemaDone.promise;
    console.log("bildtema inited");
    await doTest(lexin, ["fin"], "anhåller", "./test/fin-anhaller.html")
    await doTest(lexin, ["fin"], "ger", "./test/fin-ger.html")
    await doTest(lexin, ["fin"], "a", "./test/fin-a.html")
    await doTest(lexin, ["fin"], "balett", "./test/fin-balett.html")

    await doTest(lexin, ["ara"], "anhåller", "./test/ara-anhaller.html")
    await doTest(lexin, ["ara"], "ger", "./test/ara-ger.html")
    await doTest(lexin, ["ara"], "a", "./test/ara-a.html")
    await doTest(lexin, ["ara"], "balett", "./test/ara-balett.html")

    await doTest(lexin, ["ara", "fin"], "ger", "./test/ara-fin-ger.html")
    
    await doTest(lexin, ["per"], "puckel", "./test/per-puckel.html")
    await doTest(lexin, ["per"], "kejda", "./test/per-kedja.html")
    await doTest(lexin, ["per"], "kompetens", "./test/per-kompetens.html")
    await doTest(lexin, ["per"], "knut", "./test/per-knut.html")
    await doTest(lexin, ["fin", "per"], "balett", "./test/fin-per-balett.html")

    await doTest(lexin, ["fin", "per"], "anhöll", "./test/fin-per-anholl.html")
    await doTest(lexin, ["fin", "per"], "akne", "./test/fin-per-akne.html")
    await doTest(lexin, ["fin", "per"], "acne", "./test/fin-per-acne.html")
    await doTest(lexin, ["fin", "per"], "a", "./test/fin-per-a.html")
    await doTest(lexin, ["fin", "per"], "abdikerar", "./test/fin-per-abdikerar.html")
    await doTest(lexin, ["fin", "per"], "avbryte", "./test/fin-per-avbryte.html")
    await doTest(lexin, ["fin", "per"], "avbry", "./test/fin-per-avbry.html")
    await doTest(lexin, ["fin", "per"], "avbr", "./test/fin-per-avbr.html")

    await doTest(lexin, ["ara", "per", "amh", "pus"], "aktie", "./test/ara-per-amh-pus-aktie.html")
    await doTest(lexin, ["ara", "per", "amh", "pus"], "aktion", "./test/ara-per-amh-pus-aktion.html")
    await doTest(lexin, ["ara", "per", "amh", "pus"], "ger", "./test/ara-per-amh-pus-ger.html")

    await doTest(lexin, ["swe"], "agnar", "./test/swe-agnar.html")
    await doTest(lexin, ["fin"], "affär", "./test/fin-affar.html")
    await doTest(lexin, ["fin"], "abstrakt", "./test/fin-abstrakt.html")
    await doTest(lexin, ["fin"], "kylmä", "./test/fin-kylma.html")
    await doTest(lexin, ["fin"], "ackord", "./test/fin-ackord.html")
    await doTest(lexin, ["fin"], "tjatar", "./test/fin-tjatar.html")
    await doTest(lexin, ["fin"], "varnar", "./test/fin-varnar.html")
    await doTest(lexin, ["fin"], "alfabetisk", "./test/fin-alfabetisk.html")
    await doTest(lexin, ["fin"], "AB", "./test/fin-AB.html")
    await doTest(lexin, ["fin"], "kr.", "./test/fin-kr.html")
    await doTest(lexin, ["fin"], "msk", "./test/fin-msk.html")
    await doTest(lexin, ["fin"], "bevekar", "./test/fin-bevekar.html")
    await doTest(lexin, ["fin"], "akut", "./test/fin-akut.html")
    await doTest(lexin, ["fin"], "badar", "./test/fin-badar.html")
    await doTest(lexin, ["fin"], "länk", "./test/fin-lank.html")
    await doTest(lexin, ["fin", "gre"], "länk", "./test/fin-gre-lank.html")
    await doTest(lexin, ["fin"], "adverb", "./test/fin-adverb.html")
    await doTest(lexin, ["fin"], "lera", "./test/fin-lera.html")
    await doTest(lexin, ["fin", "gre"], "lera", "./test/fin-gre-lera.html")
    await doTest(lexin, ["fin", "gre"], "snår", "./test/fin-gre-snår.html")
    await doTest(lexin, ["fin", "gre"], "konkret", "./test/fin-gre-konkret.html")
    await doTest(lexin, ["fin"], "ack", "./test/fin-ack.html")
    await doTest(lexin, ["fin"], "adoption", "./test/fin-adoption.html")
    await doTest(lexin, ["ara"], "adoption", "./test/ara-adoption.html")
    await doTest(lexin, ["ara"], "övertramp", "./test/ara-övertramp.html")
    await doTest(lexin, ["ara"], "stilenlig", "./test/ara-stilenlig.html")
    await doTest(lexin, ["ara"], "övning", "./test/ara-övning.html")
    await doTest(lexin, ["ara"], "över", "./test/ara-över.html")
    await doTest(lexin, ["fin"], "sluttar", "./test/fin-sluttar.html")
    await doTest(lexin, ["fin"], "album", "./test/fin-album.html")
    await doTest(lexin, ["swe"], "stelnar", "./test/swe-stelnar.html")
    await doTest(lexin, ["swe"], "tillagning", "./test/swe-tillagning.html")
    await doTest(lexin, ["swe"], "ven", "./test/swe-ven.html")
    await doTest(lexin, ["fin"], "anbelangar", "./test/fin-anbelangar.html")
    await doTest(lexin, ["fin"], "ängslig", "./test/fin-angslig.html")
    await doTest(lexin, ["fin"], "säljer", "./test/fin-saljer.html")
    await doTest(lexin, ["fin"], "reagerar", "./test/fin-reagerar.html")
    await doTest(lexin, ["fin"], "bar", "./test/fin-bar.html")
    await doTest(lexin, ["fin"], "de", "./test/fin-de.html")
    await doTest(lexin, ["fin"], "dragit", "./test/fin-dragit.html")
    await doTest(lexin, ["fin"], "fader", "./test/fin-fader.html")
    await doTest(lexin, ["fin"], "allt", "./test/fin-allt.html")
    await doTest(lexin, ["fin"], "bad", "./test/fin-bad.html")
    await doTest(lexin, ["fin"], "män", "./test/fin-män.html")
    await doTestWithClick(lexin, ["fin"], "gurka", "./test/fin-gurka.html", ".imageLink")

    for (let word of ["personnummer", "idag", "Halland", "i", "sekund", "stilenligt", "pipa", "katt",
                      "förstasortering", "tesked", "accentuerar", "viker", "tricksar", "upp",
                      "ursinnig", "samsas", "helst", "akt"
                     ]) {
        await doTest(lexin, ["swe"], word, `./test/swe-${word}.html`)
    }
    for (let word of ["i", "katt", "abnorm", "ålderspension", "viker", "kall", "barn", "aikakausi", "akt", "mäter", "tävlar", "övningskörning", "balans", "regel", "AD", "krona"]) {
        await doTest(lexin, ["fin"], word, `./test/fin-${word}.html`)
    }
    
    lexin.settings.add_swedish_results.val = 0;
    await doTest(lexin, ["fin"], "balett", "./test/fin-balett-wo-swe.html")
    await doTest(lexin, ["per"], "puckel", "./test/per-puckel-wo-swe.html")
}

if (process.argv.includes("--without-framework")) {
    generateFiles()
} else {
    test("generate files", async () => {
        await generateFiles()
    });
}
