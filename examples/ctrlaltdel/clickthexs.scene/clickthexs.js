var exported_scene = {
    id : "clickthexs",
	onPresent : function() {
		var manager = this.exportedVariables.windowManager;
		
		var clippyAgent = this.exportedVariables.clippyAgent;

		AssetManager.getSharedInstance().preload(1);
		AssetManager.getSharedInstance().preload(3);

		var showClippy = $.proxy(function() {
				 	clippyAgent.show();
			        clippyAgent.moveTo(200,200);
				 	console.log("Playing sound 1");
				 	clippyAgent.speak("Looks like you're stuck inside the computer!");
				 	AssetManager.getSharedInstance().play(1);
				 	clippyAgent.animate();
		}, this);
		
		var clickTheX = function() {
			clippyAgent.speak("Your windows are frozen! Click the x's!");
			console.log("Playing sound 3");
			AssetManager.getSharedInstance().play(3);
		};
		
		SceneManager.performSequence([showClippy, clickTheX], [300, 8000]);
	},
	getHTML : function() {
		return null;
	}
};