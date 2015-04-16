var exported_scene = {
    id : "gabeshouse",
	getHTML : function() {
		return "gabeshouse.scene/gabeshouse.html"
	},

    onPresent : function() {

        this.searchContent("#gabe").animate({left: "12%", bottom: "25%"}, 300, function() {
            setTimeout($.proxy(function() {
                this.src = "images/gabe_back.png";
            }, this), 300);
        });
    },

    onDestroy : function() {

    }
};







