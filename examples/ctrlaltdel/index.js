
//Declare our map of scenes
var scenes = {};


//Declare our scene manager
console.log("Instantiating scene manager...");

SceneManager.initialize("content");
Scene.load("copyright.js", startGame);
Scene.load("mainMenu.js", null);

function startGame() {
    SceneManager.getSharedInstance().presentScene("copyright");
}