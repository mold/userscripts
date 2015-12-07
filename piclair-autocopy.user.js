// ==UserScript==
// @name PiclairAutocopy
// @namespace dkdscripts
// @description copy dat shit and close dat tab
// @include http://piclair.com/*
// @version 2.1
// @downloadURL https://raw.githubusercontent.com/mold/userscripts/master/piclair-autocopy.js
// @grant GM_setClipboard
// @run-at document-end
// @author       dkd
// ==/UserScript==
var src, close=true;
window.addEventListener("keydown", function(e){
    if(e.keyCode === 65){
        close = false;
    }
})
if((src = document.getElementById("resizeimg").src)){
    GM_setClipboard(src,"text");
    setTimeout(function(){
        if(close){
            window.close();
        } else {
            var x = 80; $("#header").fadeOut(x).fadeIn(x).fadeOut(x).fadeIn(x).fadeOut(x).fadeIn(x);
        }
    }, 500);
}
