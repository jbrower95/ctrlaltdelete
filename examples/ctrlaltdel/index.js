
//Declare our map of scenes
var scenes = {};


//Declare our scene manager
console.log("Instantiating scene manager...");

SceneManager.initialize("content");
Scene.load("copyright.js", null);
Scene.load("credits.js", startGame);

function startGame() {
    SceneManager.getSharedInstance().presentScene("credits");
}