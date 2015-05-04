var exported_scene = {
    id : "windows95",
    preload : function() {

    	console.log("Initializing windows 95...");

		var desktop = document.createElement("div");
		desktop.id = "desktop";
		this.element.appendChild(desktop);

    	var manager = new WindowManager("desktop");

		var taskManager = manager.inflate("taskManager");
		taskManager.setTitle("Task Manager");
		taskManager.setIcon("images/task_manager_icon.png");
		taskManager.moveTo(200, 120);
		taskManager.setActive(true);
		taskManager.setXHandler(function() {
			console.log("x-ing out");
			$(this.element).remove();
			manager.removeWindow(taskManager);
			SceneManager.getSharedInstance().presentScene("paint");
		});
		manager.addWindow(taskManager);

		var paint = manager.inflate("paint");
		paint.setTitle("untitled - Paint");
		paint.moveTo(60, 100);
		paint.setEnabled(false);
		paint.setCancellable(false);
		paint.setIcon('images/paint_icon.png')
		manager.addWindow(paint);

		var myComputer = manager.inflate("myComputer");
		myComputer.setTitle("My Computer");
		myComputer.setIcon("images/my_computer_icon.png");
		myComputer.moveTo(140, 50);
		myComputer.setEnabled(false);
		myComputer.setXHandler(function() {
			console.log("x-ing out");
			$(this.element).remove();
			manager.removeWindow(myComputer);
		});
		manager.addWindow(myComputer);

		this.exportedVariables['windowManager'] = manager;

		if (!this.exportedVariables['gabe']) {

			//LOAD GABE


		}

		var clippyAgent;

		AssetManager.getSharedInstance().preload(1);
		AssetManager.getSharedInstance().preload(3);

		return new Promise($.proxy(function(resolve, reject) { 
			if (!this.exportedVariables.clippyAgent) {
				clippy.load('Clippy', $.proxy(function(agent) {
						console.log("Loaded clippy!");
						console.log(this);
						this.exportedVariables.clippyAgent = agent;
						resolve();
				    }, this));
			} else {
				resolve();
			}
		}, this));
    },
	getHTML : function() {
		return "windows95.scene/windows95.html"
	}
};