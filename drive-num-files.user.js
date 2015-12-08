// ==UserScript==
// @name         Drive Number of Files
// @namespace    dkdscripts
// @version      1.0
// @description  Shows how many items are currently displayed in drive (updates 1/s)
// @author       dkd
// @downloadURL  --
// @match        https://drive.google.com/*
// @grant        none
// ==/UserScript==

(function() {
	var displayText = document.getElementsByClassName("a-pa-ob-yd-aa-J a-pa-ob-yd-aa-J-em a-Ra-Bd a-pa-Ra-Zi");
	window.setInterval(function() {
		var number = document.querySelectorAll("[role=main]:not([style='display: none;']) [data-target=layout]:not([style='display: none;']) .k-ta-P-x").length;
		for (var i = 0; i < displayText.length; i++) {
			displayText[i].previousSibling.innerHTML = "Showing " + number + " items"
		};
	}, 1000);
})();
