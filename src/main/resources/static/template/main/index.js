/** This is your MAIN SCENE.
* Here, you'll load all of your individual scenes, and start off the experience
* with whichever one you choose. You can also customize it in different ways:
* provide a base HTML template, some javascript handlers for the entire experience, etc.
*/


/* Do not touch, initializes the scenemanager. */
SceneManager.initialize("content");
/* ------------------------------------------- */

/**
* Presents the first scene, by that scene's id.
*/
function start() {
    // To present a scene, use the following line, replacing 'sample' with
    // the id of any scene you want to present.

    // SceneManager.getSharedInstance().presentScene('sample');
}

// Load all scenes
// Loading returns a promise, so use .then(...) to do more stuff after.

//Scene.load('sample.scene/sample.js');
//Scene.load('sample.scene/sample.js').then(start);

