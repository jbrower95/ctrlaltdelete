
//Declare our map of scenes
var scenes = {};


SceneManager.initialize("content");
Scene.load("copyright.scene/copyright.js", startGame);
Scene.load("credits.scene/credits.js");
Scene.load("mainmenu.scene/mainMenu.js");
Scene.load("introcut.scene/introcut.js");
Scene.load("windows95.scene/windows95.js");

function startGame() {
    SceneManager.getSharedInstance().presentScene("copyright");
}