var exported_scene = {
    id : "windows95",
	onPresent : function() {
		var manager = new WindowManager("desktop");
		var win = manager.inflate("taskManager");
		manager.addWindow(win);
		
		var clippyAgent;

		AssetManager.getSharedInstance().preload(1);
		AssetManager.getSharedInstance().preload(2);

		var showClippy = function() {
			 clippy.load('Clippy', function(agent) {
			        clippyAgent = agent;
				 	clippyAgent.show();
			        clippyAgent.moveTo(200,200);
				 	clippyAgent.speak('Looks like your stuck inside a computer!');
				 	AssetManager.getSharedInstance().play(1);
				 	clippyAgent.animate();
			    });
		};
		
		var clickTheX = function() {
			clippyAgent.speak("Your windows are frozen! Click the x's!");
			AssetManager.getSharedInstance().play(2);
		};
		
		SceneManager.performSequence([showClippy, clickTheX], [300, 900]);
	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "windows95.scene/windows95.html"
	}
};