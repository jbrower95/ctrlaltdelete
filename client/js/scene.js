/**
*  A scene to be used with the scene manager. Offers several convenient ways
*  of constructing and manipulating a scene. Scenes contain HTML and are drawn by
*  displaying their associated HTML and executing their onPresent() methods.
*
*	Scenes can interact with their managers via the .manager property. 
*
*
*	TODO: The current model has some issues with scoping. That is, the javascript executed in an external model
*		  can't interact with the DOM of the supplied HTML. This needs to be fixed in order for the model to
*		  be viable.
*
*/

/**
*	External Usage:
*
*		To use the Scene(jsFile, manager) constructor, you must make a javascript file <jsFile> that:
*
*			- has a global variable of type object named 'exported_scene' that:
*				
*				var exported_scene = {
*					preload : function(){},
*					onPresent : function(){},
*					onDestroy : function(){},
*					html : ""
*				};
*
*		Sample Usage:
*			var manager = new SceneManager(...)
*			var scene = new Scene('scenes/main.js', manager);
*
*			or
*
*			var scene = new Scene('<p>SUP</p>', null, function() { console.log ("presented");}, null, manager);
*
*
*		Sample External JS File:
*
*			scenes/main.js
*				var exported_scene = {
*				
*					preload: function() {
*						console.log("Lets load some assets!");
*					},
*					onPresent: function() {
*						console.log("Playing game!");
*					},
*					onDestroy: function() {
*						console.log("All over!");
*					},
*					html: "<p>Hey there</p> <canvas id='game'></canvas>"
*				};
*
*
*/


/**
*   Constructs a new scene.
*
*		innerHTML: The HTML to be presented when the scene is displayed.
*		preload:   The function to be executed to preload the assets for this scene.
*		onPresent: The function to be executed when this scene is presented.
*		onDestroy: The function to be executed when the scene is about to be removed.
*		manager: The associated scenemanager
*
*
*/
function Scene(container, innerHTML, preload , onPresent, onDestroy, manager) {
	this.html = innerHTML;
	this.preload = preload;
	this.onPresent = onPresent;
	this.onDestroy = onDestroy;
	this.ready = true;
	this.manager = manager;
}

/**
*	Constructs a scene from a remote javascript file.
*
*		The contents of the javascript file must meet the spec above.
*
*		Manager: The associated scene manager
*/
function Scene(container, jsFile, manager) {

	this.manager = manager;
	this.ready = false;
	
	// dynamically load the dependent script using jquery
	$.getScript(jsFile).done(function(){

		console.log("Loaded remote scene: " + jsFile);

		if (exported_scene == null) {
			console.log("[Scene.js] Error: Couldn't load scene object from " + jsFile);
		}

		this.preload = exported_scene["preload"];
		this.onPresent = exported_scene["onPresent"];
		this.onDestroy = exported_scene["onDestroy"];
		this.html_element 
		this.ready = true;

	}).fail(function(){
		alert("Couldn't load scene: " + jsFile);
	});
}

/**
*	Gets the DOM element associated with this Scene.
*/
Scene.prototype.getHTMLElement = function() {




}


