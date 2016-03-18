// ==UserScript==
// @name         Moqups Full Preview
// @namespace    dkdscripts
// @version      1.0
// @description  Press Ctrl+F11 to hide all menus and go FULL PREVIEW
// @author       dkd
// @downloadURL  https://github.com/mold/userscripts/raw/master/moqups-full-preview.user.js
// @match        https://app.moqups.com/*
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

	window.addEventListener("keydown", function(evt) {
		if (debounce) {
			return;
		}

		if (evt.keyCode === 122 && evt.ctrlKey) {
			if (barsHidden) {
				mainStage.css(mainStage.origCSS);
				stageWrapper.css(stageWrapper.origCSS);
			} else {
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
				})
			}

			barsHidden = !barsHidden;
			debounce = true;
		}


		window.setTimeout(function() {
			debounce = false;
		}, transitionDuration)
	});

})();
