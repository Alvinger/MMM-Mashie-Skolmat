/* Magic Mirror
 * Module: MMM-Mashie-Skolmat
 *
 * By Johan Alvinger, https://github.com/Alvinger
 * Based on scripts by
 * 	Johan Persson, https://github.com/retroflex
 * 	Benjamin Angst http://www.beny.ch which is
 * 	Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register('MMM-Mashie-Skolmat', {

	// Define module defaults
	defaults: {
		updateInterval: 60 * 60 * 1000,	// Update module every hour
		days: 1,			// number of days to display
		url: '',			// URL of feed, e.g. 'https://skolmaten.se/furuhallskolan/rss/'.
		endOfToday: 23			// Cutoff time (hour) when todays menu is replaced by tomorrows.
	},

	// Define required styles.
	getStyles: function() {
		return ["MMM-Mashie-Skolmat.css"];
	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		this.items = [];
		this.loaded = false;
		this.sendSocketNotification("CONFIG", this.config);
	},

	socketNotificationReceived: function(notification, payload) {
		Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		if (notification === "ITEMS") {
			this.items = payload;
			this.loaded = true;
			this.scheduleUpdate(0);
		}
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement('div');

		if (!this.loaded) {
			wrapper.innerHTML = "Fetching data ...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		for (var i in this.items) {
			var item = this.items[i];

			var titleDiv = document.createElement('p');
			titleDiv.className = 'itemtitle';
			titleDiv.innerHTML = item.title;
			wrapper.appendChild(titleDiv);

			var descDiv = document.createElement('div');
			descDiv.className = 'itemdescription';
			descDiv.innerHTML = item.description;
			wrapper.appendChild(descDiv);
		}

		return wrapper;
	},
	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, config updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setInterval(function() {
			self.updateDom();
		}, nextLoad);
	},
});
