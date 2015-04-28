/* This is an example of a phantom scene which requires another phantom scene. */
var exported_scene = {
    id : "c",
	onPresent : function() {
		if (this.exportedVariables['yo']) {
			alert("This is scene C checking in. Received the following message from b: " + this.exportedVariables['yo']);
			alert("Wait, also received data from A: " + this.exportedVariables['bigComputation']);
		}
	},
	getHTML : function() {
		return null;
	},
	requires : "b"
};