var exported_scene = {
	id : "SCENENAME",
	onPresent : function() {
		//TODO: This will run when the scene is presented, after preload finishes. Add any relevant javascript for your scene!
	},
	onDestroy : function() {
		//TODO: Get rid of any handlers/elements you created that you don't want to continue into the next scenes.
	},
	preload : function() {
		//TODO: Load in any resources this scene needs. If you want this to be asynchronous, have it return a promise.
	}, 
	
	/* If this scene follows another scene and doesn't need its own HTML, uncomment 'requires'*/
	//requires : 'other scene'
	/* If this scene has its own HTML, return the name of the file here. Alternatively, just return some HTML for the scene to load here. */
	getHTML : function() {
		return "SCENENAME.scene/SCENENAME.html";
	}
};