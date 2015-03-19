/** SceneManager:
  *
  *		A very simple HTML-injection based scene transition manager
  *		written in javascript. This allows for games to be made in a 
  *		compartmentalized way, without focusing on transitions or game flow.
  *
  *		Relies On:
  *				- jQuery (1.6+)
  *				- Luck
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

//tiny JQuery extension to check to see if an element exists
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
							'__scenebox__', its contents will be cleared and reused by the scene manager.
*						- a NON DIV element with this id exists, an alert() will be presented.
*
*		scenes:
*				A map whose keys are scene names (e.g "intro") and values are
*				valid 'Scene' objects.
*
*		initialScene:
*				The initial scene to load. 
*/
function SceneManager(contentDivID, scenes) {

		this.contentDivID = contentDiv;
		this.ANIM_LENGTH = 5;

		var existingDiv = document.getElementById(this.contentDivID);

		if (existingDiv == null) {
			//create a div
			this.contentDiv = document.createElement("div");
			this.contentDiv.className = "__scenebox__";
			document.body.appendChild(contentDiv);
		} else {
			// is it a div
			if (existingDiv.className == "__scenebox__" && existingDiv.tagName == "DIV") {
				//we found love in a hopeless place
				this.contentDiv = existingDiv;
			} else {
				alert("[scenemanager.js] Error: Couldn't load content div - tag must be a div and class must be __scenebox__");
				// to avoid getting into sticky situations, refuse to load the scenes.
				return;
			}
		}

		this.scenes = scenes;
}

/*
* Loads a scene into the scenemanager's content div. If there is a scene currently loaded,
* the scene will be ejected using a left to right animation.
*/
SceneManager.prototype.presentScene = function(sceneID) {

	var scene = this.scenes[sceneID];

	if (scene == null) {
		alert("Error: Couldn't load scene " + sceneID);
		return;
	} 

	//setup our new scene
	var newScene = document.createElement("div");
	newScene.className = "__scene__";
	newScene.innerHTML = scene.html;

	//set some initial CSS properties of the scene.
	//we want it positioned all the way at the right side of the screen
	//so that we can slide it in.
	newScene.addClass("initial");


	//If there is a scene already in the content div, move it out
	if (this.activeScene){
		//since we reassign this.activeScene when the next animation completes,
		//create a copy to the reference to avoid trouble
		var copy = this.activeScene;

		if (this.activeScene.onDestroy) {
			this.activeScene.onDestroy();
		}

		copy.removeClass("in");
		copy.addClass("out");
		copy.element.parent.removeChild(copy.element);
		/*jQuery(copy).animate({left: '-100%'}, {
			queue: false,
			duration: this.ANIM_LENGTH,
			complete: function() {
				copy.element.parent.removeChild(copy.element);
			}
		});*/
	}

	newScene.addClass("in");
	/*jQuery(newScene).animate({left: 0}, {
			queue: false,
			duration: this.ANIM_LENGTH,
			complete: function() {
				if (scene.onSceneLoad != null) {
					this.onPresent();
					this.activeScene = scene;
				}
			}
	});*/
};



/**
 * Preloads the resources associated with a given scene.
 */
SceneManager.prototype.loadScene = function(sceneID) {

	var scene = this.scenes[sceneID];

	if (scene.preload) {
		//custom preloading is available for this scene
		//TODO: use web workers to make this REAL fast. As of right now, without threads this is useless.
		scene.preload();
	}
}



