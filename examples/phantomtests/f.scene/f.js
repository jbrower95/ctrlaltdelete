/* This is an example of a phantom scene which requires another phantom scene. */
var exported_scene = {
    id : "f",
    preload : function() {
    	console.log("Scene F multiplying bigNumber by 2 - initial state: " + this.exportedVariables['bigNumber'])
    	this.exportedVariables['bigNumber'] = this.exportedVariables['bigNumber'] * 2;
    	console.log("Scene F multiplying bigNumber by 2 - final state: " + this.exportedVariables['bigNumber'])	
    },
	onPresent : function() {
		if (this.exportedVariables['bigNumber']) {
			success = (this.exportedVariables['bigNumber']==80);
			alert("This is scene F! Verifying state..." + success + ". - " + this.exportedVariables['bigNumber']);
		}
	},
	getHTML : function() {
		return null;
	},
	requires : "e"
};