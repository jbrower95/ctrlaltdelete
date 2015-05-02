var exported_scene = {
	id : "newScene8",
	onPresent : function() {
		//TODO: perform scene initialization / do things
	},
	onDestroy : function() {
		//TODO: perform some cleanup
	},
	preload : function() {
		//TODO: establish any resources this scene needs. Can return a promise for async actions.
	}, 
	
	/* If this scene follows another scene and doesn't need its own HTML, uncomment 'requires'*/
	//requires : 'other scene'
	/* If this scene has its own HTML, return the name of the file here. Alternatively, just return some HTML for the scene to load here. */
	getHTML : function() {
		return "newScene8.html";
	}
};