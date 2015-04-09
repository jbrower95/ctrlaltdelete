
//Declare our map of scenes
var scenes = {};


//Declare our scene manager
console.log("Instantiating scene manager...");

SceneManager.initialize("stage");
Scene.load("copyright.js", showMenu);
Scene.load("credits.js", null);

function showMenu() {
    alert("Presenting scene!");
    SceneManager.getSharedInstance().presentScene("main");
}