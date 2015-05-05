
/* Do not touch, initializes the scenemanager. */
SceneManager.initialize("content");
/* ------------------------------------------- */

/**
* Presents the first scene, by that scene's id.
*/
function start() {
    // To present a scene, use the following line, replacing 'sample' with
    // the id of any scene you want to present.

    SceneManager.getSharedInstance().presentScene('newScene1');
}

// Load all scenes
// Loading returns a promise, so use .then(...) to do more stuff after.

//Scene.load('sample.scene/sample.js')
Scene.load('newScene1.scene/newScene1.js').then(start);

