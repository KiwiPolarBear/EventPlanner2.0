// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var remote = require('electron').remote;
var BrowserWindow = remote.getCurrentWindow(); 
var fs = require('fs');
var os = require('os');

var currentEvents = [];

function init() {
	initButtons();
	initLoadEvents();
	initModal();
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

function displayEvents() {
	var eventsDiv = document.getElementById("eventsDiv");
	eventsDiv.innerHTML = "";
	
	for (var i = 0; i < currentEvents.length; i++) {
		var difference = calculateDifference(currentEvents[i].Date[0]._text + " " + currentEvents[i].Time[0]._text);
		var newHTMLLeft = "<br>";
		var style = "";
		if (difference.Days <= 0 && difference.Hours <= 0 && difference.Mins <= 0) {
			newHTMLLeft = "<br>Event Expired"
			style = "style=\"background: green;\""
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
		
		var currentHTML = eventsDiv.innerHTML;
		var newHTMLTitle = "<div " + style + " id=\"event\"><div id=\"eventTitle\">" + currentEvents[i].Title[0]._text + "</div>";
		var newHTMLDate = "<div id=\"eventDate\">" + currentEvents[i].Date[0]._text + "</div>";
		var newHTMLTime = "<div id=\"eventTime\">" + currentEvents[i].Time[0]._text + "</div>";
		var index = "<input type=\"hidden\" name=\"index\" value=" + i + ">"
		var buttonHTML = "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"deleteEvent(this)\" id=\"eventDeleteButton\">Delete</button>"
		var button2HTML = "<button type=\"button\" class=\"btn btn-secondary\" id=\"eventEditButton\">Edit</button>"
		var button3HTML = "<button type=\"button\" class=\"btn btn-secondary\" id=\"eventDoneButton\">Done</button>"
		
		eventsDiv.innerHTML = currentHTML + newHTMLTitle + newHTMLDate + newHTMLTime + newHTMLLeft + index + buttonHTML + button2HTML + button3HTML;
	}
}

function deleteEvent(button) {
	var value = confirm("Are you sure you want to delete this event?");
	if (value == true) {
			var index = button.parentElement.getElementsByTagName("input")[0].value;
			currentEvents.splice(index, 1);
			sortEvents();
	}
}

function sortEvents() {
	currentEvents.sort(compare);
	saveEvents();
	displayEvents();
}

function compare(a, b) {
	aDate = new Date(a.Date[0]._text + " " + a.Time[0]._text);
	bDate = new Date(b.Date[0]._text + " " + b.Time[0]._text);
  if (aDate.getTime() < bDate.getTime())
     return -1;
  if (aDate.getTime() > bDate.getTime())
    return 1;
  return 0;
}

function saveEvents() {
	fs.writeFileSync((os.homedir() + "/Saved Events/events.json"), JSON.stringify(currentEvents));
}

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

document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		init(); 
	}
};



