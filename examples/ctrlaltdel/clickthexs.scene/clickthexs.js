var exported_scene = {
    id : "clickthexs",
	onPresent : function() {
		localStorage.ctrlaltdel_save = 'clickthexs';

		AssetManager.getSharedInstance().preload(1);
		AssetManager.getSharedInstance().preload(3);
		AssetManager.getSharedInstance().preload(4);

		if (!this.exportedVariables) {
			console.error("[clickthexs.js] Did not receive any export variables.");
		}

		var manager = this.exportedVariables.windowManager;
		var clippyAgent = this.exportedVariables.clippyAgent;

		if (!manager) {
			console.error("[clickthexs.js] Did not receive the window manager.");
		}

		if (!clippyAgent) {
			console.error("[clickthexs.js] Did not receive the Clippy agent.");
		}

		var taskManager = manager.getWindowWithId("taskManager");
		if (taskManager) {
			taskManager.setXHandler(function() {
				console.log("x-ing out");
				$(this.element).remove();
				manager.removeWindow(taskManager);
				clippyAgent.speak("Muahahaha...");
				AssetManager.getSharedInstance().play(4);
				clippyAgent.moveTo(400, 50);
				clippyAgent.play("GetArtsy");
				setTimeout(function() {
					SceneManager.getSharedInstance().presentScene("paint");
				}, 2000);
			});
		} else {
			console.error("[clickthexs.js] Did not receive the task manager window.");
		}

		var lockScreen = function(lock) {
			if (lock == true) {
				$("#desktop").css('pointer-events', 'none');
			} else {
				$("#desktop").css('pointer-events', 'auto');
			}
		}

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

		lockScreen(true);
		setTimeout(function () {lockScreen(false);}, 8000);
		SceneManager.performSequence([showClippy, clickTheX], [300, 4000]);
	},
	getHTML : function() {
		return null;
	},
	requires : "windows95"
};