var exported_scene = {
	onPresent : function(scene) {
        var scene = SceneManager.getSharedInstance().active_scene;
		alert("Dynamically loading this scene!");
		scene.searchContent("img").css("border 5px gray;");
	},
	onDestroy: function(scene) {
		alert("Time for the next scene!");
	},
	getHTML : function() {
		return null
	}
};