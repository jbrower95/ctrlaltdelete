var exported_scene = {
	preload : null,
	onPresent : function() { 
		alert("The scene happened!");
	},
	onDestroy: function() {
		alert("Time for the next scene!");
	},
	getHTML : function() {
		return "main.html"
	}
};