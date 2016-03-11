// ==UserScript==
// @name         Summit
// @namespace    dkdscripts
// @version      0.2
// @description  Summit booking for pros
// @author       johntu
// @downloadURL  https://github.com/mold/userscripts/raw/master/summit.user.js
// @match        http://217.70.37.13/brp/mesh/myPage.action*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var style = "\
.wrapper {\
    min-width: 855px;\
}\
\
.ccentercontent {\
    background: #f3f3f3;\
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
.cards h2 {\
    font-size: 18px;\
    color: #666;\
}\
\
.cards h1.inline-heading {\
    display: inline-block;\
    margin-right: 20px;\
}\
\
.cards .date-field {\
    font-family: 'Roboto';\
    font-size: 20px;\
    font-weight: bold;\
    color: #333;\
    background: none;\
    border: none;\
    outline: none;\
    border-bottom: 1px solid #333;\
    width: 110px;\
}\
\
.cards .date-icon {\
    display: inline-block;\
    margin-left: 15px;\
    vertical-align: middle;\
    margin-bottom: 7px;\
    cursor: pointer;\
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
.card .card-left .image {\
    background-size: cover;\
    opacity: 1;\
    height: 140px;\
    margin: -20px -20px 10px -20px;\
    border-top-left-radius: 3px;\
    border-top-right-radius: 3px;\
}\
\
.card .card-left .room {\
    font-size: 18pt;\
    margin-bottom: 5px;\
}\
\
.card .card-left .place {\
    margin-bottom: 20px;\
}\
\
.card .card-left .time {\
    margin: 4px 0;\
    font-size: 1em;\
    font-weight: bold;\
}\
\
.card .card-left .time .hours {\
    margin-left: 45px;\
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
\
.card .times-table {\
    width: 100%;\
    border-collapse: collapse;\
}\
\
.card .times-table tr:nth-child(odd) {\
    background: #eee;\
}\
\
.card .times-table td {\
    width: 33%;\
    font-size: 14px;\
    font-weight: bold;\
    padding: 2px 5px;\
}\
";


var months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

// check if user is logged in and at home page
var welcomeEl = $(".centercontenttext p font");
if (welcomeEl && welcomeEl.html().search("Välkommen") != -1) {

    //////////////////////////////////////////////////////////////////////////
    /// Find free rooms
    //////////////////////////////////////////////////////////////////////////

    // add cards
    var roomCards = $("<div>", {
        class: "cards"
    });
    var roomCardsContent = $("<div>");
    var datepicker = $("<input>", {
        type: "text",
        class: "date-field"
    });
    roomCards
        .append($("<h1>", {
            class: "inline-heading"
        }).html("Lediga rum"))
        .append(datepicker)
        .append($("<img>", {
            src: "http://www.dicota.com/rma/css/jquery-ui-1.11.4.dicota/images/icon-datepicker.png",
            class: "date-icon"
        }).click(function() {
            datepicker.datepick("show");
        }))
        .append(roomCardsContent);
    $(".ccentercontent").prepend(roomCards);

    // use the already loaded jQuery datepicker
    datepicker
        .datepick({
            onSelect: function(val) {
                fetchBookings(new Date(val));
            }
        })
        // init with GMT+1 (sweden)
        .datepick("setDate", getDateNow());

    var unitNames = {
        6763: "Summit Hitech",
        7898: "Summit Skofabriken"
    };
    var resourceData = {
        218: {
            image: "http://summit.se/wp-content/uploads/2013/05/hitech-terrassen-neil-2.jpg"
        },
        200: {
            image: "http://summit.se/wp-content/uploads/2013/05/skofabriken-goodall-2.jpg"
        }
    };
    var units = Object.keys(unitNames);

    fetchBookings(getDateNow());

    /////////////

    function getDateNow() {
        return new Date(Date.now() + 1000 * 60 * 60);
    }

    function fetchBookings(date) {
        var _units = units.slice();

        var roomsAvailable = 0;

        function bookingCallback(unit, n) {
            roomsAvailable += n;
            _units.splice(_units.indexOf(unit), 1);
            if (_units.length == 0) {
                if (roomsAvailable == 0) {
                    roomCardsContent.append($("<p>", {
                        style: "margin-top:0;"
                    }).html("Inga lediga rum hittades"));
                }
            }
        }

        roomCardsContent.html("");
        for (var i = 0; i < _units.length; i++) {
            fetchBookingCards(_units[i], date, bookingCallback);
        }
    }

    function fetchBookingCards(unit, date, callback) {
        var dateString = date.toISOString().substr(0, 10);

        // fetch your bookings
        $.get("http://217.70.37.13/brp/mesh/showGroupActivitiesSchedule.action?businessUnit=" + unit + "&view=day&date=" + dateString, function(data) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            var docEl = $(doc);
            var table = docEl.find(".schedule");

            // parse the table
            var rows = table.find("tr");
            var rooms = [];
            var times = {};
            $(rows[1]).children().each(function(i, e) {
                if (i > 0) {
                    rooms.push(e.innerHTML);
                    times[e.innerHTML] = [];
                }
            });

            // keep track of which table cell is for which room
            var roomIndex = [];
            // keep track of the booked cells
            var roomBooked = [];
            // keep track of the free times
            // {
            //   start: Date,
            //   end: Date,
            //   resource: Number
            // }
            var roomTimes = [];
            for (var i = 0; i < rooms.length; i++) {
                roomIndex.push(i);
                roomBooked.push(0);
                roomTimes.push(null);
            }
            // skip two first and last row
            for (var i = 2; i < rows.length - 1; i++) {
                // schedule is from 8:00 to 18:00 (GMT+1)
                var date = new Date((7 + 0.5 * (i - 2)) * 1000 * 60 * 60);
                var tds = $(rows[i]).find("td");
                var _roomIndex = roomIndex.slice(); // this is updated to the next iteration

                tds.each(function(j, e) {
                    if (j > 0) {
                        e = $(e);

                        var prevFree = roomBooked[roomIndex[j - 1]] == 0;
                        // bookingCell will remove table cells for 'rowspan' rows
                        if (e.hasClass("bookingCell")) {
                            roomBooked[roomIndex[j - 1]] = parseInt(e.attr("rowspan"));
                            _roomIndex.splice(_roomIndex.indexOf(roomIndex[j - 1]), 1);
                        }

                        var time = roomTimes[roomIndex[j - 1]];
                        // links are free times
                        var a = e.find("a");
                        if (a.length) {
                            if (!time) {
                                var room = times[rooms[roomIndex[j - 1]]];
                                time = {};
                                roomTimes[roomIndex[j - 1]] = time;
                                room.push(time);
                                time.start = date;
                                time.resource = a.attr("href").match(/resource0=([0-9]+)/)[1];
                            }
                            // bookingCell or scheduleCell are non-free times
                        } else if (prevFree && (e.hasClass("bookingCell") || e.hasClass("scheduleCell"))) {
                            if (time && !time.end) {
                                time.end = date;
                                roomTimes[roomIndex[j - 1]] = null;
                            }
                        }
                    }
                });
                // update bookingCell table cells
                $.each(roomBooked, function(j, e) {
                    if (e > 0) {
                        roomBooked[j] = e - 1;
                        if (roomBooked[j] == 0) {
                            _roomIndex.push(j);
                        }
                    }
                });
                roomIndex = _roomIndex.sort();
            }

            // create cards from the found times
            var roomsAvailable = 0;
            var cardsContainer = $("<div>");
            $.each(times, function(name, room) {
                roomsAvailable += room.length;
                if (room.length > 0) {
                    // add a new card
                    var tableContent = $("<table>", {
                        class: "times-table"
                    });

                    var data = resourceData[room[0].resource] || {};
                    var card = $("<div>", {
                            class: "card"
                        })
                        .append($("<div>", {
                                class: "card-left"
                            })
                            .append(data.image ? $("<div>", {
                                class: "image",
                                style: "background-image:url(" + data.image + ");"
                            }) : $("<div>"))
                            .append($("<div>", {
                                class: "room"
                            }).html(name))
                            .append(tableContent)
                        );

                    // 18:00 (GMT+1)
                    var last = new Date(17 * 1000 * 60 * 60);
                    $.each(room, function(i, time) {
                        if (!time.end)
                            time.end = last;
                        var hours = (time.end - time.start) / (1000 * 60 * 60);
                        var start = time.start.toTimeString().substr(0, 5);
                        var end = time.end.toTimeString().substr(0, 5);

                        // create dropdown for the possible bookings.
                        // the event handling is so that the dropdown can be opened and closed
                        // without clicking the booking options.
                        var dropdownOpen = false;
                        var dropdown = $("<select>")
                            .click(function() {
                                if (dropdownOpen) {
                                    var data = JSON.parse($(this).val());
                                    // this request sets the current unit in some cookie
                                    $.get("http://217.70.37.13/brp/mesh/showGroupActivitiesSchedule.action?businessUnit=" + data.unit + "&view=day&date=" + data.date, function() {
                                        window.location = "http://217.70.37.13/brp/mesh/findServices.action?resource0=" + data.resource + "&date=" + data.ate + "&time=" + data.time;
                                    });
                                }
                                dropdownOpen = !dropdownOpen;
                            })
                            .blur(function() {
                                dropdownOpen = false;
                            })
                            .keyup(function(evt) {
                                if (evt.keyCode == 27)
                                    dropdownOpen = false;
                            });
                        $(window).scroll(function() {
                            if (dropdownOpen)
                                dropdownOpen = false;
                        });
                        for (var i = 0; i < hours * 2; i++) {
                            var date = new Date(time.start.getTime() + 1000 * 60 * 30 * i).toTimeString().substr(0, 5);
                            dropdown.append($("<option>", {
                                value: JSON.stringify({
                                    resource: time.resource,
                                    date: dateString,
                                    time: date,
                                    unit: unit
                                }),
                                text: "Boka från " + date
                            }));
                        }

                        tableContent.append($("<tr>")
                            .append($("<td>").html(start + " - " + end))
                            .append($("<td>").html(hours + " timm" + (hours == 1 ? "e" : "ar")))
                            .append($("<td>")
                                .append(dropdown)
                            )
                        );
                    });

                    cardsContainer.append(card);
                }
            });

            if (roomsAvailable > 0) {
                roomCardsContent.append($("<h2>").html(unitNames[unit]));
                roomCardsContent.append(cardsContainer);
            }

            if (callback) {
                callback(unit, roomsAvailable);
            }
        });
    }

    //////////////////////////////////////////////////////////////////////////
    /// Current bookings
    //////////////////////////////////////////////////////////////////////////

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
        var rows = table.find("tr");
        rows.each(function(i, e) {
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
        if (rows.length == 0) {
            cards.append($("<p>").html("Inga bokade rum"));
        }

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
