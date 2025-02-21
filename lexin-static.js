function initialize() {
    let settingsButton = document.querySelector("form#theForm button");
    let selectWrapper = document.createElement('div');
    selectWrapper.className = "select-wrapper";
    selectWrapper.innerHTML = `
	<select id="languageChoice" name="languageChoice" title="Språkval">
	  <option value="alb">albanska</option>
	  <option value="amh">amhariska</option>
	  <option value="ara">arabiska</option>
	  <option value="azj">azerbajdzjanska</option>
	  <option value="bos">bosniska</option>
	  <option value="fin">finska</option>
	  <option value="gre">grekiska</option>
	  <option value="hrv">kroatiska</option>
	  <option value="kmr">kurdiska (kurmanji)</option>
	  <option value="pus">pashto</option>
	  <option value="per">persiska</option>
	  <option value="rus">ryska</option>
	  <option value="srp">serbiska (latinskt)</option>
	  <option value="srp_cyrillic">serbiska (kyrilliskt)</option>
	  <option value="som">somaliska</option>
	  <option value="spa">spanska</option>
	  <option value="swe" selected>svenska</option>
	  <option value="sdh">kurdiska (sorani)</option>
	  <option value="tir">tigrinska</option>
	  <option value="tur">turkiska</option>
	  <option value="ukr">ukrainska</option>
	</select>`;
    settingsButton.parentNode.insertBefore(selectWrapper, settingsButton);
    let select = selectWrapper.querySelector("#languageChoice");
    select.addEventListener("change", (event) => {
	let searchQuery = document.querySelector("#searchQuery").value;
	let word = document.querySelector("input[name=word]");
	window.location = window.location.protocol + '//' + window.location.host + "/"
	    + "?languages=" + encodeURIComponent(select.value)
	    + "&word=" + encodeURIComponent(word.value);
    });
}

if (document.readyState !== 'loading') {
    initialize();
} else {
    document.addEventListener('DOMContentLoaded', initialize);
}
