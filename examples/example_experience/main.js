
//Declare our map of scenes
var scenes = {};

scenes["main"] = new Scene("main.js");
scenes["next"] = new Scene("next.js");

//Declare our scene manager
var sceneManager = new SceneManager("mainContent", scenes);
sceneManager.presentScene("main");
