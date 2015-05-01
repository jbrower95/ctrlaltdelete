var exported_scene = {
    id : "explorer95",
    preload : function() {
    	if (!this.exportedVariables) {
			console.error("[explorer95.js] Did not receive exported variables! This sucks...");
			this.exportedVariables = {};
		}

		if (this.exportedVariables.windowManager == null) {
			console.error("[explorer95.js] The window manager is missing!");
		}

		var manager = this.exportedVariables.windowManager;
		var taskManager = manager.getWindowWithId("taskManager");
		if (!taskManager) {
			return;
		}
		taskManager.setXHandler(function() {
			$(this.element).remove();
			manager.removeWindow(taskManager);
		});
		taskManager.xHandler();
		manager.removeWindow(taskManager);
    },
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
		var myComputer = manager.getWindowWithId("myComputer");
		myComputer.setEnabled(true);
		myComputer.setCancellable(false);

		AssetManager.getSharedInstance().preload(6);
		AssetManager.getSharedInstance().preload(7);
		AssetManager.getSharedInstance().preload(8);
		AssetManager.getSharedInstance().preload(9);
		AssetManager.getSharedInstance().preload(10);

		var recycleClip1 = function() {
			clippyAgent.moveTo(400, 400);
			clippyAgent.speak("I had a family that loved me. Everyone around me loved me. I was perfect!");
			clippyAgent.speak("I was going to get a promotion. I was going to move somewhere. I was on to big things!");
			clippyAgent.speak("But then you had to come along and get stuck in my computer...");
			AssetManager.getSharedInstance().play(8);
			clippyAgent.play('Processing');
		}
		var recycleClip2 = function() {
			clippyAgent.moveTo(600, 200);
			var line0 = function() {clippyAgent.speak("I had dreams... we were going to move out west... be together forever.");};
			var line1 = function() {clippyAgent.speak("Then I got turned into a paperclip...");};
			var line2 = function() {clippyAgent.speak("...and now, she's dead! And there's nothing I can do because I-I'm a paperclip.");};
			var line3 = function() {clippyAgent.speak("He makes me hold his papers. There's nothing I can do to get out!");};
			var line4 = function() {clippyAgent.speak("I need you- I need you to get me out of here.");};
			var line5 = function() {clippyAgent.speak("Please... I got to get out of here. Oh god, I'm doomed...");};
			var lines = [line0, line1, line2, line3, line4, line5];
			SceneManager.performSequence(lines, [100, 8000, 8000, 6000, 8000, 6000]);
			AssetManager.getSharedInstance().play(9);
			clippyAgent.play("LookDown");
		}
		var recycleClip3 = function() {
			clippyAgent.moveTo(550, 350);
			var line0 = function() {clippyAgent.speak("We can take him down, you know. Together... I'll help you.");};
			var line1 = function() {clippyAgent.speak("We just have to go through th-that link over there.");};
			var line2 = function() {clippyAgent.speak("We can kill him. We can kill him. We can kill him. We can kill him!");};
			var lines = [line0, line1, line2];
			SceneManager.performSequence(lines, [100, 5000, 6000]);
			AssetManager.getSharedInstance().play(10);
			clippyAgent.play("GestureRight");
		}
		var recycleDialog = {3:recycleClip1, 4:recycleClip2, 5:recycleClip3};

		var scareClippy = function() {
	        clippyAgent.moveTo(500,300);
		 	console.log("Playing sound 7");
		 	clippyAgent.speak('What are you doing in here? Get out! GET OUT!');
		 	AssetManager.getSharedInstance().play(7);
		 	clippyAgent.play('Save');
	    };
		
		var gabeThoughts = function() {
			console.log("Playing sound 6");
			AssetManager.getSharedInstance().play(6);
		};
		
		SceneManager.performSequence([gabeThoughts], [1000]);

		var hasClippyBeenScared = false;
		$('#myComputerContent').hover(function() {
			if (!hasClippyBeenScared) {
				scareClippy();
				hasClippyBeenScared = true;
			}
		});

		function collision(obj1, ui_pos) {
	      	var x1 = obj1.offset().left;
	      	var y1 = obj1.offset().top;
	      	var h1 = obj1.outerHeight(true);
	      	var w1 = obj1.outerWidth(true);
	      	var b1 = y1 + h1;
	      	var r1 = x1 + w1;
	      	var x2 = ui_pos.left;
	      	var y2 = ui_pos.top;
	      	var h2 = 80;
	      	var w2 = 80;
	      	var b2 = y2 + h2;
	      	var r2 = x2 + w2;
	        
	      	if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
	      	return true;
	    }

	    //recycle bin functionality
	    var recycleCount = 0;
	    var numClippyFiles = 5;

	    var recycleClippyFile = function() {
	    	recycleCount++;
	    	if (recycleDialog[recycleCount]) {
	    		recycleDialog[recycleCount]();
	    	}
	    	if (recycleCount >= numClippyFiles) {
	    		setTimeout(function() {SceneManager.getSharedInstance().presentScene("credits");}, 17000);
	    	}
	    }

		var refreshWindows = function() {
			console.log("Refreshing windows");
			console.log(manager.windows);
			// disable each handler to avoid double binding
			$(".windowIcon").off();
			$(".drop").off();
			// enable each handler
			$(".windowIcon").draggable({
		      	stop: function(event, ui) {
		        	if (collision($("#recycle"), ui.offset)) {
		        		$(this).remove();
		        		if (!$(this).hasClass("clippyFile")) {
		        			$("#desktop").prepend("<div class='bluescreen'></div>");
		        			$(".bluescreen").prepend("<img src=images/blue_screen_of_death.png>");
		        			$(document).keydown(function(e) {
		        				$(".bluescreen").remove();
		        			});
		        		} else {
		        			recycleClippyFile();
		        		}
		        		$("#recycleIcon").attr('src', "images/full_recycle_bin.png");
		        	}
		      	},
		      	revert : function(event, ui) {
		      		if (!$(this)) {
		      			return false;
		      		}
		            $(this).data("ui-draggable").originalPosition = {
		                top : 0,
		                left : 0
		            };
		            return !event;
		        }
		    });
		    $(".windowIcon").dblclick(function(e) {
		    	console.log("Double clicked: " + $(this).attr('data-opens'));
		    	// remove class ".selectedIcon" from all other icons
				$(".selectedIcon").map(function() {
			   		$(this).removeClass("selectedIcon");
				});
				// add class ".selectedIcon" to this icon
		    	$(this).addClass("selectedIcon");
		    	if ($(this).hasClass("folder")) {
		    		console.log("Opening a new folder.");
		    		var nextFolder = $(this).attr("data-opens");
		    		var nextFolder = manager.inflate(nextFolder);
					nextFolder.setTitle("Explorer");
					nextFolder.setIcon("images/open_folder.png");
					nextFolder.setActive(true);
					nextFolder.moveTo(180, 100);
					manager.addWindow(nextFolder);
					console.log(nextFolder);
					refreshWindows();
		    	}
		    });
		    $(".drop").droppable();
		}
		refreshWindows();
	},
	onDestroy : function() {
		if (!this.exportedVariables) {
			console.error("[explorer95.js] Did not receive exported variables! This sucks...");
			this.exportedVariables = {};
		}

		if (this.exportedVariables.clippyAgent == null) {
			console.error("[explorer95.js] Clippy is missing!");
		}

		var clippyAgent = this.exportedVariables.clippyAgent;
		clippyAgent.hide();
	},
	getHTML : function() {
		return null;
	},
	requires : "clickthexs"
};