var exported_scene = {
    id : "introcut",
    onPresent : function() {
    	SceneManager.getSharedInstance().presentScene("windows95");
    },
	getHTML : function() {
		return "introcut.scene/introcut.html"
	}
};







