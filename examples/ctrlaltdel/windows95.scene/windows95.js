var exported_scene = {
    id : "windows95",
	onPresent : function() {
		var manager = new WindowManager("desktop");
		var win = manager.inflate("taskManager");
		manager.addWindow(win);
		
		var clippyAgent;
		
		var showClippy = function() {
			 clippy.load('Clippy', function(agent) {
			        clippyAgent = agent;
				 	clippyAgent.show();
			        clippyAgent.moveTo(200,200);
			        clippyAgent.speak('Looks like your stuck inside a computer!');
			        clippyAgent.animate();
			    });
		};
		
		var clickTheX = function() {
			clippyAgent.speak("Your windows are frozen! Click the x's!");
		}
		
		SceneManager.performSequence([showClippy, clickTheX], [300, 900]);
		
		
		setTimeout(function() {
		
		}, 800);
	},
	onDestroy: function() {

	},
	getHTML : function() {
		return "windows95.scene/windows95.html"
	}
};