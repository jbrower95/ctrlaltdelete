var exported_scene = {
    id : "windows95",
	onPresent : function() {
		var manager = new WindowManager("desktop");
		var win = manager.inflate("taskManager");
		manager.addWindow(win);
	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "windows95.scene/windows95.html"
	}
};