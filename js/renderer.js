// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var remote = require('electron').remote;
var BrowserWindow = remote.getCurrentWindow(); 
var fs = require('fs');
var os = require('os');

var currentEvents = [];
var eventInFocus = null;

function init() {
	initButtons();
	initLoadEvents();
	initCalendar();
	initModals();
}

function initCalendar() {
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var calendar = document.getElementById("calendarDiv");
	
	for (var i = 0; i < 30; i++) {
		var todaysDate = new Date();
		todaysDate.setDate(todaysDate.getDate() + i);
		var newHTML = "<div id=\"calendarDate\">" + dayNames[todaysDate.getDay()] + " " + todaysDate.getDate() + "<br>" + monthNames[todaysDate.getMonth()] + "</div>";
		
		calendar.innerHTML += newHTML;
	}
}

function initLoadEvents() {
	loadEventsAsJSON((os.homedir() + "/Saved Events/events.json"), function(returnJSON) {
		if (!returnJSON) {
			loadEventsAsXML((os.homedir() + "/Saved Events/events.xml"), function(returnXML) {
				if (!returnXML) {
					fs.mkdir((os.homedir() + "/Saved Events"));
				}
				saveEvents();
			});
		}
	});
}

function initButtons() {
	document.getElementById("min-btn").addEventListener("click", function (e) {
		BrowserWindow.minimize();
	});

	document.getElementById("max-btn").addEventListener("click", function (e) {
		if (BrowserWindow.isMaximized()) {
			BrowserWindow.restore();
		} else {
			BrowserWindow.maximize();
		}
	});

	document.getElementById("close-btn").addEventListener("click", function (e) {
		BrowserWindow.close();
	});
}

/* Adds the events into the main display */
function displayEvents() {
	var eventsDiv = document.getElementById("eventsDiv");
	eventsDiv.innerHTML = "";
	
	for (var i = 0; i < currentEvents.length; i++) {
		var difference = calculateDifference(currentEvents[i].Date[0]._text + " " + currentEvents[i].Time[0]._text);
		var newHTMLLeft = "<br>";
		var style = "";
		
		var currentHTML = eventsDiv.innerHTML;
		var newHTMLDate = "<div id=\"eventDate\">" + currentEvents[i].Date[0]._text + "</div>";
		var newHTMLTime = "<div id=\"eventTime\">" + currentEvents[i].Time[0]._text + "</div>";
		var index = "<input type=\"hidden\" name=\"index\" value=" + i + ">"
		var buttonHTML = "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"deleteEventPressed(this)\" id=\"eventDeleteButton\">Delete</button>"
		var button2HTML = "<button type=\"button\" class=\"btn btn-secondary\" id=\"eventEditButton\" onclick=\"editEventPressed(this)\">Edit</button>"
		var button3HTML = "<button type=\"button\" class=\"btn btn-secondary\" id=\"eventDoneButton\" onclick=\"donePressed(this)\">Done</button>"
		
		if (difference.Days <= 0 && difference.Hours <= 0 && difference.Mins <= 0) {
			newHTMLLeft = "<br>Event Expired"
			style = "style=\"background: green;\""
			button3HTML = "";
		} else if (currentEvents[i].Finished[0]._text) {
			newHTMLLeft = "<br>Event Completed"
			style = "style=\"background: blue;\""
			button3HTML = "<button type=\"button\" class=\"btn btn-secondary\" id=\"eventUndoButton\" onclick=\"undoPressed(this)\">Undo</button>"
		} else {
			if (difference.Days !== 0) {
				newHTMLLeft += difference.Days + " Days ";
			}
			if (difference.Hours !== 0) {
				newHTMLLeft += difference.Hours + " Hours ";
			}
			if (difference.Mins !== 0) {
				newHTMLLeft += difference.Mins + " Mins ";
			}
		}
		
		var newHTMLTitle = "<div " + style + " id=\"event\"><div id=\"eventTitle\">" + currentEvents[i].Title[0]._text + "</div>";
		
		eventsDiv.innerHTML = currentHTML + newHTMLTitle + newHTMLDate + newHTMLTime + newHTMLLeft + index + buttonHTML + button2HTML + button3HTML;
	}
}

/* Handles the delete event button being pressed on an event */
function deleteEventPressed(button) {
	var value = confirm("Are you sure you want to delete this event?");
	if (value == true) {
			var index = button.parentElement.getElementsByTagName("input")[0].value;
			currentEvents.splice(index, 1);
			sortEvents();
	}
}

/* Handles the edit event button being pressed on an event */
function editEventPressed(button) {
	eventInFocus = button.parentElement.getElementsByTagName("input")[0].value;
	var editModal = document.getElementById('editModal');
	editModal.style.display = "block";
	
	var event = currentEvents[eventInFocus];
	updateEditModalTitle(event.Title[0]._text);
	updateEditModalDate(event.Date[0]._text);
	
	var time = convertTo12(event.Time[0]._text);
	updateEditModalHour(parseInt(time.substring(0,2)));
	updateEditModalMinute(time.substring(3, 5));
	updateEditModalAMPM(time.substring(6));
	console.log(time);
	console.log(time.substring(0,2));
	console.log(time.substring(3));
}

function donePressed(button) {
	var index = button.parentElement.getElementsByTagName("input")[0].value;
	currentEvents[index].Finished[0]._text = true;
	sortEvents();
}

function undoPressed(button) {
	var index = button.parentElement.getElementsByTagName("input")[0].value;
	currentEvents[index].Finished[0]._text = false;
	sortEvents();
}

/* Organises the events by date, saves them and then displays them */
function sortEvents() {
	currentEvents.sort(compare);
	saveEvents();
	displayEvents();
}

/* A function used to compare two events by date */
function compare(a, b) {
	var aDate = new Date(a.Date[0]._text + " " + a.Time[0]._text);
	var bDate = new Date(b.Date[0]._text + " " + b.Time[0]._text);
	
	var aBool = a.Finished[0]._text;
	var bBool = b.Finished[0]._text;
	
	if (aBool && !bBool) return -1;
	if (bBool && !aBool) return 1;
  if (aDate.getTime() < bDate.getTime()) return -1;
  if (aDate.getTime() > bDate.getTime()) return 1;
  return 0;
}

/* Saves events into a JSON file */
function saveEvents() {
	fs.writeFileSync((os.homedir() + "/Saved Events/events.json"), JSON.stringify(currentEvents));
}

/* Loads events into the application from a JSON file */
function loadEventsAsJSON(filepath, callback) {
	fs.readFile(filepath, 'utf-8', function (err, data) {
		if (err) {
			callback(false);
		} else {
			currentEvents = JSON.parse(data);
			sortEvents();
			callback(true);
		}
	});
}

/* Loads events into the application from an xml file (used in previous version) */
function loadEventsAsXML(filepath, callback) {
	fs.readFile(filepath, 'utf-8', function (err, data) {
		if(err) {
			callback(false);
		} else {
			currentEvents = xmlToJSON.parseString(data).SavedEvents[0].Event;
			sortEvents();
			callback(true);
		}
	});
}

/* Adds an event to the application */
function addEvent(title, date, time) {
	currentEvents.push({
		"Title": [
			{"_text" : title}
		],
		"Date": [
			 {"_text" : date}
		], 
		"Time": [
			{"_text" : time}
		],
		"Finished": [
			 {"_text" : false}
		]
	})
	sortEvents();
}

/* Updates and event by deleting the previous version and adding the updated version */
function updateEvent(title, date, time, eventIndex) {
	currentEvents.splice(eventIndex, 1);
	addEvent(title, date, time);
	sortEvents();
}

document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		init(); 
	}
};



