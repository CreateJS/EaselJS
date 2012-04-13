(function(window) {

    function SimpleBall(p_color, p_radius) {
        this.oldX = 0;
        this.oldY = 0;
        this.radius = p_radius
        this.scale = 1;
        this.selectedColor = p_color;
        this.initialize();


    }

    SimpleBall.prototype = new Container();

    SimpleBall.prototype.vx = 0;
    SimpleBall.prototype.vy = 0;
    SimpleBall.prototype.inner;
    SimpleBall.prototype.selectedColor;
    SimpleBall.prototype.oldX;
    SimpleBall.prototype.oldY;
    SimpleBall.prototype.radius;
    SimpleBall.prototype.scale;
    SimpleBall.prototype.bounce;
    SimpleBall.prototype.s;

    SimpleBall.prototype.Container_initialize = SimpleBall.prototype.initialize;

    SimpleBall.prototype.initialize = function() {
        this.Container_initialize();
        this.s = this.getSprite();
        this.addChild(this.s);
    }

    SimpleBall.prototype.changeColor = function () {
        this.s.graphics.clear();
        var g = this.s.graphics;
        g.setStrokeStyle(5, 'round', 'round');
        g.beginStroke(Graphics.getRGB('#000000'));
        g.beginFill(this.selectedColor);
        g.drawCircle(0, 0, this.radius);
        g.moveTo(0,0);
        g.lineTo(0, this.radius);
        g.endStroke();
        g.endFill();
    }

    SimpleBall.prototype.getSprite = function() {
        var s = new Shape();
        var g = s.graphics;
        g.setStrokeStyle(1);
        g.beginFill(this.selectedColor);
        g.drawCircle(0, 0, this.radius);
        g.endFill();
        return s;
    }

    window.SimpleBall = SimpleBall;
}(window));