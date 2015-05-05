var exported_scene = {
	id : "newScene1",
	onPresent : function() {
		//TODO: perform scene initialization / do things
      var state = 0;
      
      var asyncFunctionOne = function() {
        console.log("Async function one called.");
        return new Promise(function(resolve, reject) {
          //do something async
          $.get("/anything", {}, function(response) {
            $(".state").text('Loading async op number one...');
            console.log("load 1 done.");
            if (state != 0) {
              //something was modified
              $(".result").text("Error: State was modified - functions weren't executed in order.");
            }
            state = state + 1;
            setTimeout(resolve, 500);
          }).fail(function(){
            $(".state").text('Loading async op number two...');
            console.log("load 1 done.");
            if (state != 0) {
              //something was modified
              $(".result").text("Error: State was modified - functions weren't executed in order.");
            }
            state = state + 1;
            setTimeout(resolve, 500);
          });
        });
      };
      
      var asyncFunctionTwo = function() {
       	console.log("Async function two called.");
        return new Promise(function(resolve, reject) {
          //do something async
          $.get("/anythingelse", {}, function(response) {
            console.log("load 2 done.")
            if (state != 1) {
              //something was modified
              $("#testResult").text("Error: State was modified - functions weren't executed in order.");
            } else {
              $("#testResult").text("Success!");
            }
            
            state = state + 1;
            setTimeout(resolve, 500);
          }).fail(function(){
            if (state != 1) {
              //something was modified
              $("#testResult").text("Error: State was modified - functions weren't executed in order.");
            } else {
              $("#testResult").text("Success!");
            }
            
            state = state + 1;
            console.log("load 2 done.")
            setTimeout(resolve, 500);
          });
        });
      };
      
      //test case for performSequenceAsync
      SceneManager.performSequenceAsync([asyncFunctionOne, asyncFunctionTwo]).then(function() {
        console.log("Done! state: " + state);
        if (state == 2) {
          $(".testResult").text("Success!");
        } else {
          $(".testResult").text("Failure.");
        }
      });
      
      
	},
	onDestroy : function() {
		//TODO: perform some cleanup
	},
	preload : function() {
		//TODO: establish any resources this scene needs. Can return a promise for async actions.
	}, 
	
	/* If this scene follows another scene and doesn't need its own HTML, uncomment 'requires'*/
	//requires : 'other scene'
	/* If this scene has its own HTML, return the name of the file here. Alternatively, just return some HTML for the scene to load here. */
	getHTML : function() {
		return "newScene1.scene/newScene1.html";
	}
};