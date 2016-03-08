// ==UserScript==
// @name         Summit
// @namespace    dkdscripts
// @version      0.1
// @description  Summit booking for pros
// @author       johntu
// @downloadURL  https://github.com/mold/userscripts/raw/master/summit.user.js
// @match        http://217.70.37.13/brp/mesh/myPage.action
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var style = "\
.ccentercontent {\
    background: #fcfcfc;\
    padding: 0 20px;\
}\
\
.cards {\
    font-family: 'Roboto';\
    font-size: 12pt;\
    padding: 15px 0 0 0;\
    border-bottom: 1px solid #ccc;\
    color: #333;\
}\
\
.cards h1 {\
    font-size: 18pt;\
}\
\
.card {\
    background: white;\
    box-shadow: 0 1px 2px 0px rgba(0,0,0,0.2), 0 1px 6px 1px rgba(0,0,0,0.1);\
    max-width: 600px;\
    margin: 0 0 25px 0;\
    display: flex;\
    border-radius: 2px;\
}\
\
.card .card-left .room {\
    font-size: 18pt;\
    margin-bottom: 5px;\
}\
\
.card .card-left .time {\
    margin-top: 20px;\
    font-size: 1em;\
    font-weight: bold;\
}\
\
.card .card-left {\
    flex: 1;\
    padding: 20px 20px;\
}\
\
.card .card-right {\
    max-width: 130px;\
    flex: 1;\
    padding: 20px 15px;\
    background: #B8D1E7;\
    border-top-right-radius: 2px;\
    color: #333;\
    border-bottom-right-radius: 2px;\
}\
\
.card .card-right .time {\
    font-size: 0.8em;\
    font-weight: bold;\
}\
\
.card .card-right .label {\
    margin: 0;\
    font-size: 0.9em;\
    font-weight: bold;\
}\
\
.card .card-right p {\
    margin: 0 0 5px 0;\
}\
";


var months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

// check if user logged in and at home page
var welcomeEl = $(".centercontenttext p font");
if (welcomeEl && welcomeEl.html().search("Välkommen") != -1) {
    // add cards
    var cards = $("<div>", {
        class: "cards"
    });
    $(".ccentercontent").prepend(cards);
    cards.append($("<h1>").html("Dina bokningar"));

    // fetch your bookings
    $.get("http://217.70.37.13/brp/mesh/showBookings.action", function(data) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, "text/html");
        var docEl = $(doc);
        window.doc = docEl;
        var table = docEl.find(".bookingsList.serviceBookings");
        var now = new Date();

        var cardObjects = [];

        // parse the table
        table.find("tr").each(function(i, e) {
            var td = $(e).find("td");

            if (td.length > 0) {
                var dateEl = $("<p>", {
                    class: "time"
                });
                var split = td[0].innerHTML.split(" ");
                var date = (months.indexOf(split[2]) + 1) + " " + split[1] + " " + now.getFullYear();
                var times = split[3].split("&nbsp;");
                var obj = {
                    start: new Date(Date.parse(times[0] + " " + date) - 1000 * 60 * 60),
                    end: new Date(Date.parse(times[2] + " " + date) - 1000 * 60 * 60),
                    el: dateEl
                };
                cardObjects.push(obj);

                var day = 1000 * 60 * 60 * 24;
                var today = Math.floor(obj.start / day) - Math.floor(now / day) == 0;

                // add a new card
                cards.append($("<div>", {
                        class: "card"
                    })
                    .append($("<div>", {
                            class: "card-left"
                        })
                        .append($("<div>", {
                            class: "room"
                        }).html(td[2].innerHTML))
                        .append($("<div>", {
                            class: "place"
                        }).html(td[3].innerHTML))
                        .append($("<div>", {
                            class: "time"
                        }).html(today ? "Idag " + split[3] : td[0].innerHTML))
                    )
                    .append($("<div>", {
                            class: "card-right"
                        })
                        .append($("<p>").html(td[4].innerHTML)
                            .prepend($("<span>", {
                                class: "label"
                            }).html("Pris:"))
                        )
                        .append($("<p>").html(td.length > 5 ? td[5].innerHTML : ""))
                        .append(dateEl)
                    )
                );
            }
        });

        // add style elements
        $("head").append($("<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>"));
        $("head").append($("<style>").html(style));

        updateTimes();
        setInterval(updateTimes, 1000);

        /**
         * Update the timers for the meeting cards.
         */
        function updateTimes() {
            var date = new Date();
            var day = 1000 * 60 * 60 * 24;
            $.each(cardObjects, function(i, e) {
                var time = date.getTime() - e.start.getTime();
                if (time < 0) {
                    var days = -time / day;
                    if (days < 1) {
                        e.el.html("Börjar om " + (new Date(-time)).toTimeString().split(" ")[0]);
                    } else {
                        e.el.html("Börjar om " + Math.floor(days) + " dag" + (days < 2 ? "" : "ar"));
                    }
                } else {
                    var time = date.getTime() - e.end.getTime();
                    if (time < 0) {
                        e.el.html("Slutar om " + (new Date(-time)).toTimeString().split(" ")[0]);
                    } else {
                        e.el.html("Avslutad");
                    }
                }
            });
        }
    });
}