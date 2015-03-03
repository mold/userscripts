// ==UserScript==
// @name         AvclubSideshareBegone
// @namespace    dkdscripts
// @version      1.0
// @description  Removes the annoying side share buttons
// @author       dkd
// @match        http://www.avclub.com/*
// @grant        none
// ==/UserScript==

var w;
if((w = document.getElementsByClassName("sideshare-wrapper sticky-active")[0]))
    w.remove();