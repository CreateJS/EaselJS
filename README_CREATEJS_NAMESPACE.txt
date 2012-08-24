In this version of CreateJS class definitions reside in a "createjs" namespace by default.

For example, instead of instantiating a Shape like this:
var foo = new Shape();

You will need to reach into the createjs namespace:
var bar = new createjs.Shape();

This functionality is configurable though. You can easily shortcut the namespace or get rid of it completely.

To shortcut the namespace, just point a different variable at createjs it is loaded:
<script src="easeljs.js"></script>
<script>
var c = createjs; // creates a reference to the createjs namespace in "c"
var foo = new c.Shape();
</script>

To remove the namespace, just point the createjs variable at the window before loading the libraries:
<script>
var createjs = window; // sets window as the createjs namespace (the object the classes will be defined in)
</script>
<script src="easeljs.js"></script>

This will also make CreateJS libraries compatible with old content that did not use a namespace, such as the output from the Flash Pro Toolkit for CreateJS v1.0.