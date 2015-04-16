var exported_scene = {
    id : "mainMenu",
	onPresent : function() { 

        var statue = this.searchContent("#statue");
        var options = this.searchContent("#options");

        this.searchContent("#start").click(function() {
            SceneManager.getSharedInstance().presentScene("introcut");
        });

        this.searchContent("#load").click(function() {
            alert("unimplemented.");
        });

        this.searchContent("#highScores").click(function() {
            alert("unimplemented.");
        });

        this.searchContent("#credits").click(function() {
            SceneManager.getSharedInstance().presentScene("credits");
        });

        var sound = this.searchContent("#backgroundMusic");
        statue.animate({left: "500px"}, 300, function() {
            sound.trigger('play');
            console.log("Animating statue..");
           //make our options appear
            options.animate({opacity: 1});
        });

        document.body.style.backgroundImage = "url(https://lh5.ggpht.com/IDBoc7HlkfauHstRiEyJlp5MQL0oRZ3xbVYv8DNtQoCbogm42bSjYhIZCRu1uSHQ3RQ=h900)";
        document.body.style.backgroundSize = "100%";

        var move = function() {
            statue.animate({bottom: "0"}, 500, function() {
                statue.animate({bottom: "500"}, 500, function() {
                    move();
                })});
        };


        move();
	},
	onDestroy: function() {
        console.log("Stopping audio...");
        document.body.style.backgroundImage = "";
        var sound = document.getElementById("backgroundMusic");
        sound.pause();
        sound.currentTime = 0;
        sound.src = "";

	},
	getHTML : function() {
		return "mainmenu.scene/mainMenu.html"
	}
};







