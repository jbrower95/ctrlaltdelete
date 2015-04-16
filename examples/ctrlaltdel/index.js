
//Declare our map of scenes
var scenes = {};


SceneManager.initialize("content");
Scene.load("copyright/copyright.js", startGame);
Scene.load("credits/credits.js", null);
Scene.load("mainMenu/mainMenu.js", null);
Scene.load("main/main.js");

function startGame() {
    SceneManager.getSharedInstance().presentScene("copyright");
}