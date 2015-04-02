
//Declare our map of scenes
var scenes = {};


//Declare our scene manager
console.log("Instantiating scene manager...");

SceneManager.initialize("stage");
Scene.load("mainScene.js", showMenu);
Scene.load("nextScene.js", null);

function showMenu() {
    alert("Presenting scene!");
    SceneManager.getSharedInstance().presentScene("main");
}