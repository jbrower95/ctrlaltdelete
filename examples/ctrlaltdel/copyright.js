var exported_scene = {
    id : "copyright",
	onPresent : function() { 
        this.searchContent(".btn").css("opacity","0");
        var p = this.searchContent("p");
        var sceneRef = this;
        var times = 0;
        var done = false;
        function animate(_color, _duration) {
            times++;

            if (done) {
                return;
            }

            console.log("Times: " + times);
                p.animate({color: _color}, {
                    duration: _duration,
                    complete: function () {
                        if (_color == "white") {
                            jQuery.proxy(animate, sceneRef)("black", 2000);
                        } else {
                            jQuery.proxy(animate, sceneRef)("white", 3000);
                        }
                    }
                });
            if (times > 3 && !done) {
                this.searchContent(".btn").animate({opacity: "1"});
                this.searchContent(".btn").click(function() {
                    done = true;
                   SceneManager.getSharedInstance().presentScene("mainMenu");
                });
            }
        }

        animate("white", 3000);
	},
	onDestroy: function() {
	},
	getHTML : function() {
		return "copyright.html"
	}
};







