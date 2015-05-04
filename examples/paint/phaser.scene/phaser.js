
//Declare our map of scenes
var scenes = {};


SceneManager.initialize("content");
Scene.load("phaser.scene/game.js").then(startGame);


function startGame() {
    SceneManager.getSharedInstance().presentScene("phaser");
}