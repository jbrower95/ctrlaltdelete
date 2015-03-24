var exported_scene = {
	onPresent : function(scene) { 
		alert("Dynamically loading this scene!");
		scene.searchElement("img").css("border 5px gray;");
	},
	onDestroy: function(scene) {
		alert("Time for the next scene!");
	},
	getHTML : function() {
		return "next.html"
	}
};