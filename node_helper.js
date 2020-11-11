/* Magic Mirror
 * Module: MMM-Mashie-Skolmat
 *
 * By Johan Alvinger, https://github.com/Alvinger
 * Based on scripts by
 *	Johan Persson, https://github.com/retroflex
 *	Benjamin Angst http://www.beny.ch which is
 *	Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const ical = require('./vendor/ical.js');
const moment = require("moment");

module.exports = NodeHelper.create({

	// Define start sequence.
	start: function() {
		console.log("Starting node_helper for module: " + this.name);
		this.started = false;
	},

	// Receive notification
	socketNotificationReceived: function(notification, payload) {
   		console.log("node_helper for " + this.name + " received a socket notification: " + notification + " - Payload: " + JSON.stringify(payload, null, 2));
		if (notification === "CONFIG" && this.started == false) {
			this.config = payload;
			moment.locale(config.language);
			this.started = true;
			this.items = [];
			this.updateItems();
		}
	},

	/* updateItems()
	 * Check current departures and remove old ones. Requests new departure data if needed.
	 */
	updateItems: function() {
		var self = this;
		var now = moment();

		this.retrieveURL(this.config.url);
	},

	/* sendItems()
	 * Send data to frontend.
	 */
	sendItems: function(items) {
		// Notify the main module that we have new data
		// Schedule update
		if (items.length > 0) {
			this.sendSocketNotification("ITEMS", items);
		}
		this.scheduleUpdate();
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var self = this;
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(function() {
			self.updateItems();
		}, nextLoad);
	},
	// Retrieve data from url
	// @param url - URL of the feed.
	retrieveURL: function(url) {
		var items = [];
		var today = moment().startOf('day');
		var self = this;
		var days = 0;

		ical.fromURL(url, {}, function (err, data) {
			for (var k in data) {
				if (data.hasOwnProperty(k)) {
					var entry = data[k];
					if (entry.type == 'VEVENT') {
						// Don't show earlier days than today
						if (moment(entry.start) < today) {
							continue;
						}
						// Format title
						var title = moment(entry.start).format('dddd [- Vecka] WW');
						title = title.charAt(0).toUpperCase() + title.substring(1);
						// Split description into separate lines
						// Remove text up until first colon
						// Skip empty lines
						var desc = entry.description.split("\n");
						var description = ''
						for (var d in desc) {
							desc[d] = desc[d].replace(/^.+:/, '');
							desc[d] = desc[d].trim();
							if (desc[d].length > 0) {
								if (d > 0) {description += '<br>';}
								description += desc[d];
							}
						}
						// Only show the configured number of days
						if (days < self.config.days) {
							items.push( { title: title, description: description } );
							days++;
						}
					}
				}
			}
			self.sendItems(items);
		});
	}
});
