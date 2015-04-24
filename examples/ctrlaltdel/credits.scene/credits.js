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

        var showCredit1 = function() {
            $("#credit1").show({duration: 2000});
        };

        var showCredit2 = function() {
            $("#credit1").hide({duration: 200});
            $("#credit2").show({duration: 2000});
        };

        var showCredit3 = function() {
            $("#credit2").hide({duration: 200});
            $("#credit3").show({duration: 2000});
        };

        var showCredit4 = function() {
            $("#credit3").hide({duration: 200});
            $("#credit4").show({duration: 2000});
        };

        var exit = function() {
            //do that sweet fade
            $("video").hide(1000, function() {
                $("video").trigger("stop");
                SceneManager.getSharedInstance().presentScene("mainMenu");
            });
        };

        console.log("Hiding credits...");
        $("#credit1").hide();
        $("#credit2").hide();
        $("#credit3").hide();
        $("#credit4").hide();
        console.log("Done.");

        SceneManager.performSequence([showCredit1, showCredit2, showCredit3, showCredit4, exit], [5000, 10000, 10000, 10000, 20000], this);

        scene.searchContent("#container").append(video);
    },
    getHTML : function() {
        return "credits.scene/credits.html";
    }
};