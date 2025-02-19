let menus = [];

function renderMainmenu() {
    let temaruta = $(".animationstemaruta");
    temaruta.empty();
    temaruta.append("<h1>Lexin verbfilmer</h1>");
    let mainmenu = $("<div></div>");
    let currentrow = null;
    _.each(menus, function(menu, i) {
	let menuitem = $("<div class='menuitem'><div class='nav'></div></div>");
	if (menu.subtitle) {
	    menuitem.find(".nav").text(menu.subtitle);

	} else {
	    menuitem.find(".nav").text(menu.title);
	}
	menuitem.click(function () {
	    renderSubmenu(i);
	});
	mainmenu.append(menuitem);
    });
    temaruta.append(mainmenu);
}

function renderSubmenu(menunumber) {
    let temaruta = $(".animationstemaruta");
    temaruta.empty();
    let menu = menus[menunumber];
    let title = menu.title;
    if (menu.subtitle) {
	title = menu.subtitle;
    }
    let titleelement = $("<h1></h1>");
    titleelement.text(title);
    let homebutton = $("<div style='display: inline-block; cursor: pointer; float: right; text-decoration: underline;'>Tillbaka till temalistan</div>");
    homebutton.click(function () {
	renderMainmenu();
    });
    titleelement.append(homebutton);
    temaruta.append(titleelement);
    let submenu = $("<div class='submenu'><div class='wordlist'></div><div class='submenucontent'</div><div class='videowrapper'></div></div>");
    _.each(menu.items, function (item) {
	let worditem = $("<div class='worditem'></div>");
	worditem.text(item.text);
	worditem.data(item.movie);
	if (item.movie) {
	    worditem.click(function () {
		$(".worditem").removeClass("itemselected");
		worditem.addClass("itemselected");
		submenu.find(".videowrapper").empty();
		let movieplayer = $("<video></video>");
		movieplayer.attr("src", "//lexin.nada.kth.se/lang/lexinanim/" + item.movie + ".mp4");
		movieplayer.attr("autoplay", "autoplay");
		if (item.sound) {
		    let soundplayer = $("<img class='playphrase' src='img/50px-Speaker_Icon.svg.png'>");
		    soundplayer.click(function () {
			var a = new Audio("//lexin.nada.kth.se/lang/lexinanim/" + item.sound + ".mp3");
			a.play();
		    });
		    submenu.find(".videowrapper").append(soundplayer);
		}
		submenu.find(".videowrapper").append(movieplayer);
	    });
	    worditem.css("cursor", "pointer");
	} else {
	    worditem.css("color", "#808080");
	}
	submenu.find(".wordlist").append(worditem);
    });
    temaruta.append(submenu);
    window.scroll(0, 0);
    $(".lexingwt-MainTabPanelBottom").css("overflow", "visible");
    $(".lexingwt-SubTabPanelBottom").css("overflow", "visible");
}

$(function () {
    $.ajax({url:"/lexinanim/animationstema.json", datatype: "json", type:"GET",
            success: function(json, status) {
		menus = json.animationstema;
		console.log("fetched animationstema.json");
		renderMainmenu();
	    }
	   });
});
