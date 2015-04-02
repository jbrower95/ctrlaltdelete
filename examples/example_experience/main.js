
//Declare our map of scenes
var scenes = {};


//Declare our scene manager
console.log("Instantiating scene manager...");
var sceneManager = new SceneManager();

Scene.load("mainScene.js", "main", sceneManager);
Scene.load("nextScene.js", "next", sceneManager);

sceneManager.presentScene("main");
