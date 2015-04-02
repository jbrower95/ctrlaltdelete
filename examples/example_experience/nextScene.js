var exported_scene = {
    id : "next",
    onPresent : function() {
        var manager = SceneManager.getSharedInstance();

        if (manager == null) {
            console.error("Couldn't get reference to scene manager");
        }

        var scene = manager.activeScene;

        if (scene == null) {
            console.error("Couldn't get a reference to the current scene.");
        }

        scene.searchContent("img").css("border 5px gray;");

        var imgNode = scene.searchContent("img");
        (function pulse(back) {
            $(imgNode).animate(
                {
                    width: (back) ? $(imgNode).width() + 20 : $(imgNode).width() - 20
                }, 700);
            $(imgNode).animate(
                {
                    'font-size': (back) ? '100px' : '140px',
                    opacity: (back) ? 1 : 0.5
                }, 700, function(){pulse(!back)});
        })(false);
    },
    getHTML : function() {
        return "nextScene.html";
    }
};