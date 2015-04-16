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
        video.autoPlay = "autoplay";
        video.play();

        var state = -1;

        var runCredits = function() {
            state = state + 1;
            if (state == 0) {
                console.log("showing credits 1..");
                $("#credit1").show();
                setTimeout(runCredits, 5000);
            } else if (state == 1) {
                console.log("showing credits 2..");
                $("#credit1").hide();
                $("#credit2").show();
                setTimeout(runCredits, 5000);
            } else if (state == 2) {
                console.log("showing credits 3..");
                $("#credit2").hide();
                $("#credit3").show();
                setTimeout(runCredits, 5000);
            } else if (state == 3) {

                console.log("showing credits 4..");
                $("#credit3").hide();
                $("#credit4").show();
                setTimeout(runCredits, 5000);
            }
        };

        runCredits();
        scene.searchContent("#container").append(video);
    },
    getHTML : function() {
        return "credits.scene/credits.html";
    }
};