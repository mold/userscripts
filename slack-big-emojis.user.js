// ==UserScript==
// @name         Big custom emojis for Slack
// @namespace    dkdscripts
// @version      1.0
// @description  Makes custom emojis (and :smile:) larger
// @author       dkd
// @downloadURL  https://github.com/mold/userscripts/raw/master/slack-big-emojis.user.js
// @match        https://*.slack.com/*
// @grant        none
// ==/UserScript==

$('<style>').html('.message_body .emoji.emoji-sizer{font-size:50px;margin:4px;}').appendTo("body");
