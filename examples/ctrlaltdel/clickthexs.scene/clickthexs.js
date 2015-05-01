var exported_scene = {
    id : "clickthexs",
	onPresent : function() {
		localStorage.ctrlaltdel_save = 'clickthexs';
		var manager = this.exportedVariables.windowManager;
		console.log("Printing exported variables: ");
		if (!this.exportedVariables['windowManager']) {
			console.error("Shit didn't transition properly.");
		}
		if (!this.exportedVariables['clippyAgent']) {
			console.error("Async shit didn't transition properly.");
		}
		console.log(this.exportedVariables);
		var clippyAgent = this.exportedVariables.clippyAgent;
		console.log(clippyAgent);
		AssetManager.getSharedInstance().preload(1);
		AssetManager.getSharedInstance().preload(3);

		var showClippy = $.proxy(function() {
					if (clippyAgent) {
					 	clippyAgent.show();
				        clippyAgent.moveTo(200,200);
					 	console.log("Playing sound 1");
					 	clippyAgent.speak("Looks like you're stuck inside the computer!");
					 	AssetManager.getSharedInstance().play(1);
				 	}
			}, this);
		
		var clickTheX = function() {
			if (clippyAgent) {
				clippyAgent.speak("Your windows are frozen! Click the x's!");
			}
			console.log("Playing sound 3");
			AssetManager.getSharedInstance().play(3);
		};
		
		SceneManager.performSequence([showClippy, clickTheX], [300, 4000]);
	},
	getHTML : function() {
		return null;
	},
	requires : "windows95"
};