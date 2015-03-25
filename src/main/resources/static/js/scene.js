/**
*  A scene to be used with the scene manager. Offers several convenient ways
*  of constructing and manipulating a scene. Scenes contain HTML and are drawn by
*  displaying their associated HTML and executing their onPresent() methods.
*
*	- Scenes that DONT contain HTML simply inherit their html from the active scene at the time of presentation.
*
*			- These scenes also inherit the exportedVariables property of the active scene. 
*			- Consequently, scenes which plan to be extended by 'phantom' scenes (scenes without HTML content)
*			should place their relevant variables / references in this exportedVariables dictionary.
*
*	- Scenes can interact with their managers via the .manager property. 
*
*	Scenes can find elements in their content box by using 'searchContent(id)', which is equivalent
*	to a jQuery .find() call on their outer __scene__ box.
*
*
*
*
*
*
*	External Usage:
*
*		To use the Scene(jsFile, manager) constructor, you must make a javascript file <jsFile> that:
*
*			- has a global variable of type object named 'exported_scene' that:
*				
*				var exported_scene = {
*					preload : function(scene){},
*					onPresent : function(scene){},
*					onDestroy : function(scene){},
*					getHTML : function() {return ""}
*				};
*
*
*				The onPresent / onDestroy functions give you access to the scene, so that you can make calls within the context of the scene.
*				
*				*.preload: this function is called by the scene manager to tell the scene to get ready for its
*						 appearance. Any assets that need to be cached / preloaded should be downloaded.
*
*				*.onPresent: called by the scene manager immediately after the scene is shown on screen.
*
*				*.onDestroy: called by the scene manager right before the scene is removed
*
*				*.getHTML: returns the HTML content for the page. Alternatively, this can return the name
*						 of an HTML file that the scene will load automatically in its constructor. If this is 
*						 ommitted, the existing scene will be used, and ownership will be transferred to this scene object.
*				
*				
*				(* = optional)
*
*
*						ex: function() { return "main.html" }   ||   function() { return "<body> Ey yo! this is the scene. </body>"}
*
*		Sample Internal Usage:
*			var manager = new SceneManager(...)
*			var scene = new Scene('scenes/main.js', manager);
*
*			or
*
*			var scene = new Scene(function() {return '<p>SUP</p>'}, null, function(scene) { console.log ("presented");}, null, manager);
*
*
*		Sample Usage w/ External JS File:
*
*			scenes/main.js
*				var exported_scene = {
*					preload: function() {
*						console.log("Lets load some assets!");
*					},
*					onPresent: function(scene) {
*						console.log("Playing game!");
*					},
*					onDestroy: function(scene) {
*						console.log("All over!");
*					},
*					getHTML: function() { return "<p>Hey there</p> <canvas id='game'></canvas>"}
*				};
*			
*			scenes/mainExternal.js
*				var exported_scene = {
*					preload: function() {
*						console.log("Lets load some assets!");
*					},
*					onPresent: function(scene) {
*						console.log("Playing game!");
*					},
*					onDestroy: function(scene) {
*						console.log("All over!");
*					},
*					getHTML: function() { return "main.html"}
*				};
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
*/
function Scene(innerHTML, preload , onPresent, onDestroy, manager) {
	this.html = innerHTML;
	this.preload = preload;
	this.onPresent = onPresent;
	this.onDestroy = onDestroy;
	this.manager = manager;
	this.exportedVariables = {};
	this.ready = true;
}

/**
*	Constructs a scene from a remote javascript file.
*
*		jsFile: The location of a scene javascript file 
*
*		Manager: The associated scene manager
*/
function Scene(jsFile, manager) {

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
		this.html = exported_scene["getHTML"]();
		this.exportedVariables = {};

		if (this.html == null) {
			console.log("[Scene.js] loading a phantom scene, copying variables from existing scene.");
			this.exportedVariables = manager.activeScene.exportedVariables;
			return;
		}

		var isHTMLFile = /[^]*.html$/g;

		if (isHTMLFile.exec(this.html) != null) {
			//we have to load this because it's the location of an html file.
			var container = document.createElement("div");
			$(jQuery(container)).load(this.html);
			this.html = container.innerHTML;
		}

		this.ready = true;

	}).fail(function(){
		console.log("[Scene.js] Couldn't load scene: " + jsFile ". Experienced a network error.");
	});

}







