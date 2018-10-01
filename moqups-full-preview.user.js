// ==UserScript==
// @name         Moqups Full Preview
// @namespace    dkdscripts
// @version      1.2.0
// @description  Press Ctrl+F11 (or Shift+Alt+F) to hide all menus and go FULL PREVIEW
// @author       dkd
// @downloadURL  https://github.com/mold/userscripts/raw/master/moqups-full-preview.user.js
// @match        https://app.moqups.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

(function() {
	var barsHidden = false;
	var mainStage, stageWrapper;
	var transitionDuration = 100;
	var debounce = false;

	function getElements() {
		mainStage = $("#main-stage");
		mainStage.origCSS = {
			left: mainStage.css("left"),
			right: mainStage.css("right"),
			top: mainStage.css("top"),
			bottom: mainStage.css("bottom"),
			"z-index": mainStage.css("z-index"),
		};

		stageWrapper = $("#stage-wrapper");
		stageWrapper.origCSS = {
			top: stageWrapper.css("top"),
			"z-index": stageWrapper.css("z-index"),
		};
	}

	function toggleFullscreen(full) {
		if (debounce) {
			return;
		}

		if (undefined === full) {
			full = !barsHidden;
		}

		if (full) {
			getElements();

			mainStage.css({
				left: "0",
				right: 0,
				"z-index": "1000",
				top: 0,
				bottom: 0,
				transition: transitionDuration + "ms all",

			});

			stageWrapper.css({
				"z-index": "1000",
				transition: transitionDuration + "ms all",
				top: 0,
			});

            $(":focus").blur();
		} else {
			mainStage.css(mainStage.origCSS);
			stageWrapper.css(stageWrapper.origCSS);
		}

		barsHidden = !barsHidden;
		debounce = true;

		window.setTimeout(function() {
			debounce = false;
		}, transitionDuration);
	}

	window.addEventListener("keydown", function(evt) {
		// Ctrl+F11 or Alt+Shift+F
		if ((evt.keyCode === 122 && evt.ctrlKey) ||
            (evt.keyCode === 70 && evt.altKey && evt.shiftKey)) {
            evt.preventDefault();
			toggleFullscreen();
		}
		// Ctrl+F
		else if (evt.keyCode === 70 && evt.ctrlKey) {
			toggleFullscreen(false);
		}
	});

	window.addEventListener("mousedown", function(evt) {
		if(evt.button === 2){
			// right click opens context menu
			toggleFullscreen(false);
		}
	});

})();
