/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-ourschedule",{

	// Default module config.
	defaults: {
	},

	start: function() {
		this.globals = {}
		this.globals.year = new Date().getFullYear()
		this.globals.month = new Date().getMonth() + 1 // getMonth() -> Jan = 0, Dec = 11

		this.state = []
		this.days = []

		this.ready = {}
		this.ready['all'] = false
		this.ready['state'] = false
		this.ready['days'] = false

		this.filler = 'Requesting...'

		this.day_names = ['Lun.', 'Mar.', 'Med.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.']
		this.month_names = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

		this.shifts = {
			OFF: 0,
			MORNING: 1,
			DAY: 2,
			EVENING: 3
		}

		this.shiftStyles = {
			OFF: "unselected",
			MORNING: "selectedmorning",
			DAY: "selectedday",
			EVENING: "selectedevening",
		}

		this.drawCalendar()
		this.scheduleUpdate()
	},

	drawCalendar: function() {
		var self = this

		var request_state = new XMLHttpRequest();
		request_state.open('GET', 'http://oday.nyc:1616/state/year/' + this.globals.year + '/month/' + this.globals.month, true);
		request_state.onload = function () {
			self.state = JSON.parse(this.responseText)
			self.drawWhenReady('state')
		}
		request_state.send();

		var request_days = new XMLHttpRequest();
		request_days.open('GET', 'http://oday.nyc:1616/days/year/' + this.globals.year + '/month/' + this.globals.month, true);
		request_days.onload = function () {
			self.days = JSON.parse(this.responseText)
			self.drawWhenReady('days')
		}
		request_days.send();

	},

	redrawCalendar: function() {
		this.ready['all'] = false
		this.ready['state'] = false
		this.ready['days'] = false

		this.drawCalendar()
		this.scheduleUpdate()
	},

	drawWhenReady: function(item) {
		this.ready[item] = true

		if (this.ready['state'] && this.ready['days']) {
			this.ready['all'] = true
			this.filler = 'Ready'
		}

		this.updateDom()
	},

	scheduleUpdate: function() {
		var self = this;
		setTimeout(function() {
			self.redrawCalendar()
		}, 10 * 60 * 1000);

	},

	getDom: function() {
		var calendar = document.createElement("div")
		if ( this.ready['all'] ) {
			calendar.appendChild(this.createTable())
		} else {
			true
		}
		return calendar
	},

	createTable: function() {
		var month_index = this.globals.month - 1

		var tbl = document.createElement('table')
		tbl.id = 'calendar-body'
		tbl.style.width = '100%'
		tbl.setAttribute('border', '1')
		var tbdy = document.createElement('tbody')
		var tr = document.createElement('tr')

		tbdy.appendChild(tr)

		for (var i = 0; i < this.days.length; i++) {
			var tr = document.createElement('tr')

			for (var j = 0; j < this.days[i].length; j++) {
				var td = document.createElement('td')

				var day_object = new Date(this.days[i][j])

				if ( day_object.getMonth() == month_index ) {

					td.classList.add('td_schedule')
					if ( day_object.getDay() == 0 || day_object.getDay() == 6 ) {
						td.classList.add('weekend')
					} 

					var day_of_month = day_object.getDate()
					td.id = day_of_month
					td.appendChild(document.createTextNode( day_of_month ) )

					this.applyState(td)
				}
				tr.appendChild(td)
			}
			tbdy.appendChild(tr)
		}
		tbl.appendChild(tbdy)

		return tbl
	},

	clearClasses: function(td) {
		td.classList.remove(this.shiftStyles.OFF)
		td.classList.remove(this.shiftStyles.MORNING)
		td.classList.remove(this.shiftStyles.DAY)
		td.classList.remove(this.shiftStyles.EVENING)
	},

	applyState: function(td) {

		var day_number = td.id
		var day_index = day_number - 1

		var state = this.state[day_index]['shift']

		this.clearClasses(td)

		if ( state == this.shifts.OFF ) {
			td.classList.add(this.shiftStyles.OFF)
		}
		if ( state == this.shifts.MORNING ) {
			td.classList.add(this.shiftStyles.MORNING)
		}
		if ( state == this.shifts.DAY ) {
			td.classList.add(this.shiftStyles.DAY)
		}
		if ( state == this.shifts.EVENING ) {
			td.classList.add(this.shiftStyles.EVENING)
		}

	},

	getStyles: function() {
		return ['MMM-ourschedule.css']
	},

});

