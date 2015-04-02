
//Declare our map of scenes
var scenes = {};


//Declare our scene manager
console.log("Instantiating scene manager...");
var sceneManager = new SceneManager("stage");

Scene.load("mainScene.js", "main", sceneManager, showMenu);
Scene.load("nextScene.js", "next", sceneManager);

function showMenu() {
    sceneManager.presentScene("main");
}