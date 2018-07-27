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
		this.ready['state'] = false
		this.ready['days'] = false

		this.filler = 'Requesting...'

		this.day_names = ['Lun.', 'Mar.', 'Med.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.']
		this.month_names = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

		var self = this

		var request_state = new XMLHttpRequest();
		request_state.open('GET', 'http://oday.nyc:1616/state/year/' + this.globals.year + '/month/' + this.globals.month, true);
		request_state.onload = function () {
			self.state = JSON.parse(this.responseText)
			console.log(self.state)
			self.reportReadiness('state')
		}
		request_state.send();

		var request_days = new XMLHttpRequest();
		request_days.open('GET', 'http://oday.nyc:1616/days/year/' + this.globals.year + '/month/' + this.globals.month, true);
		request_days.onload = function () {
			self.days = JSON.parse(this.responseText)
			console.log(self.days)
			self.reportReadiness('days')
		}
		request_days.send();
	},

	reportReadiness: function(item) {
		this.ready[item] = true

		if (this.ready['state'] && this.ready['days']) {
			this.filler = 'Ready'
		}

		this.updateDom()
	},

	getDom: function() {
		var calendar = document.createElement("div")
		calendar.appendChild(this.createTable())
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
				}
				tr.appendChild(td)
			}
			tbdy.appendChild(tr)
		}
		tbl.appendChild(tbdy)

		return tbl
	},

	getStyles: function() {
		return ['MMM-ourschedule.css']
	},

});

