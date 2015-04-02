/** SceneManager:
  *
  *		A very simple HTML-injection based scene transition manager
  *		written in javascript. This allows for games to be made in a 
  *		compartmentalized way, without focusing on transitions or game flow.
  *
  *		To avoid redundant HTML / possible unsmooth 'scene' transitions, you can omit the HTML of a scene
  *		and the HTML of the last scene will be used. This allows you to still have discrete scenes, but 
  *		also ones that are non-destructive.
  *
  *		The scene manager maintains a map of scene names to Scene objects (scene.js). The scene
  *		manager then invokes the correct javascript and handles scope by passing around Scene instances.
  *
  *		Relies On:
  *				- jQuery (1.6+)
  *
  *
  *		Instance Methods:
  *			  # Presents a scene object with the given scene ID.
  *			- (void) presentScene(SceneID)
  *
  *					
  *			  # Preloads a scene. This is essentially moot until Web Workers
  * 		  # are implemented for background loading.
  *			- (void) loadScene(Scene scene)
  *		
  *		Constructors:
  *
  *			  # SceneManager(contentDivID, scenes)
  *			  [see below for documentation]
  *
  */

// tiny JQuery extension to check to see if an element exists
$.fn.exists = function () {
    return this.length !== 0;
};


/*
*	Constructs a new SceneManager
*
*		contentDiv - The div in which the scene manager should place its
*					content. This is the ID of the div. 
*
*					If: 
*						- a div with this id does not exist, one will be created
*						- a div with this id DOES exist, and the class is set to 
							'__stage__', its contents will be cleared and reused by the scene manager.
*						- a NON DIV element with this id exists, an error will be written to the console.
*
*		scenes:
*				A map whose keys are scene names (e.g "intro") and values are
*				valid 'Scene' objects.
*
*		initialScene:
*				The initial scene to load. 
*/
function SceneManager(contentDivID) {

        console.log("[scenemanager.js] Initializing scene manager...");

		var existingDiv = document.getElementById(contentDivID);

		if (existingDiv == null) {
			//create a div
			this.contentDiv = document.createElement("div");
			this.contentDiv.className = "__stage__";
			document.body.appendChild(this.contentDiv);
		} else {
			// is it a div
			if (existingDiv.className == "__stage__" && existingDiv.tagName == "DIV") {
				//we found love in a hopeless place
				this.contentDiv = existingDiv;
			} else {
				console.log("[scenemanager.js] Error: Couldn't load content div - tag must be a div and class must be __stage__");
				// to avoid getting into sticky situations, refuse to load the scenes.
				return;
			}
		}

        this.scenes = {};
        console.log("[scenemanager.js] SceneManager setup complete.");
}

//the singleton scene manager
var _____SCENEMANAGER = null;

SceneManager.initialize = function(div) {
    _____SCENEMANAGER = new SceneManager(div);
};

SceneManager.getSharedInstance = function() {
    return _____SCENEMANAGER;
};



SceneManager.prototype.registerScene = function(sceneID, scene) {
	if (this.scenes[sceneID] != null) {
		console.log("[Scene.js: NONFATAL] Error: Overwriting existing scene with id " + sceneID + ". Is this what you wanted?");
	}

	this.scenes[sceneID] = scene;

    console.log("[scenemanager.js] Registered Scene: " + sceneID);
};

/*
* Loads a scene into the scenemanager's content div. If there is a scene currently loaded,
* the scene will be ejected using a left to right animation.
*/
SceneManager.prototype.presentScene = function(sceneID) {

    console.log("[scenemanager.js] Presenting scene - " + sceneID);

	var scene = this.scenes[sceneID];

	if (scene == null) {
		console.error("Error: Couldn't load scene " + sceneID);
		return;
	} 

    if (!scene.getHTML) {
        console.error("Scene didn't have a getHTML property. This function is non optional, but can return null.");
        return;
    }

    if (!scene.preload) {
        console.error("Scene didn't have a preload() function.");
        console.error(scene);
        return;
    }

	scene.preload();

	if (!scene.isPhantom()) {

        var newScene = document.createElement("div");
		newScene.className = "__scene__";
		newScene.innerHTML = scene.getHTML();
        scene.element = newScene;
		// set some initial CSS properties of the scene.
		// we want it positioned all the way at the right side of the screen
		// so that we can slide it in.

        this.contentDiv.appendChild(newScene);
		$(jQuery(newScene)).addClass("initial");


		// If there is a scene already in the content div, move it out
		if (this.activeScene){
			// since we reassign this.activeScene when the next animation completes,
			// create a copy to the reference to avoid trouble
			var copy = this.activeScene;

			if (this.activeScene.onDestroy) {
				this.activeScene.onDestroy();
			}

            console.log(copy.element);

			$(jQuery(copy.element)).removeClass("in");
			$(jQuery(copy.element)).addClass("out");

			copy.element.parentNode.removeChild(copy.element);
		}

		$(jQuery(newScene)).addClass("in");

	} else {
		//reuse the scene HTML that's in there. just tell the active scene it's being destroyed
        if (this.activeScene && this.activeScene.onDestroy) {
            this.activeScene.onDestroy();
        }
	}

    //make sure the new scene can easily find things inside of itself.
	scene.searchContent = function(id) {
        return $(jQuery(newScene)).find(id);
    };

    //pass the torch onto the new scene
    this.activeScene = scene;
	if (scene.onPresent) {
		scene.onPresent();
	}
};



/**
 * Preloads the resources associated with a given scene.
 */
SceneManager.prototype.loadScene = function(sceneID) {

	var scene = this.scenes[sceneID];

	if (scene.preload) {
		// custom preloading is available for this scene
		// TODO: use web workers to make this REAL fast. As of right now, without threads this is useless (amounts to single-threaded loading).
		scene.preload();
	}
};



