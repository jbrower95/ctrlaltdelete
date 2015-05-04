
/* Do not touch, initializes the scenemanager. */
SceneManager.initialize("content");

/* ------------------------------------------- */


// Load all scenes
// Loading returns a promise, so use .then(...) to do more stuff after.

Scene.load('tony.scene/tony.js').presentScene('tony');
//Scene.load('sample.scene/sample.js')
//Scene.load('sample.scene/sample.js').then( function() { console.log('yo'); })

