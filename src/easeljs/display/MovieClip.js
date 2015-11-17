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
	 * you to create objects which encapsulate timeline animations, state changes, and synched actions. Due to the
	 * complexities inherent in correctly setting up a MovieClip, it is largely intended for tool output and is not included
	 * in the main EaselJS library.
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
	 *      var mc = new createjs.MovieClip(null, 0, true, {start:20});
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
	 * It is recommended to use <code>tween.to()</code> to animate and set properties (use no duration to have it set
	 * immediately), and the <code>tween.wait()</code> method to create delays between animations. Note that using the
	 * <code>tween.set()</code> method to affect properties will likely not provide the desired result.
	 *
	 * @class MovieClip
	 * @main MovieClip
	 * @extends Container
	 * @constructor
	 * @param {String} [mode=independent] Initial value for the mode property. One of {{#crossLink "MovieClip/INDEPENDENT:property"}}{{/crossLink}},
	 * {{#crossLink "MovieClip/SINGLE_FRAME:property"}}{{/crossLink}}, or {{#crossLink "MovieClip/SYNCHED:property"}}{{/crossLink}}.
	 * The default is {{#crossLink "MovieClip/INDEPENDENT:property"}}{{/crossLink}}.
	 * @param {Number} [startPosition=0] Initial value for the {{#crossLink "MovieClip/startPosition:property"}}{{/crossLink}}
	 * property.
	 * @param {Boolean} [loop=true] Initial value for the {{#crossLink "MovieClip/loop:property"}}{{/crossLink}}
	 * property. The default is `true`.
	 * @param {Object} [labels=null] A hash of labels to pass to the {{#crossLink "MovieClip/timeline:property"}}{{/crossLink}}
	 * instance associated with this MovieClip. Labels only need to be passed if they need to be used.
	 **/
	function MovieClip(mode, startPosition, loop, labels) {
		this.Container_constructor();
		!MovieClip.inited&&MovieClip.init(); // static init
		
		
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
		this.startPosition = startPosition || 0;
	
		/**
		 * Indicates whether this MovieClip should loop when it reaches the end of its timeline.
		 * @property loop
		 * @type Boolean
		 * @default true
		 */
		this.loop = loop;
	
		/**
		 * The current frame of the movieclip.
		 * @property currentFrame
		 * @type Number
		 * @default 0
		 * @readonly
		 */
		this.currentFrame = 0;
	
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
		 * using the <code>tweenInstance.to()</code> method. Note that using <code>Tween.set</code> is not recommended to
		 * create MovieClip animations. The following example will toggle the target off on frame 0, and then back on for
		 * frame 1. You can use the "visible" property to achieve the same effect.
		 *
		 *      var tween = createjs.Tween.get(target).to({_off:false})
		 *          .wait(1).to({_off:true})
		 *          .wait(1).to({_off:false});
		 *
		 * @property timeline
		 * @type Timeline
		 * @default null
		 */
		this.timeline = new createjs.Timeline(null, labels, {paused:true, position:startPosition, useTicks:true});
	
		/**
		 * If true, the MovieClip's position will not advance when ticked.
		 * @property paused
		 * @type Boolean
		 * @default false
		 */
		this.paused = false;
	
		/**
		 * If true, actions in this MovieClip's tweens will be run when the playhead advances.
		 * @property actionsEnabled
		 * @type Boolean
		 * @default true
		 */
		this.actionsEnabled = true;
	
		/**
		 * If true, the MovieClip will automatically be reset to its first frame whenever the timeline adds
		 * it back onto the display list. This only applies to MovieClip instances with mode=INDEPENDENT.
		 * <br><br>
		 * For example, if you had a character animation with a "body" child MovieClip instance
		 * with different costumes on each frame, you could set body.autoReset = false, so that
		 * you can manually change the frame it is on, without worrying that it will be reset
		 * automatically.
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
		this.frameBounds = this.frameBounds||null; // TODO: Deprecated. This is for backwards support of FlashCC
		
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
		
		
	// private properties:
		/**
		 * @property _synchOffset
		 * @type Number
		 * @default 0
		 * @private
		 */
		this._synchOffset = 0;
	
		/**
		 * @property _prevPos
		 * @type Number
		 * @default -1
		 * @private
		 */
		this._prevPos = -1; // TODO: evaluate using a ._reset Boolean prop instead of -1.
	
		/**
		 * @property _prevPosition
		 * @type Number
		 * @default 0
		 * @private
		 */
		this._prevPosition = 0;
	
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
	 * @method getLabels
	 * @return {Array}
	 * @deprecated
	 **/
	p.getLabels = function() {
		return this.timeline.getLabels();
	};
	
	/**
	 * Use the {{#crossLink "MovieClip/currentLabel:property"}}{{/crossLink}} property instead.
	 * @method getCurrentLabel
	 * @return {String}
	 * @deprecated
	 **/
	p.getCurrentLabel = function() {
		this._updateTimeline();
		return this.timeline.getCurrentLabel();
	};
	
	/**
	 * Use the {{#crossLink "MovieClip/duration:property"}}{{/crossLink}} property instead.
	 * @method getDuration
	 * @return {Number}
	 * @protected
	 **/
	p.getDuration = function() {
		return this.timeline.duration;
	};

	/**
	 * Returns an array of objects with label and position (aka frame) properties, sorted by position.
	 * Shortcut to TweenJS: Timeline.getLabels();
	 * @property labels
	 * @type {Array}
	 * @readonly
	 **/
	
	/**
	 * Returns the name of the label on or immediately before the current frame. See TweenJS: Timeline.getCurrentLabel()
	 * for more information.
	 * @property currentLabel
	 * @type {String}
	 * @readonly
	 **/
	
	/**
	 * Returns the duration of this MovieClip in seconds or ticks. Identical to {{#crossLink "MovieClip/duration:property"}}{{/crossLink}}
	 * and provided for Flash API compatibility.
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
			labels: { get: p.getLabels },
			currentLabel: { get: p.getCurrentLabel },
			totalFrames: { get: p.getDuration },
			duration: { get: p.getDuration }
		});
	} catch (e) {}


// public methods:
	/**
	 * Constructor alias for backwards compatibility. This method will be removed in future versions.
	 * Subclasses should be updated to use {{#crossLink "Utility Methods/extends"}}{{/crossLink}}.
	 * @method initialize
	 * @deprecated in favour of `createjs.promote()`
	 **/
	p.initialize = MovieClip; // TODO: Deprecated. This is for backwards support of FlashCC

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
		this._updateTimeline();
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
		// TODO: should we worry at all about clips who change their own modes via frame scripts?
		var independent = MovieClip.INDEPENDENT;
		if (this.mode != independent) { return; }
		
		var o=this, fps = o.framerate;
		while ((o = o.parent) && fps == null) {
			if (o.mode == independent) { fps = o._framerate; }
		}
		this._framerate = fps;
		
		var t = (fps != null && fps != -1 && time != null) ? time/(1000/fps) + this._t : 1;
		var frames = t|0;
		this._t = t-frames; // leftover time
		
		while (!this.paused && frames--) {
			this._prevPosition = (this._prevPos < 0) ? 0 : this._prevPosition+1;
			this._updateTimeline();
		}
	};
	
	/**
	 * MovieClip instances cannot be cloned.
	 * @method clone
	 **/
	p.clone = function() {
		// TODO: add support for this? Need to clone the Timeline & retarget tweens - pretty complex.
		throw("MovieClip cannot be cloned.")
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
		// prevent _updateTimeline from overwriting the new position because of a reset:
		if (this._prevPos == -1) { this._prevPos = NaN; }
		this._prevPosition = pos;
		this._t = 0;
		this._updateTimeline();
	};
	
	/**
	 * @method _reset
	 * @private
	 **/
	p._reset = function() {
		this._prevPos = -1;
		this._t = this.currentFrame = 0;
		this.paused = false;
	};
	
	/**
	 * @method _updateTimeline
	 * @protected
	 **/
	p._updateTimeline = function() {
		var tl = this.timeline;
		var synched = this.mode != MovieClip.INDEPENDENT;
		tl.loop = (this.loop==null) ? true : this.loop;
		
		var pos = synched ? this.startPosition + (this.mode==MovieClip.SINGLE_FRAME?0:this._synchOffset) : (this._prevPos < 0 ? 0 : this._prevPosition);
		var mode = synched || !this.actionsEnabled ? createjs.Tween.NONE : null;
		
		// pre-assign currentFrame so it is available to frame scripts:
		this.currentFrame = tl._calcPosition(pos);
		
		// update timeline position, ignoring actions if this is a graphic.
		tl.setPosition(pos, mode);

		this._prevPosition = tl._prevPosition;
		if (this._prevPos == tl._prevPos) { return; }
		this.currentFrame = this._prevPos = tl._prevPos;

		for (var n in this._managed) { this._managed[n] = 1; }

		var tweens = tl._tweens;
		for (var i=0, l=tweens.length; i<l; i++) {
			var tween = tweens[i];
			var target = tween._target;
			if (target == this || tween.passive) { continue; } // TODO: this assumes actions tween has this as the target. Valid?
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
			if (this._managed[id] == 1) {
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
			// TODO: this does not precisely match Flash. Flash loses track of the clip if it is renamed or removed from the timeline, which causes it to reset.
			if (child.mode == MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) { child._reset(); }
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
			this._updateTimeline();
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
	 * @method priority
	 * @private
	 **/
	MovieClipPlugin.priority = 100; // very high priority, should run first

	/**
	 * @method install
	 * @private
	 **/
	MovieClipPlugin.install = function() {
		createjs.Tween.installPlugin(MovieClipPlugin, ["startPosition"]);
	};
	
	/**
	 * @method init
	 * @param {Tween} tween
	 * @param {String} prop
	 * @param {String|Number|Boolean} value
	 * @private
	 **/
	MovieClipPlugin.init = function(tween, prop, value) {
		return value;
	};
	
	/**
	 * @method step
	 * @private
	 **/
	MovieClipPlugin.step = function() {
		// unused.
	};

	/**
	 * @method tween
	 * @param {Tween} tween
	 * @param {String} prop
	 * @param {String | Number | Boolean} value
	 * @param {Array} startValues
	 * @param {Array} endValues
	 * @param {Number} ratio
	 * @param {Object} wait
	 * @param {Object} end
	 * @return {*}
	 */
	MovieClipPlugin.tween = function(tween, prop, value, startValues, endValues, ratio, wait, end) {
		if (!(tween.target instanceof MovieClip)) { return value; }
		return (ratio == 1 ? endValues[prop] : startValues[prop]);
	};

}());
