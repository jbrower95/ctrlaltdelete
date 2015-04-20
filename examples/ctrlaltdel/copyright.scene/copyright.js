var exported_scene = {
    id : "copyright",
	onPresent : function() { 
        this.searchContent(".btn").css("opacity","0");
        var p = this.searchContent("p");
        var sceneRef = this;
        var times = 0;
        var done = false;
        function animate(_color, _duration) {
            p.animate({color: _color}, {
                    duration: _duration,
                    complete: function () {
                        if (_color != "white") {
                            $.proxy(animate, sceneRef)("white", 3000);
                        }
                    }
                });

            setTimeout(function() {
                sceneRef.searchContent(".btn").animate({opacity: "1"})
                }, 3000);
            sceneRef.searchContent(".btn").click(function() {
                SceneManager.getSharedInstance().presentScene("mainMenu");
            });
        }

        animate("white", 3000);
	},
	onDestroy: function() {
	},
	getHTML : function() {
		return "copyright.scene/copyright.html"
	}
};







