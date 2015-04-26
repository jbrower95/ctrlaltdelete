
// Declare the map of scenes.
var scenes = {};

// Prevent users from accidentally refreshing the page and losing progress.
window.onbeforeunload = function() {
    return "You're about to lose your progress. Don't leave!";
}

SceneManager.initialize("content");
Scene.load("copyright.scene/copyright.js", startGame);
Scene.load("scores.scene/scores.js");
Scene.load("credits.scene/credits.js");
Scene.load("mainmenu.scene/mainMenu.js");
Scene.load("introcut.scene/introcut.js");
Scene.load("windows95.scene/windows95.js");
Scene.load("explorer95.scene/explorer95.js");
Scene.load("gabeshouse.scene/gabeshouse.js");


function startGame() {
    SceneManager.getSharedInstance().presentScene("copyright");
}