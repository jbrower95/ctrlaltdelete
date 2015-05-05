// Prevent users from accidentally refreshing the page and losing progress.
window.onbeforeunload = function() {
    return "You're about to lose your progress. Don't leave!";
}

function startGame() {
    SceneManager.getSharedInstance().presentScene("copyright");
}

SceneManager.initialize("content");
Scene.load("copyright.scene/copyright.js").then(startGame);
Scene.load("scores.scene/scores.js");
Scene.load("credits.scene/credits.js");
Scene.load("mainmenu.scene/mainMenu.js");
Scene.load("introcut.scene/introcut.js");
Scene.load("windows95.scene/windows95.js");
Scene.load("explorer95.scene/explorer95.js");
Scene.load("gabeshouse.scene/gabeshouse.js");
Scene.load("clickthexs.scene/clickthexs.js");
Scene.load("paint.scene/paint.js");
Scene.load("theend.scene/theend.js");
Scene.load("choosescore.scene/choosescore.js");
Scene.load("killbill.scene/killbill.js");


