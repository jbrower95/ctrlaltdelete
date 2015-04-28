var exported_scene = {
    id : "a",
    preload : function() {
    	//do some work! / do something.

    	if (!this.exportedVariables) {
    		console.error("Error: skdgsd");
    		console.error(this);
    	}

    	this.exportedVariables['bigComputation'] = (2 * 2 * 2 * 2 * 2 * 2);
    },

	onPresent : function() {
		alert("Yo, this is scene A's on present getting up in the house!");

	},
	onDestroy: function() {
		alert("Scene A says bye!");
	},
	getHTML : function() {
		return "a.scene/a.html"
	}
};