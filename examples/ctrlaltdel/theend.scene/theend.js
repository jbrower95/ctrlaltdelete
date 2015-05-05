var exported_scene = {
	id : "theend",
	onPresent : function() {
		//TODO: perform scene initialization / do things
        var lockScreen = function(lock) {
          if (lock == true) {
              $("#desktop").css('pointer-events', 'none');
          } else {
              $("#desktop").css('pointer-events', 'auto');
          }
        };
		
      lockScreen(true);
      
      var clippyAgent = this.exportedVariables.clippyAgent;
      
      var initialize = function() {
      	AssetManager.getSharedInstance().play(13);
        clippyAgent.show();
        clippyAgent.moveTo(100,100);
        clippyAgent.speak("How'd it go... you're back. Did you get him?")
      };
      
      var speechTwo = function() {
        clippyAgent.speak("You killed him!")
        AssetManager.getSharedInstance().stop(13);
      };
      
      var speechThree = function() {
        clippyAgent.speak("Please free me Gabe.");
      };
	},
	onDestroy : function() {
		//TODO: perform some cleanup
      AssetManager.getSharedInstance().stop(13);
	},
	preload : function() {
		//TODO: establish any resources this scene needs. Can return a promise for async actions.
      AssetManager.getSharedInstance().preload(13)
	}, 
	
	/* If this scene follows another scene and doesn't need its own HTML, uncomment 'requires'*/
	requires : 'windows95'
};