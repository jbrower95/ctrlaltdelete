
//Declare our map of scenes
var scenes = {};


SceneManager.initialize("content");
Scene.load("copyright/copyright.js", startGame);
Scene.load("credits/credits.js", null);
Scene.load("mainMenu/main.js", null);

function startGame() {
    SceneManager.getSharedInstance().presentScene("copyright");
}