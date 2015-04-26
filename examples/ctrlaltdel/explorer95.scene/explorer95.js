var exported_scene = {
    id : "explorer95",
	onPresent : function() {
		console.log("[explorer95.js] The onPresent method of explorer95 has been called.");
		if (!this.exportedVariables) {
			console.error("[explorer95.js] Did not receive exported variables! This sucks...");
			this.exportedVariables = {};
		}

		if (this.exportedVariables.clippy == null) {
			console.error("[explorer95.js] Clippy is missing!");
		} else {
			console.log("[explorer95.js] Found Clippy! Hooray!");
		}

		var clippyAgent = this.exportedVariables.clippy;

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
		//return "explorer95.scene/explorer95.html";
		return null;
	},
	requires : "windows95"
};