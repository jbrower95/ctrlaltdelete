var exported_scene = {
	onPresent : function() {
        var manager = SceneManager.getSharedInstance();

        if (manager == null) {
            console.error("Couldn't get reference to scene manager");
        }

        var scene = manager.activeScene;

        if (scene == null) {
            console.error("Couldn't get a reference to the current scene.");
        }

		alert("Hey there! The next scene has control now.");
		scene.searchContent("img").css("border 5px gray;");
	},
	onDestroy: function() {

        //var scene = SceneManager.getSharedInstance().activeScene;
	},
	getHTML : function() {
		return null
	}
};