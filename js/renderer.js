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
		
		if (difference.Days <= 0 && difference.Hours <= 0 && difference.Mins <= 0) {
			newHTMLLeft = "<br>Event Expired"
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
		var newHTMLTitle = "<div id=\"event\"><div id=\"eventTitle\">" + currentEvents[i].Title[0]._text + "</div>";
		var newHTMLDate = "<div id=\"eventDate\">" + currentEvents[i].Date[0]._text + "</div>";
		var newHTMLTime = "<div id=\"eventTime\">" + currentEvents[i].Time[0]._text + "</div>";
		
		eventsDiv.innerHTML = currentHTML + newHTMLTitle + newHTMLDate + newHTMLTime + newHTMLLeft;
	}
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
			displayEvents();
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
			displayEvents();
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
	saveEvents();
	displayEvents();
}

document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		init(); 
	}
};



