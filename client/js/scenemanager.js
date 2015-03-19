/** SceneManager:
  *
  *		A very simple HTML-injection based scene transition manager
  *		written in javascript. This allows for games to be made in a 
  *		compartmentalized way, without focusing on transitions or game flow.
  *
  *     TODO: Add a better description.
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
*						- a div with this id DOES exist, its contents will be cleared and used for the scene manager.
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
		if (document.getElementById(this.contentDivID) == null) {
			//create a div
			this.contentDiv = document.createElement("div");
			this.contentDiv.className = "__scenebox__";
			document.body.appendChild(contentDiv);
		}

		this.scenes = scenes;
}

/*
* Loads a scene into the scenemanager's content div. If there is a scene currently loaded,
* the scene will be ejected using a left to right animation.
*/
SceneManager.prototype.loadScene = function(sceneID) {

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
	newScene.style.position = "absolute";
	newScene.style.left = "100%";
	newScene.style.top = "0";


	//If there is a scene already in the content div, move it out
	if (this.activeScene){
		//since we reassign this.activeScene when the next animation completes,
		//create a copy to the reference to avoid trouble
		var copy = this.activeScene;

		if (this.activeScene.onDestroy) {
			this.activeScene.onDestroy();
		}

		jQuery(copy).animate({left: '-100%'}, {
			queue: false,
			duration: this.ANIM_LENGTH,
			complete: function() {
				copy.element.parent.removeChild(copy.element);
			}
		});
	}

	jQuery(newScene).animate({{left: 0}}, {
			queue: false,
			duration: this.ANIM_LENGTH,
			complete: function() {
				if (scene.onSceneLoad != null) {
					this.onSceneLoad();
					this.activeScene = scene;
				}
			}
	});
}