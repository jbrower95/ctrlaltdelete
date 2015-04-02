var exported_scene = {
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

function nextScene() {
    exported_scene.manager.presentScene("next");
}