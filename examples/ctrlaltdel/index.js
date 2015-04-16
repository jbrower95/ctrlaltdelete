
//Declare our map of scenes
var scenes = {};


SceneManager.initialize("content");
Scene.load("copyright.scene/copyright.js", startGame);
Scene.load("credits.scene/credits.js");
Scene.load("mainMenu.scene/mainMenu.js");
Scene.load("main.scene/main.js");

function startGame() {
    SceneManager.getSharedInstance().presentScene("copyright");
}