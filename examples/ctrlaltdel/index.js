
//Declare our map of scenes
var scenes = {};


SceneManager.initialize("content");
Scene.load("copyright.scene/copyright.js");
Scene.load("credits.scene/credits.js");
Scene.load("mainmenu.scene/mainMenu.js", startGame);
Scene.load("introcut.scene/introcut.js");


function startGame() {
    SceneManager.getSharedInstance().presentScene("mainMenu");
}