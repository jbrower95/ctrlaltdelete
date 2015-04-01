
//Declare our map of scenes
var scenes = {};

scenes["main"] = new Scene();
scenes["next"] = new Scene();



//Declare our scene manager
var sceneManager = new SceneManager("mainContent", scenes);
sceneManager.presentScene("main");