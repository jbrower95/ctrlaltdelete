/**
*  A scene to be used with the scene manager. Offers several convenient ways
*  of constructing and manipulating a scene.
*/

/**
*	External Usage:
*
*		To use the Scene(jsFile) constructor, you must make a javascript file that:
*
*			- has a global variable of type object named 'exported_scene' that:
*				
*				var exported_scene = {
					preload : function(){},
					onPresent : function(){},
					onDestroy : function(){},
					html : ""
				};
*
*/


function Scene(innerHTML, preload , onPresent, onDestroy) {
	this.html = innerHTML;
	this.preload = preload;
	this.onPresent = onPresent;
	this.onDestroy = onDestroy;
	this.ready = true;
}


function Scene(jsFile) {

	this.ready = false;
	
	//dynamically load the dependent script using jquery
	$.getScript(jsFile).done(function(){

		console.log("Loaded remote scene: " + jsFile);

		if (scene == null) {
			console.log("[Scene.js] Error: Couldn't load scene object from " + jsFile);
		}

		this.preload = exported_scene["preload"];
		this.onPresent = exported_scene["onPresent"];
		this.onDestroy = exported_scene["onDestroy"];
		this.html = exported_scene["html"];
		this.ready = true;

	}).fail(function(){
		alert("Couldn't load scene: " + jsFile);
	});
}


