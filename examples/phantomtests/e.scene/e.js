/* This is an example of a phantom scene which requires another phantom scene. */
var exported_scene = {
    id : "e",
    preload : function() {
    	this.exportedVariables['bigNumber'] = this.exportedVariables['bigNumber'] * 2;
    }
	onPresent : function() {
		if (this.exportedVariables['bigNumber']) {
			success = (this.exportedVariables['bigNumber']==40);
			alert("This is scene C checking in. Verifying state: " + success);
		}
	},
	getHTML : function() {
		return null;
	},
	requires : "d"
};