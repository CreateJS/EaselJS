/**
 * Events feature.
 *
 * @author Jan Břečka
 * @link http://www.snekin.net
 */

(function(window)
{

	var Event = function(type, bubbles, cancelable)
	{
		if (bubbles == undefined)
			bubbles = false;
		
		if (cancelable == undefined)
			cancelable = false;
		
		this.initialize(type, bubbles, cancelable);
	}
	
	var p = Event.prototype;
	
	Event.ACTIVATE = "activate";
	
	Event.ADDED = "added";
		
	Event.CANCEL = "cancel";
		
	Event.CHANGE = "change";
	
	Event.CLOSE = "close";
		
	Event.COMPLETE = "complete";
		
	Event.CONNECT = "connect";
		
	Event.DEACTIVATE = "deactivate";
	
	Event.FINISH = "finish";
	
	Event.INIT = "init";
	
	Event.REMOVED = "removed";
	
	Event.SHOW = "show";
	
	Event.START = "start";
	
	Event.MOUSE_IN = "mouseIn";
	
	Event.MOUSE_LEAVE = "mouseLeave";
	
	//-------------------------
	// public properties
	//-------------------------
	
	p.type = "";
	p.bubbles = false;
	p.cancelable = false;
	p.target = null;
	p.currentTarget = null;
	
	//-------------------------
	// public methods
	//-------------------------
	
	p.initialize = function(type, bubbles, cancelable)
	{
		this.type = type;
		this.bubbles = bubbles;
		this.cancelable = cancelable;
	}
	
	p.clone = function()
	{
		return new Event(this.type);
	}
	
	p._isDefaultPrevented = false;
	
	p.isDefaultPrevented = function()
	{
		return this._isDefaultPrevented;
	}
	
	p.preventDefault = function()
	{
		this._isDefaultPrevented = true;
	}
	
	p.stopImmediatePropagation = function()
	{
		
	}
	
	p.stopPropagation = function()
	{
		
	}
	
	p.toString = function()
	{
		return "[Event (type=" + this.type + ")]";
	}

window.Event = Event;
}(window));