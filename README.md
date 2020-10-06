# MMM-Mashie-Skolmat
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module that shows school lunch menus from Mashie.com (mpi.mashie.com/public/app).

# Installation
1. Clone repo:
```
	cd MagicMirror/modules/
	git clone https://github.com/Alvinger/MMM-Mashie-Skolmat
```
2. Install dependencies:
```
	cd MMM-Mashie-Skolmat/
	npm install
```
3. Add the module to the ../MagicMirror/config/config.js, example:
```
		{
			module: 'MMM-Mashie-Skolmat',
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
Go to the Mashie web app (https://mpi.mashie.com/public/app) and search for your school.
Note: This module can also be used for "Köket by Sodexo" menus as they use Mashie but with a different URL. The "Köket by Sodexo" URL is https://sodexo.mashie.com/public/app.
Click on the school to see the current menu
Right-click on "Calendar" in the left hand menu and copy the hyperlink.
Replace "webcal" with "https" and use the result as the URL in the configuration.
