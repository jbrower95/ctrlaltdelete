var exported_scene = {
    id : "mainMenu",
	onPresent : function() { 

        var statue = this.searchContent("#statue");
        var options = this.searchContent("#options");

        this.searchContent("#start").click($.proxy(function() {
            console.log("Stopping audio...");

            var curtain = document.createElement("div");
            curtain.style.position = "absolute";
            curtain.style.left = 0;
            curtain.style.top = 0;
            curtain.style.width = "100%";
            curtain.style.height = "100%";
            curtain.style.backgroundColor = "#000000";
            curtain.style.opacity = 0;
            curtain.style.zIndex = 10;


            document.body.style.backgroundImage = "";
            var sound = document.getElementById("backgroundMusic");

            this.element.appendChild(curtain);

            var fadeOut = 6000;

            $(sound).animate({volume: 0}, fadeOut);

            $(curtain).animate({opacity: 1}, fadeOut, function() {
                sound.pause();
                sound.currentTime = 0;
                sound.src = "";

                SceneManager.getSharedInstance().presentScene("introcut");
            });
        }, this));

        this.searchContent("#load").click(function() {
            alert("unimplemented.");
        });

        this.searchContent("#scores").click(function() {
            SceneManager.getSharedInstance().presentScene("scores");
        });

        this.searchContent("#credits").click(function() {
            SceneManager.getSharedInstance().presentScene("credits");
        });

        var sound = this.searchContent("#backgroundMusic");
        statue.animate({opacity: "1"}, 300, function() {
            sound.trigger('play');
           //make our options appear
            options.animate({opacity: 1});
        });
	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "mainmenu.scene/mainMenu.html"
	}

};







