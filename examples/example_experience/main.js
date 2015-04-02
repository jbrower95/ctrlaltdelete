
//Declare our map of scenes
var scenes = {};


//Declare our scene manager
console.log("Instantiating scene manager...");

SceneManager.initialize("stage");
Scene.load("mainScene.js", "main", showMenu);
Scene.load("nextScene.js", "next", null);

function showMenu() {
    alert("Presenting scene!");
    SceneManager.getSharedInstance().presentScene("main");
}