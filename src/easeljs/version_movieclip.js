this.createjs = this.createjs || {};

(function() {
	"use strict";

	/**
	 * Static class holding library specific information such as the version and buildDate of
	 * the library.
	 **/
	var s = createjs.MovieClip = createjs.MovieClip || {};

	/**
	 * The version string for this release.
	 * @property version
	 * @for MovieClip
	 * @type String
	 * @static
	 **/
	s.version = /*version*/"NEXT"; // injected by build process

	/**
	 * The build date for this release in UTC format.
	 * @property buildDate
	 * @for MovieClip
	 * @type String
	 * @static
	 **/
	s.buildDate = /*date*/"Tue, 28 Jan 2014 21:54:26 GMT"; // injected by build process

})();
