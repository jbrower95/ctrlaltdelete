
//Declare our map of scenes
var scenes = {};


SceneManager.initialize("content");
Scene.load("phaser.scene/game.js", startGame);


function startGame() {
    SceneManager.getSharedInstance().presentScene("phaser");
}