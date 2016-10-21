## Setup and run tests ##
* Run via NPM
    * Install dependencies: `npm install`
    * Run tests in browser: `npm run test`
    * Run headless: `npm run test:headless`
    * Filter specs by STRING: `grunt --filter=STRING` or `grunt headless --filter=STRING`

### Install headless version ###
* node-canvas is required for headless testing.
    * Please check https://github.com/Automattic/node-canvas for install details.

#### Gotchas when installing node-canvas ####
	# If you receive this error:
	Error "Package xcb-shm was not found in the pkg-config search path." ...

	# Run this
	export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig:$PKG_CONFIG_PATH
	
	# Source:
	https://github.com/Homebrew/homebrew/issues/14123
