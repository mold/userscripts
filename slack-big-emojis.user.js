// ==UserScript==
// @name         Big custom emojis for Slack
// @namespace    dkdscripts
// @version      1.1
// @description  Makes custom emojis (and :smile:) larger
//               Change log:
//               [2016-02-26 @johntu] Added shake animations.
// @author       dkd
// @downloadURL  https://github.com/mold/userscripts/raw/master/slack-big-emojis.user.js
// @match        https://*.slack.com/*
// @grant        none
// ==/UserScript==

var shake = "\
@keyframes shake {\
  5%, 95% {\
    transform: rotate(-0.3deg);\
  }\
  12%, 88% {\
    transform: rotate(-1deg);\
  }\
  20%, 80% {\
    transform: rotate(1.5deg);\
  }\
  30%, 50%, 70% {\
    transform: rotate(-2.2deg);\
  }\
  40%, 60% {\
    transform: rotate(3deg);\
  }\
}\
";
$('<style>').html(shake + ' .message_body .emoji.emoji-sizer{font-size:50px;margin:4px;border-radius:2px;} .dkd-shake{animation:shake 0.8s;}').appendTo("body");

var parent;
// update every half second
setInterval(function() {
	if (!parent) {
		parent = $('#msgs_scroller_div');
	}
	var height = parent.height();
	var top, visible;
	// find and iterate all emojis
	var emojis = $('.message_body .emoji.emoji-sizer');
	emojis.each(function(i, e) {
		e = $(e);
		top = e.offset().top;
		visible = top > 0 && top < height; // visible if offset is within the message body
		if (e.hasClass('dkd-shake')) {
			if (!visible) {
				e.removeClass('dkd-shake');
			}
		} else {
			if (visible) {
				e.addClass('dkd-shake');
			}
		}
	});
}, 500);