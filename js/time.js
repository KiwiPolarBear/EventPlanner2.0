function convertTo24(timeString, ampm) {
	var index = timeString.indexOf(":");
	var hour = parseInt(timeString.substr(0, index));
	var minute = parseInt(timeString.substr(index + 1));
	
	if (ampm === "PM" && hour !== 12) {
		hour = hour + 12;
	} 
	if (ampm === "AM" && hour === 12) {
			hour = 0;
	}
	
	if (minute < 10) {
		minute = "0" + minute;
	} 
	if (hour < 10) {
		hour = "0" + hour;
	}
	return hour + ":" + minute;
}

function convertTo12(timeString) {
	var hour = parseInt(timeString.substring(0, 2));
	var minute = parseInt(timeString.substring(3));
	var ampm = "AM";
	
	if (hour >= 12) {
		ampm = "PM";	
	}
	if (hour > 12) {
		hour = hour - 12;
	}
	if (minute < 10) {
		minute = "0" + minute;
	} 
	if (hour < 10) {
		hour = "0" + hour;
	}
	
	return hour + ":" + minute + " " + ampm;
}

function calculateDifference(dateTime) {
	var today = new Date();
	var event = new Date(dateTime);
	var milliseconds = event - today;
	
	var seconds = Math.floor(milliseconds/1000);
	var mins = Math.floor(seconds/60);
	
	var hours = Math.floor(mins/60);
	var minsLeft = mins % 60;
	
	var daysLeft = Math.floor(hours/24);
	var hoursLeft = hours % 24;
	
	return {
		"Days": daysLeft,
		"Hours": hoursLeft,
		"Mins": minsLeft
	}
}