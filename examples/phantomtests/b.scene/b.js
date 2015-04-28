/* This is an example of a phantom scene which requires a NON phantom scene. */
var exported_scene = {
    id : "b",
    preload : function() {
    	this.exportedVariables['yo'] = 'sup';
    },
	onPresent : function() {
		if (this.exportedVariables['bigComputation']) {
			alert("Awesome, the transition to B was completed succesfully. Transferred the value " + this.exportedVariables['bigComputation']);
		} else {
			alert("failed.");
		}
	},
	getHTML : function() {
		return null;
	},
	requires : "a"
};