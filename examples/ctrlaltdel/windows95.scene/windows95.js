var exported_scene = {
    id : "windows95",
	onPresent : function() {
		var manager = new WindowManager("desktop");
		
		var win = manager.inflate("taskManager");
		win.setTitle("Task Manager");
		win.setIcon("images/task_manager_icon.png");
		win.moveTo(200, 100);
		manager.addWindow(win);

		var win = manager.inflate("explorer");
		win.setTitle("My Computer");
		win.setIcon("images/open_folder.png");
		win.moveTo(150, 200);
		manager.addWindow(win);
		
		var clippyAgent;

		AssetManager.getSharedInstance().preload(1);
		AssetManager.getSharedInstance().preload(3);

		if (!this.exportedVariables) {
			this.exportedVariables = {};
		}

		var showClippy = $.proxy(function() {
			 clippy.load('Clippy', $.proxy(function(agent) {
			        clippyAgent = agent;
					this.exportedVariables.clippy = agent;
				 	clippyAgent.show();
			        clippyAgent.moveTo(200,200);
				 	console.log("Playing sound 1");
				 	clippyAgent.speak("Looks like you're stuck inside the computer!");
				 	AssetManager.getSharedInstance().play(1);
				 	clippyAgent.animate();
			    }, this));
		}, this);
		
		var clickTheX = function() {
			clippyAgent.speak("Your windows are frozen! Click the x's!");
			console.log("Playing sound 3");
			AssetManager.getSharedInstance().play(3);
		};
		
		SceneManager.performSequence([showClippy, clickTheX], [300, 8000]);
	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "windows95.scene/windows95.html"
	}
};