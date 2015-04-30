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
*	- Scenes can interact with the shared manager by using the singleton SceneManager.getSharedInstance()
*
*	Scenes can find elements in their content box by using 'searchContent(id)', which is equivalent
*	to a jQuery .find() call on their outer __scene__ box.
*
*
*	Scene Usage:
*
 *      Scenes should be loaded using the class method 'Scene.load()'. This is
 *      the preferred way of loading scenes.
 *
 *      Usage:
 *
 *          Scene.load(jsFile, onLoad)
 *
 *              jsFile: The javascript file containing an exported scene. *required
 *             onLoad: Once the scene has been registered with the shared scenemanager,
 *                     this function will be called in the context of the scene object.
 *                     onLoad is an optional parameter.
 *
 *      Placing scenes in external files:
 *
 *          In order to facilitate development, you can place your scenes in
 *          external javascript files. These files must have atleast
 *
*			-  a global variable of type object named 'exported_scene' like the below:
*				
*				var exported_scene = {
*			            id : "exported scene 1",
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
*			!	    id: The unique id of the string. This can be anything that fits in a hashtable.
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
*			        id : "main scene",
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
*			        id : "other scene",
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
 *
 *
 *	        For a exported_scene to get a reference to its corresponding scene object
 *          (or to the SceneManager), it can simply call on
 *
 *          SceneManager.getSharedInstance() (and subsequently the activeScene property)
 *
 *          var myScene = SceneManager.getSharedInstance().activeScene;
 *          //do something
 *
 *
 *          If a scene is a phantom scene (that is, the getHTML() function returns null), it is inherently assuming something
 *          about it's context. To make sure that the phantom scene knows what its display context will be, it can add a
 *
 *          'requires'
 *
 *          tag to indicate that the specified scene must precede it. In the case of arbitrarily jumping to this scene, if the required scene
 *          is not currently being presented, then a chain of required scenes will be presented and then immediately changed to simulate the flow of time, up to the
 *          requested scene.
 *
 *          EX: Consider the three following scenes.
 *
 *
 *          { id: 'main', getHTML : function() { return 'index.html' } }
 *
 *
 *          { id: 'secondary', getHTML : function() { return null }, requires : 'main' }
 *
 *
 *          { id: 'third', getHTML: function() { return null }, requires : 'secondary' }
 *
 *
 *
 *          If 'main' is currently being displayed, and the scenemanager requests a jump to 'third', what should happen?
 *          Jumping directly to third would leave third with the impression that 'secondary' had been loaded before it, when in fact it hadn't.
 *
 *          In this case, the scene manager will trace back the 'requires' path to the first non phantom scene (the first independent scene) and then
 *          automatically trigger transitions.
 *
 *          In this particular example, 'secondary' will be displayed, and then immediately after 'third' will be displayed.
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
*/
function Scene(innerHTML, preload , onPresent, onDestroy) {
	this.html = innerHTML;
	this.preload = preload;
	this.onPresent = onPresent;
	this.onDestroy = onDestroy;
	this.exportedVariables = {};
}

/**
*	Constructs a scene from a remote javascript file.
*
*		jsFile: The location of a scene javascript file
*		Manager: The associated scene manager
*/
function Scene(jsFile, onLoad) {

    var manager = SceneManager.getSharedInstance();
    this.exportedVariables = {};
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
        this.preload = (exported_scene['preload'] || this.preload);
        this.id = exported_scene["id"];

        if (this.isPhantom()) {
            
            if (!exported_scene["requires"]) {
                console.error("[scene.js] ERROR/fatal: Loading of scene " + this.id + " failed - A phantom scene must have a 'requires' field.");
                return;
            }

            this.requires = exported_scene["requires"];
        }

        if (!this.id) {
            console.error("[scene.js] ERROR/fatal: The scene in " + jsFile + " is missing an id.");
        }

        exported_scene.scene = this;

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
                manager.registerScene(this);
                if (onLoad != null) {
                    onLoad();
                }
            }, scene_reference));
            return;
		}

        //this happens synchronously
        manager.registerScene(this);

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
Scene.load = function(jsFile, onLoad) {
    new Scene(jsFile, onLoad);
}


/**
 * Preloads a phantom scene. This should always be called before presenting a scene,
 * as it allows phantom scenes to function.
 */
Scene.prototype.preloadPhantom = function() {
    if (this.isPhantom()) {
        //copy over exported variables
        console.log("[scene.js] loading a phantom scene, copying variables from existing scene.");
        var manager = SceneManager.getSharedInstance();
        if (manager.activeScene && manager.activeScene.exportedVariables) {
            console.log("[scene.js] Variables copied.");
            console.log("[scene.js] Variables to add: ");
            console.log(manager.activeScene.exportedVariables);
            if (!this.exportedVariables) {
                this.exportedVariables = {};
            }
            $.extend(this.exportedVariables, manager.activeScene.exportedVariables);
            console.log("[scene.js] New variable list: ");
            console.log(this.exportedVariables);
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
    return (this.getHTML == null || this.getHTML() == null);
}





