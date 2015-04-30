var exported_scene = {
    id : "windows95",
	onPresent : function() {
		var manager = new WindowManager("desktop");
		
		var taskManager = manager.inflate("taskManager");
		taskManager.setTitle("Task Manager");
		taskManager.setIcon("images/task_manager_icon.png");
		taskManager.moveTo(200, 120);
		taskManager.setActive(true);
		manager.addWindow(taskManager);

		var myComputer = manager.inflate("explorer");
		myComputer.setTitle("My Computer");
		myComputer.setIcon("images/my_computer_icon.png");
		myComputer.moveTo(140, 50);
		myComputer.setEnabled(false);
		manager.addWindow(myComputer);

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

		$(function() {
			$(".drag").draggable({
		      	stop: function(event, ui) {
		        	if (collision($("#recycle"), ui.offset)) {
		        		$(this).remove();
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
		            // evaluates like this:
		            // return event !== false ? false : true;
		        }
		    });
		    $(".drop").droppable();
		});

		this.exportedVariables.windowManager = manager;
		
		var clippyAgent;

		AssetManager.getSharedInstance().preload(1);
		AssetManager.getSharedInstance().preload(3);

		if (!this.exportedVariables) {
			this.exportedVariables = {};
		}

		var showClippy = $.proxy(function() {
			 clippy.load('Clippy', $.proxy(function(agent) {
					this.exportedVariables.clippyAgent = agent;
			    }, this));
		}, this);
		
		var clickTheX = function() {
			clippyAgent.speak("Your windows are frozen! Click the x's!");
			console.log("Playing sound 3");
			AssetManager.getSharedInstance().play(3);
		};
		
		SceneManager.performSequence([showClippy, clickTheX], [300, 8000]);
	},
	getHTML : function() {
		return "windows95.scene/windows95.html"
	}
};