(function(window) {

    function Segment(segWidth, segHeight, selectedColor) {

        this.segWidth = segWidth;
        this.segHeight = segHeight;
        this.selectedColor = selectedColor;

        this.vy = 0;
        this.vx = 0;

        this.initialize();

    }

    Segment.prototype = new createjs.Container();

    Segment.prototype.selectedColor;
    Segment.prototype.vx;
    Segment.prototype.vy;
    Segment.prototype.segHeight;
    Segment.prototype.segWidth;


    Segment.prototype.Container_initialize = Segment.prototype.initialize;

    Segment.prototype.initialize = function() {
        this.Container_initialize();
        this.inner = this.getSprite();
        this.addChild(this.inner);
        this.shadow = new createjs.Shadow('#000000', 1, 1, 5);
        //this.renderer();
    }

    Segment.prototype.getSprite = function() {
        var s = new createjs.Shape();
        var g = s.graphics;
        g.setStrokeStyle(0);
        //g.beginStroke(Graphics.getRGB(0,0,0));
        g.beginFill(this.selectedColor);
        var _x = -this.segHeight/2;
        var _y = -this.segHeight/2;
        var _w = this.segWidth + this.segHeight;
        var _h = this.segHeight;
        var tl = this.segHeight;
        var tr = this.segHeight;
        var br = this.segHeight;
        var bl = this.segHeight;
        g.endStroke();
        g.drawRoundRectComplex(_x, _y, _w, _h, tl/2, tr/2, br/2, bl/2);
        g.endFill();
        g.beginStroke(createjs.Graphics.getRGB(0,0,0));
        g.drawCircle(0, 0, 2);
        g.endStroke();
        g.beginStroke(createjs.Graphics.getRGB(0,0,0));
        g.drawCircle(this.segWidth, 0, 2);
        g.endStroke();



        return s;
    }

    Segment.prototype.getPoint = function () {

        var angle = this.rotation * Math.PI / 180;
        return new createjs.Point(this.x + Math.cos(angle)*this.segWidth, this.y + Math.sin(angle)*this.segWidth);
    }
    window.Segment = Segment;
}(window));