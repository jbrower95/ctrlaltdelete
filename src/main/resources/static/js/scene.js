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
*					getHTML : function() {return ""}
*				};
*
*
*				The onPresent / onDestroy functions inherently give you access to the scene via the
*				'this' property. That is, their scope will dynamically change to be the scene at time of execution.
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
*			var scene = new Scene(function() {return '<p>SUP</p>'}, null, function() { console.log ("presented");}, null, manager);
*
*
*		Sample Usage w/ External JS File:
*
*			scenes/main.js
*				var exported_scene = {
*					preload: function() {
*						console.log("Lets load some assets!");
*					},
*					onPresent: function() {
*						console.log("Playing game!");
*					},
*					onDestroy: function() {
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
*					onPresent: function() {
*						console.log("Playing game!");
*					},
*					onDestroy: function() {
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
}

/**
*	Constructs a scene from a remote javascript file.
*
*		jsFile: The location of a scene javascript file 
*      sceneID: the id of the scene
*		Manager: The associated scene manager
*/
function Scene(jsFile, sceneID, onLoad) {

    var manager = SceneManager.getSharedInstance();

    console.log("[scene.js] Initializing scene: " + jsFile);
    var scene_reference = this;
	// dynamically load the dependent script using jquery
	$.getScript(jsFile).done($.proxy(function(){

		console.log("[scene.js] Loaded remote scene: " + jsFile);

		if (exported_scene == null) {
			console.log("[scene.js] Error: Couldn't load scene object from " + jsFile);
		}

		if (exported_scene["preload"]) {
            this.preload = exported_scene["preload"];
        }

		this.onPresent = exported_scene["onPresent"];
		this.onDestroy = exported_scene["onDestroy"];
		this.getHTML = exported_scene["getHTML"];

        exported_scene.scene = this;

        if (exported_scene["exportedVariables"]) {
            this.exportedVariables = {};
            jQuery.extend(this.exportedVariables, exported_scene["exportedVariables"]);
        }

		var isHTMLFile = /[^]*.html$/g;

        //isHTMLFile.exec() just runs the regular expression. This is not running arbitrary code.

		if (isHTMLFile.exec(this.getHTML()) != null) {
            console.log("[scene.js] Loading HTML from external file - " + this.getHTML());
			//we have to load this because it's the location of an html file.
			var container = document.createElement("div");
			$(jQuery(container)).load(this.getHTML(), $.proxy(function(response, status, xhr) {
                //this code is executed asynchronously

                if (status == "error") {
                    console.error("[scene.js] Remote load failed.");
                    return;
                }

                var results = container.innerHTML;
                this.getHTML = function() {return results};
                manager.registerScene(sceneID, this);
                if (onLoad != null) {
                    onLoad();
                }
            }, scene_reference));
            return;
		}

        //this happens synchronously
        manager.registerScene(sceneID, this);

        if (onLoad != null) {
            onLoad();
        }
	}, scene_reference)).fail($.proxy(function(){
		console.error("[scene.js] Couldn't load scene: " + jsFile + ". Experienced a network error.");
	}, scene_reference));
}

/**
 * Loads a scene, without burdening you with a reference to the scene.
 *
 * Constructor parameters are equivalent to the params for a scene.
 * @param jsFile
 * @param sceneID
 * @param manager
 */
Scene.load = function(jsFile, sceneID, onLoad) {
    new Scene(jsFile, sceneID, onLoad);
}


/**
 * Preloads the scene. This should always be called before presenting a scene,
 * as it allows phantom scenes to function.
 */
Scene.prototype.preload = function() {
    if (this.isPhantom()) {
        //copy over exported variables
        console.log("[scene.js] loading a phantom scene, copying variables from existing scene.");
        var manager = SceneManager.getSharedInstance();
        if (manager.activeScene && manager.activeScene.exportedVariables) {
            console.log("[scene.js] Variables copied.");
            jQuery.extend(this.exportedVariables, manager.activeScene.exportedVariables);
        } else {
            console.log("[scene.js] No variables were copied.");
        }
    }
};

/**
 * Returns true if the scene is a phantom scene. (has no HTML)
 * @returns {boolean}
 */
Scene.prototype.isPhantom = function() {

    if (this.getHTML == null) {
        console.log("[scene.js] [FATAL] scene didn't have a getHTML function.");
        return;
    }

    return (this.getHTML() == null);
}





