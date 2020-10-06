/* Magic Mirror
 * Module: MMM-Mashie-Skolmat
 *
 * By Johan Alvinger, https://github.com/Alvinger
 * Based on the MMM-Skolmaten module by Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

Module.register('MMM-Mashie-Skolmat', {
	// Default configuration.
	// days is the number of days to display.
	// url is URL of feed, e.g. 'https://skolmaten.se/furuhallskolan/rss/'.
	defaults: {
		days: 1,
		url: ''
	},

	getStyles: function() {
		return [ 'MMM-Mashie-Skolmat.css' ];
	},

	// Notification from node_helper.js.
	// The items are received here and copied. Then module is redrawn.
	// @param notification - Notification type.
	// @param payload - Contains url and array of items of feed. Each item has a title and a description.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'ITEMS') {
			if (payload.url === this.config.url) {
				this.items = [];

				var len = payload.items.length;
				if(len > this.config.days) {len = this.config.days};
				for (var i = 0; i < len; ++i) {
					var item = payload.items[i];
					this.items.push(item);
				}

				this.updateDom(0);
			}
		}
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement('div');

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

	// Override start to init stuff.
	start: function() {
		// Send anything to initiate communication / node helper.
		this.sendSocketNotification('START', {message: 'start connection'});

		// Loading message.
		this.items = [];
		this.items.push( { title: this.translate('LOADING'), description: '' } );

		// Tell node_helper to load RSS feed at startup.
		this.sendSocketNotification('LOAD_FEED', { url: this.config.url });

		// Make sure RSS feed is reloaded every 6 hours.
		var self = this;
		setInterval(function() {
			self.sendSocketNotification('LOAD_FEED', { url: self.config.url });
		}, 3 * 60 * 60 * 1000); // In millisecs. Refresh every three hours.
	}
});
