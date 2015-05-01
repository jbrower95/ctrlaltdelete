var exported_scene = {
    id : "gabeshouse",
	getHTML : function() {
		return "gabeshouse.scene/gabeshouse.html"
	},

    onPresent : function() {

        this.searchContent(".caption").hide();

        this.searchContent(".caption").eq(0).show();

        var scene = this;
        var gabe = this.searchContent("#gabe");

        gabe.animate({left: "12%", bottom: "25%"}, 300, function() {
            setTimeout(function() {
                console.log(gabe);
                gabe.attr("src", "images/gabe_back.png");
                setTimeout(function() {
                    scene.searchContent(".caption").eq(0).hide();
                    scene.searchContent(".caption").eq(1).show();
                    gabe.animate({left: "5%", bottom: "58%"}, 800);
                    gabe.hide(2000, function() {
                        SceneManager.getSharedInstance().presentScene("clickthexs");
                    });
                    AssetManager.getSharedInstance().fadeOutNamed("walking home music");
                }, 5000);
            }, 600);
        });
    },

    onDestroy : function() {

    }
};







