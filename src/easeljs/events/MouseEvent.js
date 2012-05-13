/**
 * Events feature.
 *
 * @author Jan Břečka
 * @link http://www.snekin.net
 */

(function(window)
{

	var MouseEvent = function(type, mouseX, mouseY, relatedObject)
	{
		this.initialize(type, mouseX, mouseY, relatedObject);
	}
	
	var p = MouseEvent.prototype = new Event();
	
	MouseEvent.CLICK = "click";
	
	MouseEvent.DOUBLE_CLICK = "doubleClick";
	
	MouseEvent.MIDDLE_CLICK = "middleClick";
	
	MouseEvent.MIDDLE_MOUSE_DOWN = "middleMouseDown";
	
	MouseEvent.MIDDLE_MOUSE_UP = "middleMouseUp";
	
	MouseEvent.MOUSE_DOWN = "mouseDown";
	
	MouseEvent.MOUSE_MOVE = "mouseMove";
	
	MouseEvent.MOUSE_OUT = "mouseOut";
	
	MouseEvent.MOUSE_OVER = "mouseOver";
	
	MouseEvent.MOUSE_UP = "mouseUp";
	
	MouseEvent.MOUSE_WHEEL = "mouseWheel";
	
	MouseEvent.RIGHT_CLICK = "rightClick";
	
	MouseEvent.RIGHT_MOUSE_DOWN = "rightMouseDown";
	
	MouseEvent.RIGHT_MOUSE_UP = "rightMouseUp";
	
	//-------------------------
	// public properties
	//-------------------------
	
	p.mouseX = null;
	p.mouseY = null;
	
	
	p.Event_initialize = p.initialize;
	
	//-------------------------
	// public methods
	//-------------------------
	
	p.initialize = function(type, mouseX, mouseY, relatedObject)
	{
		this.Event_initialize(type);
		
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		this.currentTarget = relatedObject;
	}
	
	p.clone = function()
	{
		return new MouseEvent(this.type, this.mouseX, this.mouseY, this.currentTarget);
	}
	
	p.toString = function()
	{
		return "[MouseEvent (type=" + this.type + ")]";
	}

window.MouseEvent = MouseEvent;
}(window));