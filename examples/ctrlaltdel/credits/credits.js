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

        var video = document.createElement("video");

        if (video.canPlayType('video/webm').length > 0) {
            /* set some video source */
            console.log("Detected support for webm.");
            video.src = "jpop.webm";
        } else if (video.canPlayType('video/mp4').length > 0) {
            console.log("Deteced support for mp4.");
            video.src = "jpop.mp4";
        }

        video.style.width = '100%';

        video.autoPlay = true;
        scene.searchContent("#container").append(video);
    },
    getHTML : function() {
        return "credits/credits.html";
    }
};