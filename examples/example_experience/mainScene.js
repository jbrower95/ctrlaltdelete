var exported_scene = {
	onPresent : function() { 
		alert("The scene happened!");
	},
	onDestroy: function() {
		alert("Time for the next scene!");
	},
	getHTML : function() {
		return "mainScene.html"
	}
};


    var nextScene = function() {
        console.log("KLJHSDGJKHSDKJGHSDKLG");
        if (this.scene == null) {
            console.error("Didn't get reference to scene.");
        } else {
            console.log(this.scene);
        }

        exported_scene.scene.manager.presentScene("next");
    }







