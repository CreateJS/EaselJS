/*
* SVGExporter
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2014 gskinner.com, inc.
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


(function () {
	"use strict";

	/**
	 * <b>Note that this is an experimental feature, has not been thoroughly tested, and may undergo significant change.
	 * Use at your own risk.</b>
	 * 
	 * Exports an EaselJS Stage or Container to SVG. This works with most content types, including: Shape, Bitmap,
	 * Sprite, Container, MovieClip (current frame only) and Text.
	 * 
	 * There are a number of limitations, including:<ul>
	 * 	<li> arcTo is not supported yet
	 * 	<li> roundRect negative corner radii not supported
	 * 	<li> radial gradients are not totally accurate, and does not support gradients with r0 < r1
	 * 	<li> DOMElement is not supported
	 * 	<li> shadows and filters are not supported
	 * 	<li> paths without an initial moveTo may appear differently in SVG
	 * 	<li> blend modes (compositeOperation) are exported, but not supported in most browsers
	 * 	<li> vertical text positioning is approximate for textBaseline values other than "alphabetic"
	 * 	<li> bitmap fill repetition modes not supported
	 * </ul>
	 * 
	 * Different tools have different limitations for importing SVG. For example, we have noted the following issues
	 * in Adobe Illustrator CC: 
	 * <ul>
	 * 	<li> circular gradient are rendered improperly
	 * 	<li> bitmap fills are not imported correctly
	 * 	<li> nested masks cause problems (note that exported Sprites use masks)
	 * 	<li> blend modes are not supported
	 * 	<li> embedded images are poorly supported
	 * 	<li> if you re-link an image in the SVG, it will have an incorrect transformation set which will position the image off screen.
	 * </ul>
	 * For Adobe Illustrator, it is recommended that you use externally referenced images (embedImages & useCache set to false),
	 * and then ensure that the referenced images are in the correct relative path (see: imagePath) when you open the SVG file.
	 * @class SVGExporter
	 * @param {Container} target The Stage or Container instance to export.
	 * @constructor
	 **/
	var SVGExporter = function (target, width, height) {
		this.initialize(target, width, height);
	};
	var p = SVGExporter.prototype;
	
// shortcuts:
	var c = createjs;
	
// static:
	/**
	 * The SVG namespace.
	 * @property SVG_NS
	 * @static
	 * @type String
	 * @default "http://www.w3.org/2000/svg"
	 * @readonly
	 **/
	SVGExporter.SVG_NS = "http://www.w3.org/2000/svg";
	
	/**
	 * The xlink namespace.
	 * @property XLINK_NS
	 * @static
	 * @type String
	 * @default "http://www.w3.org/1999/xlink"
	 * @readonly
	 **/
	SVGExporter.XLINK_NS = "http://www.w3.org/1999/xlink";
	
	/**
	 * A lookup hash for supported blend modes.
	 * @property BLEND_MODES
	 * @static
	 * @type Object
	 * @readonly
	 **/
	SVGExporter.BLEND_MODES = {multiply:1, screen:1, overlay:1, darken:1, lighten:1, "color-dodge":1, "color-burn":1, "hard-light":1, "soft-light":1, difference:1, exclusion:1, hue:1, saturation:1, color:1, luminosity:1};
	
	/**
	 * A lookup hash mapping canvas text alignment values to SVG equivalents.
	 * @property ALIGN_MAP
	 * @static
	 * @type Object
	 * @readonly
	 **/
	SVGExporter.ALIGN_MAP = {start:"start", end:"end", left:"start", right:"end", center:"middle"};
	
	/**
	 * A lookup hash for getting the hex values of CSS color names.
	 * @property COLOR_NAMES
	 * @static
	 * @type Object
	 * @readonly
	 **/
	SVGExporter.COLOR_NAMES = {aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};
	
// properties:
	/**
	 * The resulting SVG node. This will be null until the exporter runs.
	 * @property svg
	 * @type SVGSVGElement
	 * @default null
	 **/
	p.svg = null; // result
	
	/**
	 * If true, display objects with visible=false will be included in the export.
	 * @property includeHidden
	 * @type boolean
	 * @default false
	 **/
	p.includeHidden = false;
	
	/**
	 * If true, then display objects with an active cache will be included as an embedded image. If false, the exporter
	 * will ignore the cache and export the display object normally.
	 * 
	 * Note that embedded images will greatly increase the file size of the resulting SVG, and that support for embedded
	 * images is scattered in many graphics tools.
	 * @property useCache
	 * @type boolean
	 * @default false
	 **/
	p.useCache = false;
	
	/**
	 * If true, then all images will be embedded into the SVG using a data url instead of referenced externally.
	 * 
	 * Note that embedded images will greatly increase the file size of the resulting SVG, and that support for embedded
	 * images is scattered in many graphics tools.
	 * @property embedImages
	 * @type boolean
	 * @default false
	 **/
	p.embedImages = false;
	
	/**
	 * If true, all colors will be converted into an RGB hex (ex #FF99CC) color and opacity value. This can improve
	 * compatibility with tools that don't support HLS, RGBA, or named colors.
	 * @property embedImages
	 * @type boolean
	 * @default true
	 **/
	p.normalizeColors = true;
	
	/**
	 * Allows you to specify a path that will be prepended to all image file names. If null, the original value of the
	 * image src attribute will be used. For example, setting it to "images/" would cause an image with a src of
	 * "http://mydomain.com/assets/image1.jpg" to be exported using a path of "images/image1.jpg".
	 * 
	 * Note that this can cause issues if you have multiple images with the same file name loaded from different paths.
	 * @property imagePath
	 * @type boolean
	 * @default true
	 **/
	p.imagePath = null;
	
	/**
	 * The width of the SVG element to create. If null, the exporter will use the width of the target's canvas. If there
	 * is no canvas, it will default to 1000px.
	 * @property width
	 * @type Number
	 * @default null
	 **/
	p.width = null;
	 
	/**
	 * The height of the SVG element to create. If null, the exporter will use the height of the target's canvas. If there
	 * is no canvas, it will default to 1000px.
	 * @property height
	 * @type Number
	 * @default null
	 **/
	p.height = null;
	
// private properties:
	p._target = null;
	p._defs = null;
	p._uids = null;
	p._mtx = null;
	p._embeddedImageSrcs = null;
	
// initialization:
	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function (target, width, height) {
		this._target = target;
		this.width = width;
		this.height = height;
		this._uids = {};
		this._embeddedImageSrcs = {};
	};

// public methods:
	/**
	 * Runs the export and returns the resulting SVG element.
	 * @method run
	 * @return {SVGSVGElement} The resulting SVG element.
	 **/
	p.run = function() {
		var target = this._target;
		var stage = target.getStage();
		var canvas = stage&&stage.canvas;
		this._mtx = target.getMatrix();
		var svg = this.svg = this.createNode("svg");
		svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", SVGExporter.XLINK_NS);
		var w = this.width || (canvas && canvas.width) || 1000;
		var h = this.height || (canvas && canvas.height) || 1000;
		this.setAttributes(svg, {width:w, height:h, style:"border: 1px solid black; overflow: hidden;"});
		this.appendChild(svg, this._defs = this.createNode("defs"));
		this.appendChild(svg, this.exportContainer(target));
		return svg;
	};

// semi-private methods, TODO: doc or rename?
	p.getUID = function(id) {
		if (this._uids[id] == null) {
			this._uids[id] = 0;
			return id;
		}
		return id+"_"+(++this._uids[id]);
	};
	
	p.createNode = function(name, attributes, parent) {
		return this.appendChild(parent, this.setAttributes(document.createElementNS(SVGExporter.SVG_NS, name), attributes));
	};
	
	p.setAttribute = function(el, attribute, value) {
		el&&el.setAttribute(attribute, value);
		return el;
	};
	
	p.setAttributes = function(el, attributes) {
		if (!el) { return el; }
		for (var n in attributes) { el.setAttribute(n, attributes[n]); }
		return el;
	};
	
	p.appendChild = function(parent, child) {
		if (child && parent) { parent.appendChild(child); }
		return child;
	};
	
	p.appendChildren = function(parent, children) {
		if (parent && children) { for (var i= 0,l=children.length; i<l; i++) { parent.appendChild(children[i]); } }
		return parent;
	};
	
	// makes it easy to override this to add unsupported types:
	p.exportElement = function(o) {
		if (!o.visible && !this.includeHidden) { return; }
		if (o.cacheCanvas && this.useCache) { return this.exportCache(o); }
		if (o instanceof c.Container) { return this.exportContainer(o); }
		if (o instanceof c.Bitmap) { return this.exportBitmap(o); }
		if (o instanceof c.Sprite) { return this.exportSprite(o); }
		if (o instanceof c.Text) { return this.exportText(o); }
		if (o instanceof c.Shape) { return this.exportShape(o); }
	};
	
	p.exportCache = function(o) {
		var img = this._getImage(o.cacheCanvas, "cache");
		if (!img) { return; }
		// don't forget cache offset & scale
		return this.exportCommon(img, o, "cache", o._cacheOffsetX, o._cacheOffsetY, o._cacheScale);
	};

	p.exportContainer = function(o) {
		var group = this.exportCommon(this.createNode("g"), o, "container");
		for (var i= 0, l=o.getNumChildren(); i<l; i++) {
			this.appendChild(group, this.exportElement(o.getChildAt(i)));
		}
		return group;
	};
	
	p.exportBitmap = function(o) {
		var img = this._getImage(o.image);
		if (!img) { return; }
		return this.exportCommon(img, o, "bitmap");
	};
	
	p.exportSprite = function(o) {
		var ss = o.spriteSheet;
		var frame = ss.getFrame(o.currentFrame);
		var r = frame.rect;
		var img = this._getImage(frame.image);
		if (!img) { return; }
		var sprite = this.exportCommon(img, o, "sprite", -r.x - frame.regX, -r.y - frame.regY);
		
		var id = this.getUID(sprite.id+"_mask");
		var mask = this.createNode("clipPath", {id:id});
		this.appendChild(mask, this.createNode("rect", {x: r.x, y: r.y, width: r.width, height: r.height}));
		this.appendChild(this._defs, mask);
		this.setAttribute(sprite, "clip-path", "url(#"+id+")");
		return sprite;
	};
	
	p.exportText = function(o) {
		var metrics = o.getMetrics(), lines = metrics.lines;
		var yOffset = o.textBaseline == "alphabetic" ? 0 : metrics.vOffset+metrics.lineHeight*0.9; // magic number
		var text = this.exportCommon(this.createNode("text"), o, "text", 0, yOffset);
		this.setAttribute(text, o.outline?"stroke":"fill", o.color);
		if (o.outline) {
			this.setAttribute(text, "stroke-width", o.outline );
			this.setAttribute(text, "fill", "none");
		}
		if (o.textAlign && o.textAlign != "left") {
			this.setAttribute(text, "text-anchor", SVGExporter.ALIGN_MAP[o.textAlign]);
		}
		var style = "font: "+o.font+";";
		this.setAttribute(text, "style", style);
		if (lines.length == 1) {
			text.textContent = lines.join("\r");
		} else {
			for (var i= 0, l=lines.length; i<l; i++) {
				var tspan = this.appendChild(text, this.createNode("tspan", {x:0, dy:i*metrics.lineHeight, dx:0}))
				tspan.textContent = lines[i];
			}
		}
		return text;
	};
	
	p.exportShape = function(o, mask) {
		var els = this.exportShapeElements(o, !!mask), shape;
		if (mask) {
			shape = this.appendChildren(mask, els);
		} else if (els.length > 1) {
			shape = this.appendChildren(this.createNode("g"), els);
		} else {
			shape =  els[0];
		}
		return this.exportCommon(shape, o, mask?false:"shape");
	};
	
	p.exportShapeElements = function(o, maskmode) {
		var q = o.graphics.getInstructions(), G = c.Graphics;
		var active = [], fill=null, stroke=null, strokeStyle=null, strokeDash=null, closed = false, els = [];
		
		for (var i= 0, l= q.length; i<l; i++) {
			var cmd = q[i], isStrokeOrPath = false;
			
			if (cmd instanceof G.Fill) {
				fill = cmd;
				isStrokeOrPath = closed = true;
			} else if (cmd instanceof G.Stroke) {
				stroke = cmd;
				isStrokeOrPath = closed = true;
			} else if (cmd instanceof G.StrokeStyle) {
				strokeStyle = cmd;
				isStrokeOrPath = closed = true;
			} else if (cmd instanceof G.StrokeDash) {
				strokeDash = cmd;
				isStrokeOrPath = closed = true;
			}
			
			if ((closed && !isStrokeOrPath) || i == l-1) {
				// end of a fill/stroke collection:
				var subElements = this.exportPathElements(active), el=null;
				if (maskmode) {
					els.push.apply(els, subElements);
				} else if (subElements.length == 1) {
					el = subElements[0];
				} else if (subElements.length > 1) {
					el = this.appendChildren(this.createNode("g"), subElements);
				}
				this.applyFillAndStroke(el, fill, stroke, strokeStyle, strokeDash);
				if (el) { els.push(el); }
				active.length = 0;
				closed = false; 
			}
			
			if (cmd instanceof G.BeginPath) { fill = stroke = null; }
			if (!isStrokeOrPath) { active.push(cmd); }
		}
		
		return els;
	};
	
	p.exportPathElements = function(arr) {
		var o, G = c.Graphics, path="", elements=[];
		for (var i= 0, l=arr.length; i<l; i++) {
			var cmd = arr[i], subPath = null;
			
			// shapes:
			if (cmd instanceof G.Rect) { o = this.createNode("rect", {x: cmd.x, y: cmd.y, width: cmd.w, height: cmd.h}); }
			else if (cmd instanceof G.Circle) { o = this.createNode("circle", {cx: cmd.x, cy: cmd.y, r: cmd.radius}); }
			else if (cmd instanceof G.Ellipse) { o = this.createNode("ellipse", {cx: cmd.x + cmd.w / 2, cy: cmd.y + cmd.h / 2, rx: cmd.w / 2, ry: cmd.h / 2}); }
			else if (cmd instanceof G.RoundRect) {
				if (cmd.radiusTL == cmd.radiusTR && cmd.radiusTL == cmd.radiusBR && cmd.radiusTL == cmd.radiusBL && cmd.radiusTL >= 0) { o = this.createNode("rect", {x: cmd.x, y: cmd.y, width: cmd.w, height: cmd.h, rx: cmd.radiusTL}); }
				else { o = this.exportRoundRect(cmd); }
			} else if (cmd instanceof G.PolyStar) { o = this.exportPolyStar(cmd); }
			
			// paths:
			else if (cmd instanceof G.MoveTo) { subPath = "M "+cmd.x+" "+cmd.y; }
			else if (cmd instanceof G.LineTo) { subPath = "L "+cmd.x+" "+cmd.y; }
			else if (cmd instanceof G.QuadraticCurveTo) { subPath = "Q "+cmd.cpx+" "+cmd.cpy+" "+cmd.x+" "+cmd.y; }
			else if (cmd instanceof G.BezierCurveTo) { subPath = "C "+cmd.cp1x+" "+cmd.cp1y+" "+cmd.cp2x+" "+cmd.cp2y+" "+cmd.x+" "+cmd.y; }
			else if (cmd instanceof G.ArcTo) { subPath = this.getArcTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.radius); }
			else if (cmd instanceof G.Arc) { subPath = this.getArc(cmd.x, cmd.y, cmd.radius, cmd.startAngle, cmd.endAngle, cmd.anticlockwise); }
			else if (cmd instanceof G.ClosePath && path) { subPath = "Z"; }
			
			// SVG doesn't like missing moveTos, canvas simply treats it as a move:
			if (subPath && !path && subPath[0] != "M") {
				subPath = "M "+(isNaN(cmd.x)?cmd.x2:cmd.x)+" "+(isNaN(cmd.y)?cmd.y2:cmd.y);
			}
			if (subPath) { path += subPath; }

			if (path && (!subPath || i==l-1)) {
				elements.push(this.createNode("path", {d:path}));
				path = "";
			}
			if (o) { elements.push(o); }
		}
		return elements;
	};
	
	p.exportRoundRect = function(cmd) {
		// TODO: negative corner radii:
		var tl = cmd.radiusTL, tr=cmd.radiusTR, br=cmd.radiusBR, bl=cmd.radiusBL, w=cmd.w, h=cmd.h;
		var path = "M "+cmd.x+" "+(cmd.y+tl)
			+ "a" + tl + "," + tl + " 0 0 1 " + tl + "," + (-tl)
			+ "h"+(w -tl-tr)
			+ "a" + tr + "," + tr + " 0 0 1 " + tr + "," + tr
			+ "v" + (h-tr-br)
			+ "a" + br + "," + br + " 0 0 1 " + (-br) + "," + br
			+ "h" + (-w+br+bl)
			+ "a" + bl + "," + bl + " 0 0 1 " + (-bl) + "," + (-bl)
			+ " z";
		return this.createNode("path", {d:path});
	};
	
	p.exportPolyStar = function(cmd) {
		var x = cmd.x, y = cmd.y;
		var radius = cmd.radius;
		var angle = (cmd.angle||0)/180*Math.PI;
		var sides = cmd.sides;
		var ps = 1-(cmd.pointSize||0);
		var a = Math.PI/sides;
		
		var path = "M "+(x+Math.cos(angle)*radius)+" "+(y+Math.sin(angle)*radius);
		for (var i=0; i<sides; i++) {
			angle += a;
			if (ps != 1) {
				path += " L "+(x+Math.cos(angle)*radius*ps)+" "+(y+Math.sin(angle)*radius*ps);
			}
			angle += a;
			path += " L "+(x+Math.cos(angle)*radius)+" "+(y+Math.sin(angle)*radius);
		}
		return this.createNode("path", {d:path+" Z"});
	};
	
	p.getArcTo = function(x1, y1, x2, y2, radius) {
		/// TODO: this is totally wrong. I believe we need to track the previous points for this to work.
		// "A "+radius+" "+radius+" 0 0 1 "+x2+" "+y2;
		// for now, we will just ignore arcTo:
		return "";
	};
	
	// this seems to be accurate, but could use more testing:
	p.getArc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
		var str = "", dA = endAngle-startAngle;
		
		if (Math.abs(dA) > Math.PI*2 && (anticlockwise == (dA < 0))) {
			return this.getArc(x,y,radius,0,Math.PI)+this.getArc(x,y,radius,Math.PI,0);
		}
		
		startAngle = this._normalizeAngle(startAngle);
		endAngle = this._normalizeAngle(endAngle);
		var startX = x + radius * Math.cos(startAngle);
		var startY = y + radius * Math.sin(startAngle);

		var endX = x + radius * Math.cos(endAngle);
		var endY = y + radius * Math.sin(endAngle);

		var a = (endAngle > startAngle) == (Math.abs(endAngle - startAngle) < Math.PI); // short dir is clockwise
		var large = a == !!anticlockwise;

		str += "M "+startX+" "+startY;
		str += "A "+radius+" "+radius+" 0 "+(large ? 1 : 0)+" "+(anticlockwise ? 0 : 1)+" "+endX+" "+endY;
		return str;
	};
	
	p.applyFillAndStroke = function(el, fill, stroke, strokeStyle, strokeDash) {
		if (stroke && stroke.ignoreScale) { this.setAttribute(el, "vector-effect", "non-scaling-stroke"); }
		return this.setAttribute(el, "style", this.getFillAndStrokeStyle(fill, stroke, strokeStyle, strokeDash));
	};
	
	p.getFillAndStrokeStyle = function(fill, stroke, strokeStyle, strokeDash) {
		var style = "";
		style += this._getFill(fill); // "fill:"+this._getFill(fill)+";";
		style += this._getFill(stroke, true); //"stroke:"+this._getFill(stroke, true)+";";
		if (stroke && strokeStyle) {
			if (strokeStyle.width != 1) { style += "stroke-width:"+strokeStyle.width+";"; }
			var caps = strokeStyle.caps == null ? "butt" : strokeStyle.caps;
			if (caps != "none") { style += "stroke-linecap:"+caps+";" }
			if (strokeStyle.joints && strokeStyle.joints != "miter") { style += "stroke-linejoin:"+strokeStyle.joints+";"; }
			else if (strokeStyle.miterLimit != 4) { style += "stroke-miterlimit:"+(strokeStyle.miterLimit?strokeStyle.miterLimit:10)+";"; }
			if (strokeDash) {
				style += "stroke-dasharray:" + strokeDash.segments.join(",") + ";";
				if (strokeDash.offset != 0) {
					style += "stroke-dashoffset:" + strokeDash.offset + ";";
				}
			}
		}
		return style;
	};
	
	p.setId = function(el, name, type) {
		this.setAttribute(el, "id", this.getUID(name||type||"element"));
	};
	
	p.exportCommon = function(el, o, idType, x, y, scale) {
		if (idType !== false) { this.setId(el, o.name, idType); }
		
		if (o.alpha != 1) { this.setAttribute(el, "opacity", o.alpha.toFixed(4)); }
		if (!o.visible) { this.setAttribute(el, "display", "none"); }
		
		// TODO: need to append this to style instead of overwriting:
		var blend = SVGExporter.BLEND_MODES[o.compositeOperation];
		if (blend) { this.setAttribute(el, "style", "mix-blend-mode:"+ o.compositeOperation); }
	
		this.addMask(el, o);
		
		scale = scale||1;
		var mtx = o.getMatrix(this._mtx);
		if (x || y || scale != 1) { mtx.append(1/scale,0,0,1/scale,x,y); }
		if (!mtx.isIdentity()) { this.setAttribute(el, "transform", this.exportMatrix(mtx)); }
		
		return el;
	};
	
	p.addMask = function(el, o) {
		if (!o.mask) { return el; }
		var id = this.getUID(el.id+"_mask");
		var mask = this.createNode("clipPath", {id:id});
		this.exportShape(o.mask, mask);
		this.appendChild(this._defs, mask);
		this.setAttribute(el, "clip-path", "url(#"+id+")");
		return el;
	};
	
	p.exportMatrix = function(mtx) {
		return "matrix("+[mtx.a.toFixed(4), mtx.b.toFixed(4), mtx.c.toFixed(4), mtx.d.toFixed(4), mtx.tx.toFixed(4), mtx.ty.toFixed(2)]+")";
	};
	

// private methods:
	p._getFill = function(fill, isStroke) {
		var label=isStroke?"stroke":"fill";
		if (!fill || !fill.style) { return label+":none;"; }
		var style = fill.style, props, id, o, col;
		
		if (typeof style == "string") {
			if (!this.normalizeColors) { return label+":"+style+";"; }
			col = this._normalizeColor(style);
			return label+":"+ col.color+";"+(col.opacity != 1 ? label+"-opacity:"+ col.opacity+";" : "");
		}
		if (fill.__svg_id) { return "url(#"+fill.__svg_id+")"; }
		if (props = style.props) {
			if (props.type == "linear") {
				id = this.getUID("linearGradient");
				o = this.appendChild(this._defs, this.createNode("linearGradient", {id:id, x1:props.x0, y1:props.y0, x2:props.x1, y2:props.y1, gradientUnits:"userSpaceOnUse"}));
				for (var i=0, l=props.colors.length; i<l; i++) {
					var color = props.colors[i], opacity = 1;
					if (this.normalizeColors) {
						col = this._normalizeColor(color);
						color = col.color;
						opacity = col.opacity;
					}
					this.appendChild(o, this.createNode("stop", {offset:props.ratios[i]*100+"%", "stop-color":color, "stop-opacity":opacity}));
				}
			} else if (props.type == "radial") {
				// TODO: doesn't work when r0 < r1
				// TODO: still doesn't seem super accurate
				id = this.getUID("radialGradient");
				var ratio = props.r0/props.r1;
				o = this.appendChild(this._defs, this.createNode("radialGradient", {id:id, cx:props.x1, cy:props.y1, fx:props.x0, fy:props.y0, r:props.r1, gradientUnits:"userSpaceOnUse"}));
				for (var i=0, l=props.colors.length; i<l; i++) {
					var color = props.colors[i], opacity = 1;
					if (this.normalizeColors) {
						col = this._normalizeColor(color);
						color = col.color;
						opacity = col.opacity;
					}
					this.appendChild(o, this.createNode("stop", {offset:(props.ratios[i]*(1-ratio)+ratio)*100+"%", "stop-color":color, "stop-opacity":opacity}));
				}
			} else if (props.type == "bitmap") {
				id = this.getUID("pattern");
				var img = this._getImage(props.image);
				if (!img) { return label+":none;"; }
				o = this.appendChild(this._defs, this.createNode("pattern", {id:id, width:props.image.width, height:props.image.height, patternUnits:"userSpaceOnUse"}));
				if (!isStroke && fill.matrix) { this.setAttribute(o, "patternTransform", this.exportMatrix(fill.matrix)); }
				this.appendChild(o, img);
			}
			
			if (id) {
				fill.__svg_id = id;
				return label+":url(#"+id+");";
			}
		}
	};
	
	p._getImage = function(image, name) {
		if (!image) { return; }
		var canvas, w = image.width, h=image.height, id=image.__svg_id || this._embeddedImageSrcs[image.src];
		if ((image instanceof HTMLImageElement && this.embedImages) || image instanceof HTMLVideoElement) {
			canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0);
			name = image instanceof HTMLVideoElement ? "video" : "embeddedImage"
		} else if (image instanceof HTMLImageElement) {
			var bmp = this.createNode("image", {width: w, height: h});
			bmp.setAttributeNS(SVGExporter.XLINK_NS, "xlink:href", this._getImageURL(image));
			return bmp;
		} else if (image instanceof HTMLCanvasElement) {
			name = "canvas";
			canvas = image;
		}
		
		if (canvas) {
			if (id == null) {
				id = this.getUID(name||"canvas");
				var bmp = this.createNode("image", {width: w, height: h, id:id});
				bmp.setAttributeNS(SVGExporter.XLINK_NS, "xlink:href", canvas.toDataURL());
				this.appendChild(this._defs, bmp);
				image.__svg_id = id;
				if (image.src) { this._embeddedImageSrcs[image.src] = id; }
			}
			var el = this.createNode("use");
			el.setAttributeNS(SVGExporter.XLINK_NS, "xlink:href", "#"+id);
			return el;
		}
	};
	
	p._getImageURL = function(image) {
		var src = image.getAttribute("src");
		if (this.imagePath == null || src.substr(0,5) == "data:") { return src; }
		return this.imagePath+src.substr(src.lastIndexOf("/")+1);
	};
	
	p._normalizeAngle = function(angle) {
		var pi2 = Math.PI * 2;
		return (angle%pi2+pi2)%pi2;
	};
	
// color normalization:
	p._normalizeColor = function(str) {
		var color, opacity = 1, match, str = str.toLowerCase();
		if (str.charAt(0) == "#") { color = str; }
		else if (color = SVGExporter.COLOR_NAMES[str]) {}
		else if (match = (/^(rgb|hsl)(a?)\(([\d\.\-\s,%]{5,})\)$/gm).exec(str)) {
			var vals = match[3].split(",");
			var isHSL = match[1] == "hsl";
			for (var i=0, l=vals.length; i<l; i++) {
				vals[i] = parseFloat(vals[i]) * (isHSL || vals[i].lastIndexOf("%") == -1 ? 1 : 255/100)
			}
			if (isHSL) { this._hslToRgb(vals); }
			if (match[2]) { opacity = vals[3]; }
			color = "#"+this._getHex(vals[0])+this._getHex(vals[1])+this._getHex(vals[2]);
		} else { color = "#000000"; }
		return {color:color, opacity:opacity};
	};
	
	p._normalizeVal = function(val, max) {
		return (val < 0) ? 0 : (val > max) ? max : val;
	};
	
	p._getHex = function(val) {
		val = this._normalizeVal(Math.round(val),255);
		return (val < 10 ? "0" : "")+val.toString(16);
	};
	
	p._hslToRgb = function(vals){
		var h = (vals[0]/360%1+1)%1;
		var s = this._normalizeVal(vals[1]/100,1);
		var l = this._normalizeVal(vals[2]/100,1);
		var r, g, b;
	
		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = this._hue2rgb(p, q, h + 1/3);
			g = this._hue2rgb(p, q, h);
			b = this._hue2rgb(p, q, h - 1/3);
		}
		vals[0] = r * 255;
		vals[1] = g * 255;
		vals[2] = b * 255;
	};
	
	p._hue2rgb = function(p, q, t){
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6) return p + (q - p) * 6 * t;
		if(t < 1/2) return q;
		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	};

	window.SVGExporter = SVGExporter;
})();
