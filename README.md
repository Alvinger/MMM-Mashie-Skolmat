# MMM-Koket-by-Sodexo
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module that shows school lunch menus in Sweden from Köket by Sodexo (sodexo.mashie.com/public/app).

# Installation
1. Clone repo:
```
	cd MagicMirror/modules/
	git clone https://github.com/Alvinger/MMM-Koket-by-Sodexo
```
2. Install dependencies:
```
	cd MMM-Koket-by-Sodexo/
	npm install
```
3. Add the module to the ../MagicMirror/config/config.js, example:
```
		{
			module: 'MMM-Koket-by-Sodexo',
			header: 'Norra real',
			position: 'bottom_right',
			config: {
				days: 1,
				url: 'https://sodexo.mashie.com:443/public/icalendar/St%20Eriks%20gymnasium/6639b607.ics'
			}
		},
```

# Configuration
By default the module will show lunch menu for today (or next day if no entry for today).

You can choose how the many days should be shown by setting the parameter "days" to the number of days to be shown. If "days" are set to 1 and no menu item exists for today, the module will try to show tomorrow's menu.

# Getting the correct URL
Go to the Köket by Sodexo web app (https://sodexo.mashie.com/public/app) and search for your school.
Click on the school to see the current menu
Right-click on "Calendar" in the left hand menu and copy the hyperlink.
Replace "webcal" with "https" and use the result as the URL in the configuration.
