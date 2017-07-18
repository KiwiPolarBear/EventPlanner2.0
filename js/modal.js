function initModals() {
	/* Add numbers into the hour and minute drop down menus */
	var selectHour = document.getElementById("hourSelect");
	var selectHourEdit = document.getElementById("hourSelectEdit");
	for (var i = 1; i < 13; i++) {
		selectHour.innerHTML = selectHour.innerHTML + "<option>" + i + "</option>";
		selectHourEdit.innerHTML = selectHourEdit.innerHTML + "<option>" + i + "</option>";
	}
	var selectMinute = document.getElementById("minuteSelect");
	var selectMinuteEdit = document.getElementById("minuteSelectEdit");
	for (var i = 0; i < 60; i++) {
		if (i < 10) {
			selectMinute.innerHTML = selectMinute.innerHTML + "<option>" + "0" + i + "</option>";
			selectMinuteEdit.innerHTML = selectMinuteEdit.innerHTML + "<option>" + "0" + i + "</option>";
		} else {
			selectMinute.innerHTML = selectMinute.innerHTML + "<option>" + i + "</option>";
			selectMinuteEdit.innerHTML = selectMinuteEdit.innerHTML + "<option>" + i + "</option>";
		}
	}
	
	/* The modal objects */
	var modal = document.getElementById('myModal');
	var editModal = document.getElementById('editModal');
	
	/* Open Modal Button */
	var addEventButton = document.getElementById("addEventButton");
	addEventButton.onclick = function() {
			modal.style.display = "block";
	}
	
	/* Modal Closing */
	var spans = document.getElementsByClassName("close");
	spans[0].onclick = function() {
		closeAddEventModal();
	}
	spans[1].onclick = function() {
		closeEditEventModal()
	}
	window.onclick = function(event) {
			if (event.target == modal) {
					closeAddEventModal();
			}
		if (event.target == editModal) {
					closeEditEventModal()
			}
	}
	
	/* Handle the add button in the add event modal being pressed */
	var addButton = document.getElementById("modalAddEventButton");
	addButton.onclick = function() {
		var title = document.getElementById("modalTitle").value;
		var date = document.getElementById("modalDate").value;
		var hour = document.getElementById("hourSelect").value;
		var minute = document.getElementById("minuteSelect").value;
		var ampm = document.getElementById("ampmSelect").value;
		
		if (title !== "" && date !== "") {
			addEvent(title, date, convertTo24(hour + ":" + minute, ampm));
			closeAddEventModal();
		} else {
			//todo Warning!
		}
	}
	
	/* Handle the update button in the edit modal being pressed */
	var updateButton = document.getElementById("modalEditEventButton");
	updateButton.onclick = function() {
		var title = document.getElementById("modalTitleEdit").value;
		var date = document.getElementById("modalDateEdit").value;
		var hour = document.getElementById("hourSelectEdit").value;
		var minute = document.getElementById("minuteSelectEdit").value;
		var ampm = document.getElementById("ampmSelectEdit").value;
		
		if (title !== "" && date !== "") {
			updateEvent(title, date, convertTo24(hour + ":" + minute, ampm), eventInFocus);
			closeEditEventModal()
		} else {
			//todo Warning!
		}
	}
}

function closeAddEventModal() {
	var modal = document.getElementById('myModal');
	modal.style.display = "none";
	document.getElementById("modalTitle").value = "";
	document.getElementById("modalDate").value = "";
	document.getElementById("hourSelect").value = "1";
	document.getElementById("minuteSelect").value = "00";
	document.getElementById("ampmSelect").value = "AM";
}

function closeEditEventModal() {
	var editModal = document.getElementById('editModal');
	editModal.style.display = "none";
	document.getElementById("modalTitleEdit").value = "";
	document.getElementById("modalDateEdit").value = "";
	document.getElementById("hourSelectEdit").value = "1";
	document.getElementById("minuteSelectEdit").value = "00";
	document.getElementById("ampmSelectEdit").value = "AM";
}

function updateEditModalTitle(title) {
	document.getElementById("modalTitleEdit").value = title;
}

function updateEditModalDate(date) {
	document.getElementById("modalDateEdit").value = date;
}

function updateEditModalHour(hour) {
	document.getElementById("hourSelectEdit").value = hour;
}

function updateEditModalMinute(minute) {
	document.getElementById("minuteSelectEdit").value = minute;
}

function updateEditModalAMPM(ampm) {
	document.getElementById("ampmSelectEdit").value = ampm;
}

