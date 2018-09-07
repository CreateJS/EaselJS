/*
* MovieClip
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {
	"use strict";


// constructor:
	/**
	 * The MovieClip class associates a TweenJS Timeline with an EaselJS {{#crossLink "Container"}}{{/crossLink}}. It allows
	 * you to create objects which encapsulate timeline animations, state changes, and synched actions. The MovieClip
	 * class has been included in the EaselJS minified file since 0.7.0.
	 *
	 * Currently MovieClip only works properly if it is tick based (as opposed to time based) though some concessions have
	 * been made to support time-based timelines in the future.
	 *
	 * <h4>Example</h4>
	 * This example animates two shapes back and forth. The grey shape starts on the left, but we jump to a mid-point in
	 * the animation using {{#crossLink "MovieClip/gotoAndPlay"}}{{/crossLink}}.
	 *
	 *      var stage = new createjs.Stage("canvas");
	 *      createjs.Ticker.addEventListener("tick", stage);
	 *
	 *      var mc = new createjs.MovieClip({loop:-1, labels:{myLabel:20}});
	 *      stage.addChild(mc);
	 *
	 *      var child1 = new createjs.Shape(
	 *          new createjs.Graphics().beginFill("#999999")
	 *              .drawCircle(30,30,30));
	 *      var child2 = new createjs.Shape(
	 *          new createjs.Graphics().beginFill("#5a9cfb")
	 *              .drawCircle(30,30,30));
	 *
	 *      mc.timeline.addTween(
	 *          createjs.Tween.get(child1)
	 *              .to({x:0}).to({x:60}, 50).to({x:0}, 50));
	 *      mc.timeline.addTween(
	 *          createjs.Tween.get(child2)
	 *              .to({x:60}).to({x:0}, 50).to({x:60}, 50));
	 *
	 *      mc.gotoAndPlay("start");
	 *
	 * It is recommended to use `tween.to()` to animate and set properties (use no duration to have it set
	 * immediately), and the `tween.wait()`method to create delays between animations. Note that using the
	 * `tween.set()` method to affect properties will likely not provide the desired result.
	 *
	 * @class MovieClip
	 * @main MovieClip
	 * @param {Object} [props] The configuration properties to apply to this instance (ex. `{mode:MovieClip.SYNCHED}`).
	 * Supported props for the MovieClip are listed below. These props are set on the corresponding instance properties
	 * except where specified.<UL>
	 *    <LI> `mode`</LI>
	 *    <LI> `startPosition`</LI>
	 *    <LI> `frameBounds`</LI>
	 * </UL>
	 * 
	 * This object will also be passed into the Timeline instance associated with this MovieClip. See the documentation
	 * for Timeline for a list of supported props (ex. `paused`, `labels`, `loop`, `reversed`, etc.)
	 * @extends Container
	 * @constructor
	 **/
	function MovieClip(props) {
		this.Container_constructor();
		!MovieClip.inited&&MovieClip.init(); // static init
		
		var mode, startPosition, loop, labels;
		
		// handle old params (mode, startPosition, loop, labels):
		// TODO: deprecated param handling:
		if (props instanceof String || arguments.length > 1) {
			mode = props;
			startPosition = arguments[1];
			loop = arguments[2];
			labels = arguments[3];
			if (loop == null) { loop = -1; }
			props = null;
		} else if (props) {
			mode = props.mode;
			startPosition = props.startPosition;
			loop = props.loop;
			labels = props.labels;
		}
		if (!props) { props = {labels:labels}; }
		
		
	// public properties:
		/**
		 * Controls how this MovieClip advances its time. Must be one of 0 (INDEPENDENT), 1 (SINGLE_FRAME), or 2 (SYNCHED).
		 * See each constant for a description of the behaviour.
		 * @property mode
		 * @type String
		 * @default null
		 **/
		this.mode = mode||MovieClip.INDEPENDENT;
	
		/**
		 * Specifies what the first frame to play in this movieclip, or the only frame to display if mode is SINGLE_FRAME.
		 * @property startPosition
		 * @type Number
		 * @default 0
		 */
		this.startPosition = startPosition||0;
	
		/**
		 * Specifies how many times this MovieClip should loop. A value of -1 indicates it should loop indefinitely. A value of
		 * 1 would cause it to loop once (ie. play a total of twice).
		 * @property loop
		 * @type Number
		 * @default -1
		 */
		this.loop = loop === true ? -1 : (loop || 0);
	
		/**
		 * The current frame of the movieclip.
		 * @property currentFrame
		 * @type Number
		 * @default 0
		 * @readonly
		 */
		this.currentFrame = 0;
	
		/**
		 * If true, the MovieClip's position will not advance when ticked.
		 * @property paused
		 * @type Boolean
		 * @default false
		 */
		this.paused = props.paused||false;
	
		/**
		 * If true, actions in this MovieClip's tweens will be run when the playhead advances.
		 * @property actionsEnabled
		 * @type Boolean
		 * @default true
		 */
		this.actionsEnabled = true;
	
		/**
		 * If true, the MovieClip will automatically be reset to its first frame whenever the timeline adds
		 * it back onto the display list. This only applies to MovieClip instances with `mode` of "INDEPENDENT".

		 * For example, if you had a character animation with a "body" child MovieClip instance with different costumes
		 * on each frame, you could set `body.autoReset = false`, so that you can manually change the frame it is on,
		 * without worrying that it will be reset automatically.
		 * @property autoReset
		 * @type Boolean
		 * @default true
		 */
		this.autoReset = true;
		
		/**
		 * An array of bounds for each frame in the MovieClip. This is mainly intended for tool output.
		 * @property frameBounds
		 * @type Array
		 * @default null
		 */
		this.frameBounds = this.frameBounds||props.frameBounds; // frameBounds are set on the prototype in Animate.
		
		/**
		 * By default MovieClip instances advance one frame per tick. Specifying a framerate for the MovieClip
		 * will cause it to advance based on elapsed time between ticks as appropriate to maintain the target
		 * framerate.
		 *
		 * For example, if a MovieClip with a framerate of 10 is placed on a Stage being updated at 40fps, then the MovieClip will
		 * advance roughly one frame every 4 ticks. This will not be exact, because the time between each tick will
		 * vary slightly between frames.
		 *
		 * This feature is dependent on the tick event object (or an object with an appropriate "delta" property) being
		 * passed into {{#crossLink "Stage/update"}}{{/crossLink}}.
		 * @property framerate
		 * @type {Number}
		 * @default null
		 **/
		this.framerate = null;
		
		// set up the needed props for Timeline:
		props.useTicks = props.paused = true;
		
		/**
		 * The TweenJS Timeline that is associated with this MovieClip. This is created automatically when the MovieClip
		 * instance is initialized. Animations are created by adding <a href="http://tweenjs.com">TweenJS</a> Tween
		 * instances to the timeline.
		 *
		 * <h4>Example</h4>
		 *
		 *      var tween = createjs.Tween.get(target).to({x:0}).to({x:100}, 30);
		 *      var mc = new createjs.MovieClip();
		 *      mc.timeline.addTween(tween);
		 *
		 * Elements can be added and removed from the timeline by toggling an "_off" property
		 * using the `tweenInstance.to()` method. Note that using `Tween.set` is not recommended to create MovieClip
		 * animations. The following example will toggle the target off on frame 0, and then back on for frame 1. You
		 * can use the "visible" property to achieve the same effect.
		 *
		 *      var tween = createjs.Tween.get(target).to({_off:false})
		 *          .wait(1).to({_off:true})
		 *          .wait(1).to({_off:false});
		 *
		 * @property timeline
		 * @type Timeline
		 * @default null
		 */
		this.timeline = new createjs.Timeline(props);
		
		
	// private properties:
		/**
		 * @property _synchOffset
		 * @type Number
		 * @default 0
		 * @private
		 */
		this._synchOffset = 0;
	
		/**
		 * @property _rawPosition
		 * @type Number
		 * @default -1
		 * @private
		 */
		this._rawPosition = -1; // TODO: evaluate using a ._reset Boolean prop instead of -1.
		
		/**
		 * @property _bound_resolveState
		 * @type Function
		 * @private
		 */
		this._bound_resolveState = this._resolveState.bind(this);
	
	
		/**
		 * The time remaining from the previous tick, only applicable when .framerate is set.
		 * @property _t
		 * @type Number
		 * @private
		 */
		this._t = 0;
	
		/**
		 * List of display objects that are actively being managed by the MovieClip.
		 * @property _managed
		 * @type Object
		 * @private
		 */
		this._managed = {};
	}
	var p = createjs.extend(MovieClip, createjs.Container);


// constants:
	/**
	 * The MovieClip will advance independently of its parent, even if its parent is paused.
	 * This is the default mode.
	 * @property INDEPENDENT
	 * @static
	 * @type String
	 * @default "independent"
	 * @readonly
	 **/
	MovieClip.INDEPENDENT = "independent";

	/**
	 * The MovieClip will only display a single frame (as determined by the startPosition property).
	 * @property SINGLE_FRAME
	 * @static
	 * @type String
	 * @default "single"
	 * @readonly
	 **/
	MovieClip.SINGLE_FRAME = "single";

	/**
	 * The MovieClip will be advanced only when its parent advances and will be synched to the position of
	 * the parent MovieClip.
	 * @property SYNCHED
	 * @static
	 * @type String
	 * @default "synched"
	 * @readonly
	 **/
	MovieClip.SYNCHED = "synched";
	
	
// static properties:
	MovieClip.inited = false;
	
	
// static methods:
	MovieClip.init = function() {
		if (MovieClip.inited) { return; }
		// plugins introduce some overhead to Tween, so we only install this if an MC is instantiated.
		MovieClipPlugin.install();
		MovieClip.inited = true;
	};
	
	
// getter / setters:
	/**
	 * Use the {{#crossLink "MovieClip/labels:property"}}{{/crossLink}} property instead.
	 * @method _getLabels
	 * @protected
	 * @return {Array}
	 **/
	p._getLabels = function() {
		return this.timeline.getLabels();
	};

	/**
	 * Use the {{#crossLink "MovieClip/labels:property"}}{{/crossLink}} property instead.
	 * @method getLabels
	 * @deprecated
	 */
	// MovieClip.getLabels is @deprecated. Remove for 1.1+
	p.getLabels = createjs.deprecate(p._getLabels, "MovieClip.getLabels");

	/**
	 * Use the {{#crossLink "MovieClip/currentLabel:property"}}{{/crossLink}} property instead.
	 * @method _getCurrentLabel
	 * @protected
	 * @return {String}
	 **/
	p._getCurrentLabel = function() {
		return this.timeline.currentLabel;
	};

	/**
	 * Use the {{#crossLink "MovieClip/currentLabel:property"}}{{/crossLink}} property instead.
	 * @method getCurrentLabel
	 * @deprecated
	 */
	// MovieClip.getCurrentLabel is @deprecated. Remove for 1.1+
	p.getCurrentLabel = createjs.deprecate(p._getCurrentLabel, "MovieClip.getCurrentLabel");

	/**
	 * Use the {{#crossLink "MovieClip/duration:property"}}{{/crossLink}} property instead.
	 * @method _getDuration
	 * @protected
	 * @return {Number}
	 **/
	p._getDuration = function() {
		return this.timeline.duration;
	};

	/**
	 * Use the {{#crossLink "MovieClip/duration:property"}}{{/crossLink}} property instead.
	 * @method getDuration
	 * @deprecated
	 */
	// MovieClip.getDuration is @deprecated. Remove for 1.1+
	p.getDuration = createjs.deprecate(p._getDuration, "MovieClip.getDuration");

	/**
	 * Returns an array of objects with label and position (aka frame) properties, sorted by position.
	 * @property labels
	 * @type {Array}
	 * @readonly
	 **/
	
	/**
	 * Returns the name of the label on or immediately before the current frame.
	 * @property currentLabel
	 * @type {String}
	 * @readonly
	 **/
	
	/**
	 * Returns the duration of this MovieClip in seconds or ticks.
	 * @property totalFrames
	 * @type {Number}
	 * @readonly
	 **/
	
	/**
	 * Returns the duration of this MovieClip in seconds or ticks.
	 * @property duration
	 * @type {Number}
	 * @readonly
	 **/
	try {
		Object.defineProperties(p, {
			labels: { get: p._getLabels },
			currentLabel: { get: p._getCurrentLabel },
			totalFrames: { get: p._getDuration },
			duration: { get: p._getDuration }
			// TODO: can we just proxy .currentFrame to tl.position as well? Ditto for .loop (or just remove entirely).
		});
	} catch (e) {}


// public methods:
	/**
	 * Constructor alias for backwards compatibility. This method will be removed in future versions.
	 * Subclasses should be updated to use {{#crossLink "Utility Methods/extend"}}{{/crossLink}} and
	 * {{#crossLink "Utility Methods/promote"}}{{/crossLink}} instead.
	 * @method initialize
	 * @deprecated
	 **/
	p.initialize = MovieClip; // TODO: Deprecated. This is for backwards support of Adobe Flash/Animate

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		// children are placed in draw, so we can't determine if we have content.
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
	};

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	p.draw = function(ctx, ignoreCache) {
		// draw to cache first:
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		this._updateState();
		this.Container_draw(ctx, ignoreCache);
		return true;
	};

	/**
	 * Sets paused to false.
	 * @method play
	 **/
	p.play = function() {
		this.paused = false;
	};
	
	/**
	 * Sets paused to true.
	 * @method stop
	 **/
	p.stop = function() {
		this.paused = true;
	};
	
	/**
	 * Advances this movie clip to the specified position or label and sets paused to false.
	 * @method gotoAndPlay
	 * @param {String|Number} positionOrLabel The animation name or frame number to go to.
	 **/
	p.gotoAndPlay = function(positionOrLabel) {
		this.paused = false;
		this._goto(positionOrLabel);
	};
	
	/**
	 * Advances this movie clip to the specified position or label and sets paused to true.
	 * @method gotoAndStop
	 * @param {String|Number} positionOrLabel The animation or frame name to go to.
	 **/
	p.gotoAndStop = function(positionOrLabel) {
		this.paused = true;
		this._goto(positionOrLabel);
	};
	
	/**
	 * Advances the playhead. This occurs automatically each tick by default.
	 * @param [time] {Number} The amount of time in ms to advance by. Only applicable if framerate is set.
	 * @method advance
	*/
	p.advance = function(time) {
		var independent = MovieClip.INDEPENDENT;
		if (this.mode !== independent) { return; } // update happens in draw for synched clips
		
		// if this MC doesn't have a framerate, hunt ancestors for one:
		var o=this, fps = o.framerate;
		while ((o = o.parent) && fps === null) { if (o.mode === independent) { fps = o._framerate; } }
		this._framerate = fps;
		
		// calculate how many frames to advance:
		var t = (fps !== null && fps !== -1 && time !== null) ? time/(1000/fps) + this._t : 1;
		var frames = t|0;
		this._t = t-frames; // leftover time, save to add to next advance.
		
		while (!this.paused && frames--) { this._updateTimeline(this._rawPosition+1, false); }
	};
	
	/**
	 * MovieClip instances cannot be cloned.
	 * @method clone
	 **/
	p.clone = function() {
		// TODO: add support for this? Need to clone the Timeline & retarget tweens - pretty complex.
		throw("MovieClip cannot be cloned.");
	};
	
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[MovieClip (name="+  this.name +")]";
	};


// private methods:
	p._updateState = function() {
		if (this._rawPosition === -1 || this.mode !== MovieClip.INDEPENDENT) { this._updateTimeline(-1); }
	};

	/**
	 * @method _tick
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 * function.
	 * @protected
	 **/
	p._tick = function(evtObj) {
		this.advance(evtObj&&evtObj.delta);
		this.Container__tick(evtObj);
	};
	
	/**
	 * @method _goto
	 * @param {String|Number} positionOrLabel The animation name or frame number to go to.
	 * @protected
	 **/
	p._goto = function(positionOrLabel) {
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos == null) { return; }
		this._t = 0;
		this._updateTimeline(pos, true);
	};
	
	/**
	 * @method _reset
	 * @private
	 **/
	p._reset = function() {
		this._rawPosition = -1;
		this._t = this.currentFrame = 0;
		this.paused = false;
	};
	
	/**
	 * @method _updateTimeline
	 * @param {Boolean} jump Indicates whether this update is due to jumping (via gotoAndXX) to a new position.
	 * @protected
	 **/
	p._updateTimeline = function(rawPosition, jump) {
		var synced = this.mode !== MovieClip.INDEPENDENT, tl = this.timeline;
		if (synced) { rawPosition = this.startPosition + (this.mode===MovieClip.SINGLE_FRAME?0:this._synchOffset); }
		if (rawPosition < 0) { rawPosition = 0; }
		if (this._rawPosition === rawPosition && !synced) { return; }
		this._rawPosition = rawPosition;
		
		// update timeline position, ignoring actions if this is a graphic.
		tl.loop = this.loop; // TODO: should we maintain this on MovieClip, or just have it on timeline?
		tl.setPosition(rawPosition, synced || !this.actionsEnabled, jump, this._bound_resolveState);
	};
	
	/**
	 * Renders position 0 without running actions or updating _rawPosition.
	 * Primarily used by Animate CC to build out the first frame in the constructor of MC symbols.
	 * NOTE: not tested when run after the MC advances past the first frame.
	 * @method _renderFirstFrame
	 * @protected
	 **/
	p._renderFirstFrame = function() {
		var tl = this.timeline, pos = tl.rawPosition;
		tl.setPosition(0, true, true, this._bound_resolveState);
		tl.rawPosition = pos;
	};
	
	/**
	 * Runs via a callback after timeline property updates and before actions.
	 * @method _resolveState
	 * @protected
	 **/
	p._resolveState = function() {
		var tl = this.timeline;
		this.currentFrame = tl.position;
		
		for (var n in this._managed) { this._managed[n] = 1; }

		var tweens = tl.tweens;
		for (var i=0, l=tweens.length; i<l; i++) {
			var tween = tweens[i],  target = tween.target;
			if (target === this || tween.passive) { continue; } // TODO: this assumes the actions tween from Animate has `this` as the target. There's likely a better approach.
			var offset = tween._stepPosition;

			if (target instanceof createjs.DisplayObject) {
				// motion tween.
				this._addManagedChild(target, offset);
			} else {
				// state tween.
				this._setState(target.state, offset);
			}
		}

		var kids = this.children;
		for (i=kids.length-1; i>=0; i--) {
			var id = kids[i].id;
			if (this._managed[id] === 1) {
				this.removeChildAt(i);
				delete(this._managed[id]);
			}
		}
	};

	/**
	 * @method _setState
	 * @param {Array} state
	 * @param {Number} offset
	 * @protected
	 **/
	p._setState = function(state, offset) {
		if (!state) { return; }
		for (var i=state.length-1;i>=0;i--) {
			var o = state[i];
			var target = o.t;
			var props = o.p;
			for (var n in props) { target[n] = props[n]; }
			this._addManagedChild(target, offset);
		}
	};

	/**
	 * Adds a child to the timeline, and sets it up as a managed child.
	 * @method _addManagedChild
	 * @param {MovieClip} child The child MovieClip to manage
	 * @param {Number} offset
	 * @private
	 **/
	p._addManagedChild = function(child, offset) {
		if (child._off) { return; }
		this.addChildAt(child,0);

		if (child instanceof MovieClip) {
			child._synchOffset = offset;
			// TODO: this does not precisely match Adobe Flash/Animate, which loses track of the clip if it is renamed or removed from the timeline, which causes it to reset.
			// TODO: should also reset when MovieClip loops, though that will be a bit tricky to detect.
			if (child.mode === MovieClip.INDEPENDENT && child.autoReset && (!this._managed[child.id])) { child._reset(); }
		}
		this._managed[child.id] = 2;
	};
	
	/**
	 * @method _getBounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform
	 * @return {Rectangle}
	 * @protected
	 **/
	p._getBounds = function(matrix, ignoreTransform) {
		var bounds = this.DisplayObject_getBounds();
		if (!bounds) {
			if (this.frameBounds) { bounds = this._rectangle.copy(this.frameBounds[this.currentFrame]); }
		}
		if (bounds) { return this._transformBounds(bounds, matrix, ignoreTransform); }
		return this.Container__getBounds(matrix, ignoreTransform);
	};


	createjs.MovieClip = createjs.promote(MovieClip, "Container");



// MovieClipPlugin for TweenJS:
	/**
	 * This plugin works with <a href="http://tweenjs.com" target="_blank">TweenJS</a> to prevent the startPosition
	 * property from tweening.
	 * @private
	 * @class MovieClipPlugin
	 * @constructor
	 **/
	function MovieClipPlugin() {
		throw("MovieClipPlugin cannot be instantiated.")
	}
	
	/**
	 * @property priority
	 * @type {Number}
	 * @static
	 * @readonly
	 **/
	MovieClipPlugin.priority = 100; // very high priority, should run first
	
	/**
	 * @property ID
	 * @type {String}
	 * @static
	 * @readonly
	 **/
	MovieClipPlugin.ID = "MovieClip";

	/**
	 * @method install
	 * @static
	 **/
	MovieClipPlugin.install = function() {
		createjs.Tween._installPlugin(MovieClipPlugin);
	};
	
	/**
	 * @method init
	 * @param {Tween} tween
	 * @param {String} prop
	 * @param {*} value
	 * @static
	 **/
	MovieClipPlugin.init = function(tween, prop, value) {
		if (prop === "startPosition" && tween.target instanceof MovieClip) { tween._addPlugin(MovieClipPlugin); }
	};
	
	/**
	 * @method step
	 * @param {Tween} tween
	 * @param {TweenStep} step
	 * @param {Object} props
	 * @static
	 **/
	MovieClipPlugin.step = function(tween, step, props) {};

	/**
	 * @method change
	 * @param {Tween} tween
	 * @param {TweenStep} step
	 * @param {*} value
	 * @param {Number} ratio
	 * @param {Object} end
	 * @return {*}
	 * @static
	 */
	MovieClipPlugin.change = function(tween, step, prop, value, ratio, end) {
		if (prop === "startPosition") { return (ratio === 1 ? step.props[prop] : step.prev.props[prop]); }
	};

}());
