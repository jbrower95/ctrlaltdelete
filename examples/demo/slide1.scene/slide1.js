var exported_scene = {
	id : "slide1",
	onPresent : function() {
		$("#content").click(function() {
          console.log("Clicked");
          SceneManager.getSharedInstance().presentScene('slide2');
        });
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
		return "slide1.scene/slide1.html";
	}
}