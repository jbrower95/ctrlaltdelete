/**  SceneManager:
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
  *      There is only ONE scene manager. This makes accessing it a bit less painful throughout scenes.
  *      To get a reference to the shared manager, you MUST call
  *
  *          SceneManager.initialize(div)
  *
  *      at least once. If you don't call this, you will receive a null manager.
  *      After performing the initialization methods, you can receive the manager by calling
  *
  *          SceneManager.getSharedInstance()
  *
  *     This is the preferred way of instigating scene changes from within scenes (and for
  *     accessing the current running scene from within a scene's javascript).
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
  *     Class Methods:
  *
  *          + (void) SceneManager.initialize(div)
  *              Initializes the scene manager to operate with a specified div.
  *
  *                      - Div can be an HTML DOM element, the ID of a div, or the
  *                        id of a div to be created. If the div doesn't exist, it will be created.
  *                        If it does (and has class __stage__) it will be used by the stage manager.
  *
  *          + (SceneManager) SceneManager.getSharedInstance()
  *             Returns the shared scenemanager.
  *		Constructors [DO NOT USE]:
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
				console.error("[scenemanager.js] Error: Couldn't load content div - tag must be a div and class must be __stage__");
				// to avoid getting into sticky situations, refuse to load the scenes.
				return;
			}
		}

        this.scenes = {};
        console.log("[scenemanager.js] SceneManager setup complete.");
}

//the singleton scene manager. To avoid polluting the global namespace, lots of underscores are used.
var _____SCENEMANAGER = null;

/**
 * Initializes the shared scenemanager.
 * @param div The div for the scenemanager to operate on.
 *          This can be
 *                      - the id of an existing div (string),
 *                      - the id of a div you wish to be created (string)
 *                      - an HTML element that represents a div you want to use (DOM element / object)
 *           When using a preexisting object, the class must be set to "__stage__". This is to prevent
 *           accidental assignment of divs, and to offer future customization of stages.
 */
SceneManager.initialize = function(div) {
    _____SCENEMANAGER = new SceneManager(div);
};

/**
 * Returns a reference to the shared scenemanager. Call at your will.
 */
SceneManager.getSharedInstance = function() {
    return _____SCENEMANAGER;
};


/**
 * Adds a scene to the scenemanager's list of available scenes. The scene is indexed on its 'id' property.
 * @param scene The scene to add.
 */
SceneManager.prototype.registerScene = function(scene) {
	if (this.scenes[scene.id] != null) {
		console.log("[Scene.js: NONFATAL] Error: Overwriting existing scene with id " + sceneID + ". Is this what you wanted?");
	}

	this.scenes[scene.id] = scene;

    console.log("[scenemanager.js] Registered Scene: " + scene.id);
};

/**
 * Loads a scene into the scenemanager's content div. If there is a scene currently loaded,
 * the scene will be ejected using a left to right animation.
 */
SceneManager.prototype.presentScene = function(sceneID) {
  var scene = this.scenes[sceneID];

	if (scene == null) {
		console.error("[scenemanager.js] Error: Couldn't load scene " + sceneID);
		return;
	} 

  if (!scene.getHTML) {
    console.error("[scenemanager.js] Scene didn't have a getHTML property. This function is non optional, but can return null.");
    console.error("[scenemanager.js] object: " + scene);
    return;
  }

  if (!scene.preload) {
    console.error("[scenemanager.js] Scene didn't have a preload() function. This is most likely an internal error.");
    console.error("[scenemanager.js] object: " + scene);
    return;
  }

	scene.preload();

	if (!scene.isPhantom()) {
    console.log("[scenemanager.js] Presenting non phantom scene: " + sceneID);
  
		// If there is a scene already in the content div, move it out
		if (this.activeScene) {
			// since we reassign this.activeScene when the next animation completes,
			if (this.activeScene.onDestroy) {
				this.activeScene.onDestroy();
			}
      if (this.activeScene.element == null) {
          console.error("[scenemanager] Existing scene was null..");
      }
      $(this.contentDiv).empty();
    }
    var newScene = document.createElement("div");
    newScene.className = "__scene__";
    newScene.innerHTML = scene.getHTML();

    scene.element = newScene;
    this.contentDiv.appendChild(scene.element);
	} else {
    console.log("[scenemanager.js] Presenting phantom scene: " + sceneID);
  
		// reuse the scene HTML that's in there. just tell the active scene it's being destroyed
    // resolve our dependencies
    var requiredScenes = [];

    // make sure we don't hit a cycle. If we do, this is a fatal error and the programmer should be alerted.
    var visitedScenes = [];
    visitedScenes.push(scene.id);

    var current_requirement = scene.requires;

    if (current_requirement == null) {
      console.error("[scenemanager.js] No required scene provided for this phantom scene.")
    }

    while (current_requirement != null) {
      console.log("[scenemanager.js] Resolving requirement: " + current_requirement);
      var current_required_scene = this.getScene(current_requirement);

      if ((this.activeScene) && (current_required_scene.id == this.activeScene.id)) {
          // We've hit our current scene in the dependency graph. That means, all content
          //   we've accumulated up until now is all we need to present this scene.
          // make sure the new scene can easily find things inside of itself.
          console.log("[scenemanager.js/resolver] The dependency graph included the current scene! Short circuiting...");
          break;
      }

      if (visitedScenes.indexOf(current_required_scene.id) > -1) {
          console.error("[scenemanager.js/loader] Error: (1/2) You have a cyclic dependency in your scene graph. That is, the scene " + current_required_scene.id + " is required in a cyclic manner.");
          console.error("[scenemanager.js/loader] (2/2) Please review your phantom scene 'requires' statements.");
      }

      visitedScenes.push(current_required_scene.id);
      requiredScenes.push(current_required_scene.id);

      if (!current_required_scene.isPhantom()) {
        console.log("[scenemanager.js/resolver] The dependency graph hit a root dependency! Short circuiting...");
        break;
      }

      current_requirement = current_required_scene.requires;
    }

    var numRequirements = requiredScenes.length;
    console.log("[scenemanager.js] Number of required scenes: " + numRequirements);

    // destroy whatever scene is currently on screen
    if (this.activeScene && this.activeScene.onDestroy) {
      this.activeScene.onDestroy();
    }

    // present the sequence of scenes that lead up until
    var i = 0;
    while (i < numRequirements) {
      this.presentScene(requiredScenes.pop());
      i++;
    }

    console.log(scene);
    console.log(this.activeScene);
    //copy over variables
    jQuery.extend(scene.exportedVariables, this.activeScene.exportedVariables);
    scene.element = this.activeScene.element;

    console.log("[scenemanager.js/phantom] Presenting phantom scene: " + scene.id);


	}

  // make sure the new scene can easily find things inside of itself.
  scene.searchContent = function(id) {
    return $(newScene).find(id);
  };

  // pass the torch to the new scene
  console.log("[scenemanager.js] Calling onPresent on " + scene.id);
  this.activeScene = scene;
  if (scene.onPresent) {
  	scene.onPresent();
  }
};


/**
 * Performs a sequence of functions with the specified array of timeouts.
 * 
 * funcs: An array of functions to call.
 * 
 * timeouts: An array of timeouts. That is, the i-th member of timeouts
 * represents the delay before performing function i
 * 
 * ex:
 * 
 * 	SceneManager.performSequence([doFirstAnim, moveCharacter, doSecondAnim], [100, 200, 300]);
 * 
 * 	(wait 100ms) -> perform 'doFirstAnim()' -> wait 200ms -> 'perform moveCharacter()' -> wait 300ms
 * -> perform 'doSecondAnim()'
 */
SceneManager.performSequence = function(funcs, timeouts, context) {
	
	if (!funcs || !timeouts || funcs.length == 0  || timeouts.length == 0) {
		return;
	}
	
	//if context isn't supplied, default to the caller.
	context = context || this;
	
	var timeout = timeouts.shift();
	setTimeout($.proxy(function() {
		//get the first function, call it, and recur.
		(funcs.shift())();
		SceneManager.performSequence(funcs, timeouts, context);
		}, context), timeout);
};


/**
*  Displays a Phantom Scene by using a stack of dependent scenes, injecting them, calling preload and then transitioning. 
*  @return a promise to resolve these scenes.
*/
SceneManager.prototype.resolvePhantomDependencies = function(sceneName, sceneStack) {

    var manager = this;

    console.log("[scenemanager.js/phantom] Resolving dependencies for phantom scene: " + sceneName);
    return new Promise($.proxy(function(resolve, reject) {
    // do a thing, possibly async, then…

    //preload all dependencies
    if (sceneStack.length > 0) {

      requiredScene = sceneStack.pop();
      rs = this.scenes[requiredScene];
      this.activeScene = rs;
      
      if (!rs.isPhantom()) {
        //this is NOT a phantom scene. inject the HTML.

        if (!rs.element) {
          //don't reload stuff if we don't need to.
          var newScene = document.createElement("div");
          newScene.className = "__scene__";
          newScene.innerHTML = scene.getHTML();
          rs.element = newScene;
        }

        

      } 

      //preload the scene. this may return a promise.
      var possiblyPromise = rs.preload();

        if (possiblyPromise) {

          Promise.resolve(possiblyPromise).then(function() {
          //recur with the new, reduced stack.
            manager.resolvePhantomDependencies(sceneName, sceneStack);
          });

    } else {
      resolve("[scenemanager.js/phantomLoader] Ready for scene " + sceneName + "!");
    }
  }
}, manager));
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


/**
 * Returns the Scene instance associated with a given name
 */
SceneManager.prototype.getScene = function(sceneID) {
    return this.scenes[sceneID];
};

