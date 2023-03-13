let permbartop = $(".permbar").offset().top;

function permbarAdjust() {
    const permbarOvershoot = -$(".permbar")[0].getBoundingClientRect().top;
    if (permbarOvershoot > 1) {
	$(".inputwrapper").addClass("animate");
	$(".inputwrapper").css("margin-top", permbarOvershoot);
    }
}

const permbarAdjustDebounced = _.debounce(permbarAdjust, 100);

function isKeyboardVisible() {
    return _.any($(".keyboard").map(function () {
	return $(this).css("display") === "block";
    }));
}

function isSettingsVisible() {
    return $(".settingsIcon").hasClass("change");
}

function triggerPermbarAdjust() {
    $(".inputwrapper").removeClass("animate");
    $(".inputwrapper").css("margin-top", 0);
    if (isSettingsVisible() || isKeyboardVisible) {
	return;
    }
    permbarAdjustDebounced();
}

$("#searchQuery").blur(triggerPermbarAdjust);

$(window).on("scroll", function() {
    let settingsVisible = isSettingsVisible();
    let keyboardVisible = isKeyboardVisible();
    let permbarHeight = $(".permbar").outerHeight();

    if ($(window).scrollTop() >= permbartop && !settingsVisible && !keyboardVisible) {
        $(".content").css("padding-top", permbarHeight);
        $(".permbar").addClass("stickToTop");
    } else {
        $(".content").css("padding-top", 0);
        $(".permbar").removeClass("stickToTop");
    }
    triggerPermbarAdjust();
});
if (typeof exports !== 'undefined') {
    exports.permbartop = permbartop
}
