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
		calendar.innerHTML = this.filler 
		return calendar
	}

});
