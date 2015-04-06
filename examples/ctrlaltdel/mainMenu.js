var exported_scene = {
    id : "mainMenu",
	onPresent : function() { 

        var statue = this.searchContent("#statue");
        var options = this.searchContent("#options");

        this.searchContent("#start").click(function() {
            alert("unimplmeneted.");
        });

        this.searchContent("#load").click(function() {
            alert("unimplemented.");
        });

        this.searchContent("#highScores").click(function() {
            alert("unimplemented.");
        });

        console.log(statue);
        statue.animate({left: "500px"}, 300, function() {

            console.log("Animating statue..");
           //make our options appear
            options.animate({opacity: 1});
        });

	},
	onDestroy: function() {
	},
	getHTML : function() {
		return "mainMenu.html"
	}
};







