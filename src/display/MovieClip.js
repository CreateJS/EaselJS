/**
 * @license MovieClip
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
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

import Container from "./Container";
import DisplayObject from "./DisplayObject";
import { Tween, Timeline } from "@createjs/tweenjs";

/**
 * The MovieClip class associates a TweenJS Timeline with an EaselJS {@link easeljs.Container}. It allows
 * you to create objects which encapsulate timeline animations, state changes, and synched actions. Due to the
 * complexities inherent in correctly setting up a MovieClip, it is largely intended for tool output and is not included
 * in the main EaselJS library.
 *
 * Currently MovieClip only works properly if it is tick based (as opposed to time based) though some concessions have
 * been made to support time-based timelines in the future.
 *
 * It is recommended to use `tween.to()` to animate and set properties (use no duration to have it set
 * immediately), and the `tween.wait()` method to create delays between animations. Note that using the
 * `tween.set()` method to affect properties will likely not provide the desired result.
 *
 * @memberof easeljs
 * @example <caption>Animate two shapes back and forth</caption>
 * let stage = new Stage("canvas");
 * Ticker.addEventListener("tick", stage);
 *
 * let mc = new MovieClip(null, 0, true, {start:20});
 * stage.addChild(mc);
 *
 * let child1 = new Shape(
 *   new Graphics().beginFill("#999999").drawCircle(30,30,30)
 * );
 * let child2 = new Shape(
 *   new Graphics().beginFill("#5a9cfb").drawCircle(30,30,30)
 * );
 *
 * mc.timeline.addTween(
 *   Tween.get(child1).to({x:0}).to({x:60}, 50).to({x:0}, 50)
 * );
 * mc.timeline.addTween(
 *   Tween.get(child2).to({x:60}).to({x:0}, 50).to({x:60}, 50)
 * );
 *
 * mc.gotoAndPlay("start");
 *
 * @extends easeljs.Container
 * @param {Object} [props] The configuration properties to apply to this instances.
 * This object will also be passed into the Timeline instance associated with this MovieClip.
 * See the documentation for Timeline for a list of supported props.
 */
export default class MovieClip extends Container {

	constructor (props) {
		super();
		!MovieClip.inited && MovieClip.init();

		/**
		 * Controls how this MovieClip advances its time. Must be one of 0 (INDEPENDENT), 1 (SINGLE_FRAME), or 2 (SYNCHED).
		 * See each constant for a description of the behaviour.
		 * @type {Number}
		 * @default 0
		 */
		this.mode = props.mode != null ? props.mode : MovieClip.INDEPENDENT;

		/**
		 * Specifies what the first frame to play in this movieclip, or the only frame to display if mode is SINGLE_FRAME.
		 * @type {Number}
		 * @default 0
		 */
		this.startPosition = props.startPosition != null ? props.startPosition : 0;

		/**
     * Specifies how many times this MovieClip should loop. A value of -1 indicates it should loop indefinitely. A value of
     * 1 would cause it to loop once (ie. play a total of twice).
     * @property loop
		 * @type {Number}
		 * @default -1
		 */
		if (typeof props.loop === "number") {
			this.loop = props.loop;
		} else if (props.loop === false) {
			this.loop = 0;
		} else {
			this.loop = -1;
		}

		/**
		 * The current frame of the movieclip.
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
     * Elements can be added and removed from the timeline by toggling an "_off" property
     * using the `tweenInstance.to()` method. Note that using `Tween.set` is not recommended to
     * create MovieClip animations. The following example will toggle the target off on frame 0, and then back on for
     * frame 1. You can use the "visible" property to achieve the same effect.
     *
     * @example
     * let tween = Tween.get(target).to({x:0}).to({x:100}, 30);
     * let mc = new MovieClip();
     * mc.timeline.addTween(tween);
     *
     * @example
     * Tween.get(target).to({_off:false})
     *   .wait(1).to({_off:true})
     *   .wait(1).to({_off:false});
     *
     * @type {easeljs.Timeline}
		 */
		this.timeline = new Timeline(Object.assign({ useTicks: true, paused: true }, props));

		/**
		 * If true, the MovieClip's position will not advance when ticked.
		 * @type {Boolean}
		 * @default false
		 */
		this.paused = props.paused != null ? props.paused : false;

		/**
		 * If true, actions in this MovieClip's tweens will be run when the playhead advances.
		 * @type {Boolean}
		 * @default true
		 */
		this.actionsEnabled = true;

		/**
		 * If true, the MovieClip will automatically be reset to its first frame whenever the timeline adds
		 * it back onto the display list. This only applies to MovieClip instances with mode=INDEPENDENT.
		 * <br><br>
		 * For example, if you had a character animation with a "body" child MovieClip instance
		 * with different costumes on each frame, you could set `body.autoReset = false`, so that
		 * you can manually change the frame it is on, without worrying that it will be reset
		 * automatically.
		 * @type {Boolean}
		 * @default true
		 */
		this.autoReset = true;

		/**
		 * An array of bounds for each frame in the MovieClip. This is mainly intended for tool output.
		 * @type {Array}
		 */
		this.frameBounds = this.frameBounds || props.frameBounds; // frameBounds are set on the prototype in Animate.

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
		 * passed into {@link easeljs.Stage#update}.
		 * @type {Number}
		 * @default null
		 */
		this.framerate = null;

		/**
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		this._synchOffset = 0;

		/**
		 * @type {Number}
		 * @default -1
		 * @private
		 */
		this._rawPosition = -1; // TODO: evaluate using a ._reset Boolean prop instead of -1.

		/**
		 * The time remaining from the previous tick, only applicable when .framerate is set.
		 * @type {Number}
		 * @private
		 */
		this._t = 0;

		/**
		 * List of display objects that are actively being managed by the MovieClip.
		 * @type {Object}
		 * @private
		 */
		this._managed = {};

		/**
		 * @type {Function}
		 * @private
		 */
		this._bound_resolveState = this._resolveState.bind(this);
	}

	static init () {
		if (MovieClip.inited) { return; }
		// plugins introduce some overhead to Tween, so we only install this if an MC is instantiated.
		MovieClipPlugin.install();
		MovieClip.inited = true;
	}

	// TODO: can we just proxy `get currentFrame` to timeline.position as well? Ditto for `get loop` (or just remove entirely).
	//
	/**
	 * Returns an array of objects with label and position (aka frame) properties, sorted by position.
	 * @see {@link tweenjs.Timeline#labels}
	 * @type {Array}
	 * @readonly
	 */
	get labels () {
		return this.timeline.labels;
	}

	/**
	 * Returns the name of the label on or immediately before the current frame.
	 * @see {@link tweenjs.Timeline#currentLabel}
	 * for more information.
	 * @type {String}
	 * @readonly
	 */
	get currentLabel () {
		return this.timeline.currentLabel;
	}

	 /**
 	 * Returns the duration of this MovieClip in seconds or ticks.
 	 * @see {@link tweenjs.Timeline#duration}
 	 * @type {Number}
 	 * @readonly
 	 */
 	get duration () {
		return this.timeline.duration;
	}

	/**
	 * Returns the duration of this MovieClip in seconds or ticks. Identical to {@link easeljs.MovieClip#duration}
	 * and provided for Adobe Flash/Animate API compatibility.
	 * @see {@link tweenjs.Timeline#duration}
	 * @type {Number}
	 * @readonly
	 */
	get totalFrames () {
		return this.duration;
	}

	isVisible () {
		// children are placed in draw, so we can't determine if we have content.
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
	}

	draw (ctx, ignoreCache) {
		// draw to cache first:
		if (this.drawCache(ctx, ignoreCache)) { return true; }
    this._updateState();
		super.draw(ctx, ignoreCache);
		return true;
	}

	/**
	 * Sets paused to false.
	 */
	play () {
		this.paused = false;
	}

	/**
	 * Sets paused to true.
	 */
	stop () {
		this.paused = true;
	}

	/**
	 * Advances this movie clip to the specified position or label and plays the timeline.
	 * @param {String | Number} positionOrLabel The animation name or frame number to go to.
	 */
	gotoAndPlay (positionOrLabel) {
		this.play();
		this._goto(positionOrLabel);
	}

	/**
	 * Advances this movie clip to the specified position or label and stops the timeline.
	 * @param {String | Number} positionOrLabel The animation or frame name to go to.
	 */
	gotoAndStop (positionOrLabel) {
		this.stop();
		this._goto(positionOrLabel);
	}

	/**
	 * Advances the playhead. This occurs automatically each tick by default.
	 * @param {Number} [time] The amount of time in ms to advance by. Only applicable if framerate is set.
	*/
	advance (time) {
		if (this.mode !== MovieClip.INDEPENDENT) { return; } // update happens in draw for synched clips
		// if this MC doesn't have a framerate, hunt ancestors for one:
		let o = this, fps = o.framerate;
		while ((o = o.parent) && fps === null) {
			if (o.mode === MovieClip.INDEPENDENT) { fps = o._framerate; }
		}
		this._framerate = fps;
		// calculate how many frames to advance:
		let t = (fps !== null && fps !== -1 && time !== null) ? time / (1000 / fps) + this._t : 1;
		let frames = t | 0;
		this._t = t - frames; // leftover time, save to add to next advance.

		while (!this.paused && frames--) {
			this._updateTimeline(this._rawPosition + 1, false);
		}
	}

	/**
	 * MovieClip instances cannot be cloned.
	 * @throws MovieClip cannot be cloned.
	 */
	clone () {
		// TODO: add support for this? Need to clone the Timeline & retarget tweens - pretty complex.
		throw "MovieClip cannot be cloned.";
	}

	_updateState () {
		if (this._rawPosition === -1 || this.mode !== MovieClip.INDEPENDENT) { this._updateTimeline(-1); }
	}

	_tick (evtObj) {
		this.advance(evtObj && evtObj.delta);
		super._tick(evtObj);
	}

	/**
	 * @param {String | Number} positionOrLabel The animation name or frame number to go to.
	 * @protected
	 */
	_goto (positionOrLabel) {
		let pos = this.timeline.resolve(positionOrLabel);
		if (pos == null) { return; }
		this._t = 0;
		this._updateTimeline(pos, true);
	}

	/**
	 * @private
	 */
	_reset () {
		this._rawPosition = -1;
		this._t = this.currentFrame = 0;
		this.paused = false;
	}

	/**
	 * @param {Number} rawPosition
	 * @param {Boolean} jump Indicates whether this update is due to jumping (via gotoAndXX) to a new position.
	 * @protected
	 */
	_updateTimeline (rawPosition, jump) {
		let synced = this.mode !== MovieClip.INDEPENDENT, tl = this.timeline;
		if (synced) { rawPosition = this.startPosition + (this.mode === MovieClip.SINGLE_FRAME ? 0 : this._synchOffset); }
		if (rawPosition < 1) { rawPosition = 0; }
		if (this._rawPosition === rawPosition && !synced) { return; }
		this._rawPosition = rawPosition;

		// update timeline position, ignoring actions if this is a graphic.
		tl.loop = this.loop; // TODO: should we maintain this on MovieClip, or just have it on timeline?
		tl.setPosition(rawPosition, synced || !this.actionsEnabled, jump, this._bound_resolveState);
	}

	/**
	 * Renders position 0 without running actions or updating _rawPosition.
	 * Primarily used by Animate CC to build out the first frame in the constructor of MC symbols.
	 * NOTE: not tested when run after the MC advances past the first frame.
	 * @protected
	 */
	_renderFirstFrame () {
		const tl = this.timeline, pos = tl.rawPosition;
		tl.setPosition(0, true, true, this._bound_resolveState);
		tl.rawPosition = pos;
	}

	/**
	 * Runs via a callback after timeline property updates and before actions.
	 * @protected
	 */
	_resolveState () {
		let tl = this.timeline;
		this.currentFrame = tl.position;

		for (let n in this._managed) { this._managed[n] = 1; }

		let tweens = tl.tweens;
		for (let tween of tweens) {
			let target = tween.target;
			if (target === this || tween.passive) { continue; } // TODO: this assumes the actions tween from Animate has `this` as the target. Likely a better approach.
			let offset = tween._stepPosition;

			if (target instanceof DisplayObject) {
				// motion tween.
				this._addManagedChild(target, offset);
			} else {
				// state tween.
				this._setState(target.state, offset);
			}
		}

		let kids = this.children;
		for (let i=kids.length-1; i>=0; i--) {
			let id = kids[i].id;
			if (this._managed[id] === 1) {
				this.removeChildAt(i);
				delete(this._managed[id]);
			}
		}
	}

	/**
	 * @param {Array} state
	 * @param {Number} offset
	 * @protected
	 */
	_setState (state, offset) {
		if (!state) { return; }
		for (let i = state.length - 1; i >= 0; i--) {
			let o = state[i];
			let target = o.t;
			let props = o.p;
			for (let n in props) { target[n] = props[n]; }
			this._addManagedChild(target, offset);
		}
	}

	/**
	 * Adds a child to the timeline, and sets it up as a managed child.
	 * @param {easeljs.MovieClip} child The child MovieClip to manage
	 * @param {Number} offset
	 * @private
	 */
	_addManagedChild (child, offset) {
		if (child._off) { return; }
		this.addChildAt(child, 0);

		if (child instanceof MovieClip) {
			child._synchOffset = offset;
			// TODO: this does not precisely match Adobe Flash/Animate, which loses track of the clip if it is renamed or removed from the timeline, which causes it to reset.
      // TODO: should also reset when MovieClip loops, though that will be a bit tricky to detect.
			if (child.mode === MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) { child._reset(); }
		}
		this._managed[child.id] = 2;
	}

	/**
	 * @param {easeljs.Matrix2D} matrix
	 * @param {Boolean} ignoreTransform
	 * @return {easeljs.Rectangle}
	 * @protected
	 */
	_getBounds (matrix, ignoreTransform) {
		let bounds = this.getBounds();
		if (!bounds && this.frameBounds) { bounds = this._rectangle.copy(this.frameBounds[this.currentFrame]); }
		if (bounds) { return this._transformBounds(bounds, matrix, ignoreTransform); }
		return super._getBounds(matrix, ignoreTransform);
	}

}

/**
 * The MovieClip will advance independently of its parent, even if its parent is paused.
 * This is the default mode.
 * @static
 * @type {String}
 * @default independent
 * @readonly
 */
MovieClip.INDEPENDENT = "independent";
/**
 * The MovieClip will only display a single frame (as determined by the startPosition property).
 * @static
 * @type {String}
 * @default single
 * @readonly
 */
MovieClip.SINGLE_FRAME = "single";
/**
 * The MovieClip will be advanced only when its parent advances and will be synched to the position of
 * the parent MovieClip.
 * @static
 * @type {String}
 * @default synched
 * @readonly
 */
MovieClip.SYNCHED = "synched";
/**
 * Has the MovieClipPlugin been installed to TweenJS yet?
 * @static
 * @type {Boolean}
 * @default false
 * @readonly
 */
MovieClip.inited = false;

/**
 * This plugin works with <a href="http://tweenjs.com" target="_blank">TweenJS</a> to prevent the startPosition property from tweening.
 * @todo update to new plugin model
 * @static
 * @inner
 */
class MovieClipPlugin {

	constructor () {
		throw "MovieClipPlugin cannot be instantiated.";
	}

	/**
	 * @private
	 */
	static install () {
		Tween.installPlugin(MovieClipPlugin);
	}

	/**
	 * @param {tweenjs.Tween} tween
	 * @param {String} prop
	 * @param {String|Number|Boolean} value
	 * @private
	 */
	static init (tween, prop, value) {
		return value;
	}

	/**
	 * @param {tweenjs.Tween} tween
	 * @param {String} prop
	 * @param {String | Number | Boolean} value
	 * @param {Array} startValues
	 * @param {Array} endValues
	 * @param {Number} ratio
	 * @param {Object} wait
	 * @param {Object} end
	 * @return {*}
	 */
	static tween (tween, prop, value, startValues, endValues, ratio, wait, end) {
		if (!(tween.target instanceof MovieClip)) { return value; }
		return (ratio === 1 ? endValues[prop] : startValues[prop]);
	}

}

/**
 * @static
 * @type {Number}
 * @default 100
 * @readonly
 */
MovieClipPlugin.priority = 100;
