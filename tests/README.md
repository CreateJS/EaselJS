## Setup ##
* No setup is required to run the tests, simply run index.html through a webserver.
* To run via Grunt (Recommend)
    * npm install;
    
### Install headless version ###
* node-canvas is required for headless testing.
    * Please check https://github.com/Automattic/node-canvas for install details.

#### Gotchas when installing node-canvas ####
	# Is you receive this error: 
	Error "Package xcb-shm was not found in the pkg-config search path." ...
	
	# Run this
	export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig:$PKG_CONFIG_PATH
	
	# Source:
	https://github.com/Homebrew/homebrew/issues/14123
	

## Run Tests ##
* Run in browser: grunt;
* Run headless: grunt jasmine;
