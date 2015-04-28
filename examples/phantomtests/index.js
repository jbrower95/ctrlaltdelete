
//tests for phantom scenes

/*
*			
*			Dependency graph / supported transitions:
*				
*					[a]  ->    [b]   -> [c]
*
*					[a]  ->    [c]
*	
*
*/
SceneManager.initialize("content");
Scene.load("a.scene/a.js", startGame);
Scene.load("b.scene/b.js");
Scene.load("c.scene/c.js");

function startGame() {
    SceneManager.getSharedInstance().presentScene("a");
}