(function() {

var SimpleButton = function(label, color) {
  this.initialize(label, color);
}

// inherit from Container:
var p = SimpleButton.prototype = new createjs.Container();

// define new properties on the subclass:
p._enabled = false;

// save the Container.initialize method so we can call it later:
p.Container_initialize = p.initialize;

// override the intialize method:
p.initialize = function(label, color) {
	// call the super class's (Container) initialize method:
	this.Container_initialize(); // This is VERY important!!
	
	// add all of our custom logic for SimpleButton:
	if (!label) { label = ""; }
	if (!color) { color = "#CCC"; }
	
	var text = new createjs.Text(label, "20px Arial", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
	
	var width = text.getMeasuredWidth()+20;
	var height = text.getMeasuredHeight()+20;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(color).drawRoundRect(0, 0, width, height, 10);
	
	text.x = width/2;
	text.y = 10;
	
	this.addEventListener("mouseover", this);
	this.addEventListener("mouseout", this);
	this.addChild(background, text); 
	this.setEnabled(true);
}

// define  new methods:
p.setEnabled = function(value) {
	this._enabled = this.mouseEnabled = value;
	if (value) {
		this.cursor = "pointer";
		this.alpha = 0.6; 
	} else {
		this.cursor = null;
		this.alpha = 0.25;
	}
}

p.handleEvent = function(evt) {
	this.alpha = (evt.type == "mouseover") ? 1 : 0.6;
}

window.SimpleButton = SimpleButton;
}());