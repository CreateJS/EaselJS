/**
 * Events feature.
 *
 * @author Jan Břečka
 * @link http://www.snekin.net
 */

(function(window)
{

	var EventDispatcher = function(target)
	{
		this.initialize(target);
	}
	
	var p = EventDispatcher.prototype;
	
	p.target = null;
	
	//-------------------------
	// public methods
	//-------------------------
	
	p.initialize = function(target)
	{
		this.target = target;
	}
	
	p.addEventListener = function(type, listener, useCapture, priority)
	{
		if (useCapture == undefined)
			useCapture = false;
		
		if (priority == undefined)
			priority = 0;
		
		EventManager.getInstance().addEventListener(this.getTarget(), type, listener, useCapture, priority);
	}
	
	p.hasEventListener = function(type)
	{
		return EventManager.getInstance().hasEventListener(this.getTarget(), type);
	}
	
	p.removeEventListener = function(type, listener)
	{
		EventManager.getInstance().removeEventListener(this.getTarget(), type, listener);
	}
	
	p.dispatchEvent = function(event)
	{
		if (event instanceof Event)
			EventManager.getInstance().dispatchEvent(this.getTarget(), event);
		else
			throw("event attribute must be an instance of Event class.");
	}
	
	//-------------------------
	// private methods
	//-------------------------
	
	/**
	 * @private
	 */
	
	p.getTarget = function()
	{
		return this.target == undefined ? this : this.target;
	}

window.EventDispatcher = EventDispatcher;
}(window));