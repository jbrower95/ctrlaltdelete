var exported_scene = {
    id : "introcut",
	getHTML : function() {
		return "introcut.scene/introcut.html"
	},
    onPresent : function() {

        this.searchContent("caption").hide();

        setTimeout(this.searchContent("caption").show, 2000);

        this.searchContent("#gabe").css("left", "35%");
        this.searchContent("#gabe").css("bottom", "0");
        var duration = 4000;

        function walkAway() {
            this.searchContent("#gabe").animate({left: "70%", bottom: "40%"}, duration, $.proxy(function() {
                this.searchContent("#gabe").hide(300, $.proxy(function() {
                    setTimeout($.proxy(transition,this), 200);
                }, this));
            }, this));
        }

        function transition(){
            $(this.searchContent("#introCut")).animate({"left" : "-100%"}, 200, $.proxy(function() {
                SceneManager.getSharedInstance().presentScene("windows95");
            }, this));
        }

        this.searchContent("#gabe").animate({left: "48%"}, 200, $.proxy(walkAway, this));
    },

    onDestroy : function() {

    }
};







