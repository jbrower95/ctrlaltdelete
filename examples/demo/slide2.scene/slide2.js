var exported_scene = {
	id : "slide2",
	onPresent : function() {
      	clippy.load('Clippy', function(agent) {
          var clippyAgent = agent;
          clippyAgent.show();
          clippyAgent.moveTo(550, 350);
          clippyAgent.play('Searching');
          setInterval(function() {
            clippyAgent.animate();
          }, 1000);
        });
      
      var numWindows = 0;
        var cap = 7;

        function rain(win, dur) {
          console.log("hello?");
            var height = $("#content").height();
            win.animate({ top: '+=' + height }, {
              duration: dur,
              easing: 'linear',
              step: function(now, fx){
                win.css("top", now);
              },
              complete: function() {
                win.remove();
                numWindows--;
              }
            });

        }

        function updateWindows() {
            while (numWindows < cap) {
                var win = $(document.createElement('div'));
                win.addClass("window");
                var left = Math.floor((Math.random() * ($(window).width() - 75)) + 1);
                win.css('left', left + 'px');
                $('#content').append(win);
                numWindows++;
                var dur = Math.floor((Math.random() * 4000) + 2000);
                rain(win, dur);
            }
        }

        setInterval(function(){updateWindows()},1000);
	},
	onDestroy : function() {
		//TODO: perform some cleanup
	},
	preload : function() {
		return new Promise($.proxy(function(resolve, reject) {
          console.log("[explorer95.js] Loading new Clippy.");
          console.log(clippy);
          clippy.load('Clippy', $.proxy(function(agent) {
            console.log("Loaded new clippy!");
            console.log(this);
            this.exportedVariables.clippyAgent = agent;
            resolve();
          }, this));
        }, this));
	}, 
	
	/* If this scene follows another scene and doesn't need its own HTML, uncomment 'requires'*/
	//requires : 'other scene'
	/* If this scene has its own HTML, return the name of the file here. Alternatively, just return some HTML for the scene to load here. */
	getHTML : function() {
		return "slide2.scene/slide2.html";
	}
};