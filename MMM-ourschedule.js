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
		text: "Hello World!"
	},

	start: function() {
		this.filler = "Filler text"
		this.config.text = "Hello there"

		var self = this

		var request = new XMLHttpRequest();
		request.open('GET', 'http://oday.nyc:1616/text/nothing', true);
		request.onload = function () {
			self.processAnswer(this.responseText)
		}
		request.send();
	},

	getDom: function() {
		var calendar = document.createElement("div")

		calendar.innerHTML = this.filler

		return calendar
	},

	processAnswer: function(response) {
		this.filler = response
		this.updateDom()
	}
});
