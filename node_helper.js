/* Magic Mirror
 * Module: MMM-Koket-by-Sodexo
 *
 * By Johan Alvinger, https://github.com/Alvinger
 * Based on a script by Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const ical = require('./vendor/ical.js');
const moment = require('moment');

module.exports = NodeHelper.create({
	start: function() {
	},

	// Send items to the module js.
	// @param url - URL of the feed.
	// @param items - Array of items. Each item has a title and a description.
	// @param self - Pointer to this. Needed when this method is used as callback.
	broadcastItems: function(url, items, self) {
		self.sendSocketNotification('ITEMS', {
			url: url,
			items: items
		});
	},

	// Notification from module js.
	// @param notification - Notification type.
	// @param payload - Contains url of feed.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'LOAD_FEED') {
			this.loadFeed(payload.url, this.broadcastItems);
			return;
		}
	},

	// Load and parse a feed.
	// @param url - URL of the feed.
	// @param allEntriesParsedCB - Callback called when all items have been parsed.
	//                             See broadcastItems() for args doc.
	loadFeed: function(url, allEntriesParsedCB) {
		var items = [];
		var self = this;

		ical.fromURL(url, {}, function (err, data) {
			for (var k in data) {
				if (data.hasOwnProperty(k)) {
					var entry = data[k];
					if (entry.type == 'VEVENT') {
//						console.log(JSON.stringify(entry, null, 2));
						console.log('Datum: ' + moment(entry.start).format('YYYY-MM-DD'));
						console.log('Matsedel: ' + entry.summary);
						console.log('Matsedel: ' + entry.description);
						// Format title
						var title = moment(entry.start).format('dddd [- Vecka] WW');
						title = title.charAt(0).toUpperCase() + title.substring(1);
						console.log("Title=" + title);
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
						console.log(JSON.stringify(desc, null, 2));
						items.push( { title: title, description: description } );
					}
				}
			}
			allEntriesParsedCB(url, items, self);
		});
	}
});
