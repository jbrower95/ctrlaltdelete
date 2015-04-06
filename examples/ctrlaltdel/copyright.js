var exported_scene = {
    id : "copyright",
	onPresent : function() { 
        this.searchContent(".btn").hide();
        var p = this.searchContent("p");
        var sceneRef = this;
        var times = 0;
        var done = false;
        function animate(_color, _duration) {
            times++;
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
                console.log(this);
                this.searchContent(".btn").show();
                this.searchContent(".btn").click(function() {
                   SceneManager.getSharedInstance().presentScene("mainMenu");
                });
                done = true;
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







