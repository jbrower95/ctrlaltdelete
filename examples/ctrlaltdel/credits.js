var exported_scene = {
    id : "credits",
    onPresent : function() {
        var manager = SceneManager.getSharedInstance();

        if (manager == null) {
            console.error("Couldn't get reference to scene manager");
        }

        var scene = manager.activeScene;

        if (scene == null) {
            console.error("Couldn't get a reference to the current scene.");
        }
    },
    getHTML : function() {
        return "credits.html";
    }
};