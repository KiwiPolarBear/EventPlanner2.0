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
	var minute = parseInt(timeString.substring(3, 4));
	
	
}