// ==UserScript==
// @name         AvclubSideshareBegone
// @namespace    dkdscripts
// @version      1.1
// @description  Removes the annoying side share buttons
// @author       dkd
// @downloadURL  https://raw.githubusercontent.com/mold/userscripts/master/avclub-sideshare-begone.js
// @match        http://www.avclub.com/*
// @grant        none
// ==/UserScript==

var w;
if((w = document.getElementsByClassName("sideshare-wrapper sticky-active")[0]))
    w.remove();