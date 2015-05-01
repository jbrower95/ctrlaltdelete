var exported_scene = {
    id : "explorer95",
	onPresent : function() {
		if (!this.exportedVariables) {
			console.error("[explorer95.js] Did not receive exported variables! This sucks...");
			this.exportedVariables = {};
		}

		if (this.exportedVariables.clippyAgent == null) {
			console.error("[explorer95.js] Clippy is missing!");
		}

		if (this.exportedVariables.windowManager == null) {
			console.error("[explorer95.js] The window manager is missing!");
		}

		var clippyAgent = this.exportedVariables.clippyAgent;
		var manager = this.exportedVariables.windowManager;

		AssetManager.getSharedInstance().preload(6);
		AssetManager.getSharedInstance().preload(7);

		var scareClippy = function() {
		        clippyAgent.moveTo(500,300);
			 	console.log("Playing sound 7");
			 	clippyAgent.speak('What are you doing in here? Get out! GET OUT!');
			 	AssetManager.getSharedInstance().play(7);
			 	clippyAgent.animate();
		    };
		
		var gabeThoughts = function() {
				console.log("Playing sound 6");
				AssetManager.getSharedInstance().play(6);
			};
		
		SceneManager.performSequence([gabeThoughts], [1000]);

		var hasClippyBeenScared = false;
		$('#explorerContent').hover(function() {
			if (!hasClippyBeenScared) {
				scareClippy();
				hasClippyBeenScared = true;
			}
		});
	},
	onDestroy : function() {

	},
	getHTML : function() {
		return null;
	},
	requires : "clickthexs"
};