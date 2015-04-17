var exported_scene = {
    id : "windows95",
	onPresent : function() {
		var manager = new WindowManager("desktop");
		var win = manager.inflate("taskManager");
		manager.addWindow(win);
		 clippy.load('Clippy', function(agent) {
		        agent.show();
		        agent.moveTo(200,200);
		        agent.speak('Test');
		    });
	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "windows95.scene/windows95.html"
	}
};