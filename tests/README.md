Error "Package xcb-shm was not found in the pkg-config search path." ...
https://github.com/Homebrew/homebrew/issues/14123
export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig:$PKG_CONFIG_PATH

install imagediff:
	- npm install -g imagediff
	

