function initModal() {
	var selectHour = document.getElementById("hourSelect");
	for (var i = 1; i < 13; i++) {
		selectHour.innerHTML = selectHour.innerHTML + "<option>" + i + "</option>";
	}
	
	var selectMinute = document.getElementById("minuteSelect");
	for (var i = 0; i < 60; i++) {
		if (i < 10) {
			selectMinute.innerHTML = selectMinute.innerHTML + "<option>" + "0" + i + "</option>";
		} else {
			selectMinute.innerHTML = selectMinute.innerHTML + "<option>" + i + "</option>";
		}
	}
	
	var modal = document.getElementById('myModal');
	var btn = document.getElementById("addEventButton");
	btn.onclick = function() {
			modal.style.display = "block";
	}

	var span = document.getElementsByClassName("close")[0];
	span.onclick = function() {
			modal.style.display = "none";
	}

	window.onclick = function(event) {
			if (event.target == modal) {
					modal.style.display = "none";
			}
	}
	
	var addButton = document.getElementById("modalAddEventButton");
	addButton.onclick = function() {
		var title = document.getElementById("modalTitle").value;
		var date = document.getElementById("modalDate").value;
		var hour = document.getElementById("hourSelect").value;
		var minute = document.getElementById("minuteSelect").value;
		var ampm = document.getElementById("ampmSelect").value;
		
		if (title !== "" && date !== "") {
			addEvent(title, date, convertTo24(hour + ":" + minute, ampm));
			modal.style.display = "none";
		} else {
			//todo Warning!
		}
	}
}