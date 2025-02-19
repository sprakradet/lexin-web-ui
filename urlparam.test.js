/*
 * Tests lexin client
 *
 * Required node.js packages:  jsdom, fake-indexeddb
 *
 * Can be run in two ways:
 *  1) node test.js --without-framework
 *  2) With the jest test framework
 */

const { saveHTML, setupDOM } = require("./testlib")

async function testURLparameter() {
    let {lexin} = await setupDOM({url: "https://lexin.se/?languages=fin%2Cper&word=balett"}, "index.html");
    
    lexin.settings.add_swedish_results.val = 1;

    console.log("awaiting init");
    await lexin.initDone.promise;
    console.log("init done");
    
    saveHTML("./test/urlparameter.html")
}


if (process.argv.includes("--without-framework")) {
    generateFiles()
} else {
    test("urlparam", async () => {
        await testURLparameter()
    });

}
