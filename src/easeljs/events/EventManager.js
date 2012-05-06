/**
 * Events feature.
 *
 * @author Jan Břečka
 * @link http://www.snekin.net
 */

(function(window)
{

	var EventManager = function()
	{
		this.initialize();
	}
	
	var p = EventManager.prototype;
	
	EventManager.instance = null;
	
	EventManager.getInstance = function()
	{
		if (EventManager.instance == null)
			EventManager.instance = new EventManager();
		
		return EventManager.instance;
	}
	
	p.objectsMap = new Array();
	
	p.initialize = function()
	{
		
	}
	
	p.addEventListener = function(dispatcher, type, listener, useCapture, priority)
	{
		// TODO useCapture and bubbling
		this.objectsMap.push( [dispatcher, type, listener, priority] );
		
		this.sortListenersByPriority();
	}
	
	p.hasEventListener = function(dispatcher, type)
	{
		for (var i = 0; i < this.objectsMap.length; i++)
		{
			if (this.objectsMap[i][1] == type && this.objectsMap[i][0] == dispatcher)
				return true;
		}
		
		return false;
	}
	
	p.removeEventListener = function(dispatcher, type, listener)
	{
		for (var i = 0; i < this.objectsMap.length; i++)
		{
			if (this.objectsMap[i][1] == type &&
				this.objectsMap[i][0] == dispatcher &&
				this.objectsMap[i][2] == listener)
			{
				this.objectsMap.splice(i, 1);
				return;
			}
		}
	}
	
	p.dispatchEvent = function(dispatcher, event)
	{
		for (var i = 0; i < this.objectsMap.length; i++)
		{
			if (this.objectsMap[i][1] == event.type && this.objectsMap[i][0] == dispatcher)
			{
				var dispatchedEvent = event.clone();
					dispatchedEvent.target = dispatcher;
				
				if (dispatchedEvent.currentTarget == null)
					dispatchedEvent.currentTarget = dispatcher;
				
				this.objectsMap[i][2]( dispatchedEvent );
			}
		}
	}
	
	
	p.sortListenersByPriority = function()
	{
		this.objectsMap.sort(function(a, b)
		{
			if (a[3] < b[3])
				return 1;
			else if (a[3] > b[3])
				return -1;
			
			return 0;
		});
	}

window.EventManager = EventManager;
}(window));