var exported_scene = {
    id : "explorer95",
	onPresent : function() {
		var manager = new WindowManager("desktop");
		var win = manager.inflate("explorer");
		win.moveTo(150, 200);
		manager.addWindow(win);
		
		if (!this.exportedVariables) {
			this.exportedVariables = {};
		}

		if (this.exportedVariables.clippy == null) {
			console.error("[explorer95.js] Clippy is missing!");
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
		return "explorer95.scene/explorer95.html";
	},
	requires : "windows95"
};