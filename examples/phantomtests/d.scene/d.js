/* This is an example of a phantom scene which requires another phantom scene. */
var exported_scene = {
    id : "d",
    preload : function() {
    	this.exportedVariables['bigNumber'] = 20;
    },
	onPresent : function() {
		if (this.exportedVariables['yo']) {
			alert("It's scene D! Putting some variables in the cache. onPresent is cool.");
		}
	},
	getHTML : function() {
		return "d.scene/d.html";
	}
};