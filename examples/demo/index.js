
/* Do not touch, initializes the scenemanager. */
SceneManager.initialize("content");
/* ------------------------------------------- */


// Load all scenes
// Loading returns a promise, so use .then(...) to do more stuff after.

Scene.load('slide1.scene/slide1.js').then(function() {SceneManager.getSharedInstance().presentScene('slide1')});
Scene.load('slide2.scene/slide2.js');

