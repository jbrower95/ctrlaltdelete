<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>

    <!-- Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Lato:400,700,900,300' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Merriweather:400,700,900,300' rel='stylesheet' type='text/css'>

    <!-- Stylesheets -->
    <link href="http://codemirror.net/lib/codemirror.css" rel='stylesheet' type='text/css'>
    <link href="http://codemirror.net/theme/monokai.css" rel='stylesheet' type='text/css'>

    <link rel="stylesheet" href="lib/css/editor.css">
    <link rel="stylesheet" href="https://rawgit.com/enyo/dropzone/master/dist/dropzone.css">
</head>
<body>
    <div class="container clearfix" id="${isNew}">
        <div class="sidebar c${color}" id="${color}">
            <div class="scene-list">
                <div class="over">
                    <img class="back" src="lib/images/left.svg">
                </div>
                <span class="side-title curr">${title}</span>
                <ul class="list">
                    
                </ul>
            </div>
            
            <div class="asset-zone">
                <form action="/${id}" class="dropzone dz-clickable" id="asset-upload-field">
                    <div class="fallback">
                        <input name="file" type="file" multiple />
                    </div>
                </form>
            </div>
        </div>

        <div class="main">
            <div id="sceneEdit" style="display: none;">
                <input type="text" class="title" name="sceneTitle" value="" />

                <div class="settings">
                    <span class="settings-title">Settings</span>

                    <div class="settings-bar">
                        <div class="bar-block label">Scene ID</div>
                        <div class="bar-block answers">
                            <input type="text" name="sceneId" id="sceneIdInput" value=""/>
                        </div>
                    </div>

                    <!--<div class="settings-bar">
                        <div class="bar-block label">Previous Scene</div>
                        <div class="bar-block answers">
                            <select>
                            </select>
                        </div>
                    </div>-->
                </div>

                <!-- Scene.js -->
                <div class="editor-bar">
                    <div class="editor-head clearfix">
                        <div class="left" id="scenejs">
                            
                        </div>
                        <div class="right" onclick="javascript:toggleJs()">
                            <svg x="0px" y="0px" width="20px" onclick="javascript:toggleCss()"
                                 height="20px" viewBox="0 0 400 400" enable-background="new 0 0 400 400" class="minus">
                            <g id="Layer_1">
                                <rect x="175" width="50" height="400"/>
                            </g>
                            <g id="Layer_2">
                                <rect y="175" fill="#575fcf" width="400" height="50"/>
                            </g>
                            </svg>
                        </div>
                    </div>

                    <textarea name="js" class="editor" id="js">
                    </textarea>
                </div>

                <!-- Scene.html -->
                <div class="editor-bar">
                    <div class="editor-head clearfix">
                        <div class="left" id="scenehtml">
                            
                        </div>
                        <div class="right" onclick="javascript:toggleHtml()">
                            <svg x="0px" y="0px" width="20px" onclick="javascript:toggleCss()"
                                 height="20px" viewBox="0 0 400 400" enable-background="new 0 0 400 400" class="minus">
                            <g id="Layer_1">
                                <rect x="175" width="50" height="400"/>
                            </g>
                            <g id="Layer_2">
                                <rect y="175" fill="#575fcf" width="400" height="50"/>
                            </g>
                            </svg>
                        </div>
                    </div>

                    <textarea name="html" class="editor" id="html">
                    </textarea>
                </div>

                <!-- Scene.css -->
                <div class="editor-bar">
                    <div class="editor-head clearfix">
                        <div class="left" id="scenecss">
                            
                        </div>
                        <div class="right">
                            <svg x="0px" y="0px" width="20px" onclick="javascript:toggleCss()"
                                 height="20px" viewBox="0 0 400 400" enable-background="new 0 0 400 400" class="minus">
                            <g id="Layer_1">
                                <rect x="175" width="50" height="400"/>
                            </g>
                            <g id="Layer_2">
                                <rect y="175" fill="#575fcf" width="400" height="50"/>
                            </g>
                            </svg>
                        </div>
                    </div>

                    <textarea name="css" class="editor" id="css">
                    </textarea>
                </div>

                <div class="save-bar">
                    <button class="delete button" id="sceneDelete">Delete</button>
                    <button class="test button">Test</button>
                </div>
            </div>

            <div id="generalEdit">
                <input type="text" class="title" name="experienceTitle" value="${title}" />

                <textarea class="description" name="experienceDesc">${description}</textarea>

                <div class="settings">
                    <span class="settings-title">Settings</span>

                    <div class="settings-bar">
                        <div class="bar-block label">ID (this is your path)</div>
                        <div class="bar-block answers">
                            <input type="text" name="id" value="${id}"/>
                        </div>
                    </div>

                    <div class="settings-bar">
                        <div class="bar-block label">Order Scores</div>
                        <div class="bar-block answers">
                            <form name="score" id="${highToLow}">
                                <!-- Low to High Score Ranking -->
                                <input type="radio" name="scoreRanking" id="low-to-high" value="low-to-high" checked>
                                <label for="low-to-high" class="button c${color}">Low to High</label>
                                <!-- High to Low Score Ranking -->
                                <input type="radio" name="scoreRanking" id="high-to-low" value="high-to-low">
                                <label for="high-to-low" class="button c${color}">High to Low</label>
                            </form>
                        </div>
                    </div>

                    <div class="settings-bar">
                        <div class="bar-block label">Theme Color</div>
                        <div class="bar-block answers">
                            <form name="colors">
                                <input type="radio" name="themeColor" id="00bad6" value="00bad6" />
                                <label for="00bad6" class="color"><div class="color-block c00bad6"></div></label>

                                <input type="radio" name="themeColor" id="ef563d" value="ef563d" />
                                <label for="ef563d" class="color"><div class="color-block cef563d"></div></label>

                                <input type="radio" name="themeColor" id="ffaf00" value="ffaf00" />
                                <label for="ffaf00" class="color"><div class="color-block cffaf00"></div></label>

                                <input type="radio" name="themeColor" id="F5C70C" value="F5C70C" />
                                <label for="F5C70C" class="color"><div class="color-block cF5C70C"></div></label>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="save-bar">
                    <button class="delete button" id="deleteExperience">Delete</button>
                    <button class="save button">Save
                    <div class="save-info"></div>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://rawgit.com/enyo/dropzone/master/dist/dropzone.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="lib/js/notify.min.js"></script>
    <!-- CodeMirror Script -->
    <script src="http://codemirror.net/lib/codemirror.js"></script>
    <script src="http://codemirror.net/mode/javascript/javascript.js"></script>
    <script src="http://codemirror.net/mode/css/css.js"></script>
    <script src="https://codemirror.net/mode/xml/xml.js"></script>
    <script src="http://codemirror.net/mode/htmlmixed/htmlmixed.js"></script>
    <script src="http://codemirror.net/addon/selection/active-line.js"></script>
    <script src="http://codemirror.net/addon/edit/matchbrackets.js"></script>
    <script src="http://codemirror.net/addon/edit/closebrackets.js"></script>
    <script src="http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js"></script>
    <script>

        // Shim jQuery to add/remove/toggle SVG classes
        $.fn.addClassSVG = function(className) {
          $(this).attr('class', function(index, existingClassNames) {
            return existingClassNames + ' ' + className;
          });
          return this;
        }

        $.fn.removeClassSVG = function(className) {
          $(this).attr('class', function(index, existingClassNames) {
            var re = new RegExp(className, 'g');
            return existingClassNames.replace(re, '');
          });
          return this;
        }

        $.fn.toggleClassSVG = function(className) {
          var elClass = $(this).attr('class'),
              re = new RegExp(className, 'g');
          if (re.test(elClass)) {
            $(this).removeClassSVG(className);
          } else {
            $(this).addClassSVG(className);
          }
          return this;
        }

        // Trigger transition on click
        $('svg').on('click', function() {
          $(this).toggleClassSVG('minus');
        });
    	
    	//hide/show JS, CSS, and HTML.
    	function toggleJs() {
    		var editors = $(".editor-bar");
    		console.log(editors);
    		
    		var indicator = $(editors[0]).find("right");
    		
    		$(editors[0]).find(".CodeMirror").slideToggle({duration: 200});
    	}
    	
    	function toggleHtml() {
    		var editors = $(".editor-bar");
    		console.log(editors);
    		$(editors[1]).find(".CodeMirror").slideToggle({duration: 200});
    	}
    	
    	function toggleCss() {
    		var editors = $(".editor-bar");
    		console.log(editors);
    		$(editors[2]).find(".CodeMirror").slideToggle({duration: 200});
    	}
    	
    	
        
    
    
        $(document).ready(function() {
            var isNew = $(".container").attr('id');

            /* Editors */
            var cmJs = CodeMirror.fromTextArea(document.getElementById("js"), {
                mode: "javascript",
                lineNumbers: true,
                styleActiveLine: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                theme: "monokai"
              });
              
           

            var cmHtml = CodeMirror.fromTextArea(document.getElementById("html"), {
                mode: "htmlmixed",
                lineNumbers: true,
                styleActiveLine: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                theme: "monokai"
              });

			

            var cmCss = CodeMirror.fromTextArea(document.getElementById("css"), {
                mode: "css",
                lineNumbers: true,
                styleActiveLine: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                lineWrapping: true,
                theme: "monokai"
              });
              
          

            /* Globals */
            var scenes = [];
            var onScene = false;
            var currentSceneId = null;
            var title = $("input[name=experienceTitle]").val();
            var id = $("input[name=id]").val();
            var oldId;
            if (isNew === "false") {
                oldId = id;
            } else {
                oldId = null;
            }
            var color = $(".sidebar").attr('id');
            var description = $("textarea[name='experienceDesc']").val();
            var highToLow = $("form[name=score]").attr('id');

            var colorArray = ["00bad6", "ef563d", "ffaf00", "F5C70C"];
            var scoreArray = ["false", "true"];

            showCheckedColor(color);
            showCheckedScore(highToLow);
            
            if (isNew === "false") {
                listScenes();
            }
			
			function sceneIdChange() {
				
				console.log("Saving new scene name...");
				
				var newSceneName = $("#sceneIdInput").val();
				
				if (newSceneName != currentSceneId) {
					
					//a change occurred
					var url = "/" + id + "/" + currentSceneId + "/refactor?newid=" + newSceneName;
           		
           			console.log("new scene name: " + newSceneName);
           			console.log("old scene name: " + currentSceneId);
           		
					$.post(url, function(response) {
							//it worked
							listScenes();
							currentSceneId = newSceneName;
							$("#" + currentSceneId).addClass("curr");
							$.notify("Remember to change your scene ID anywhere you reference this scene!", "warning");
					}).fail(function(response) {
						var reason = "An unknown error occurred.";
						var responseObj = JSON.parse(response.responseText);
						if (responseObj.error) {
							reason = responseObj.error;
						}
					
						$("#sceneIdInput").val(currentSceneId);
						$.notify("Couldn't change scene ID: " + reason, "error");
					});
				} 
			}
			
			$("#sceneIdInput").blur(sceneIdChange);
			
			 /* Handlers for saving the files */
           cmCss.on("change", function(cm, change) {
           		var code = cmCss.getValue();
           		console.log(code);
           		console.log(typeof code);
           		var baseUrl = "/" + id + "/" + currentSceneId + "/edit?type=";
           		$.post(baseUrl + "css", code, function(response) {
           			$.notify("Saved!", "success");
                    console.log("Update succeeded! (css)");
           		}).fail(function(){
                    $.notify("Couldn't save CSS.", "error");
                });
			  });
			  
			cmJs.on("change", function(cm, change) {
				var code = cmJs.getValue();
				console.log(code);
				$.post("/" + id + "/" + currentSceneId + "/edit?type=js", code , function(response) {
                    $.notify("Saved!", "success");
           			console.log("Update succeeded! (js).");
           		}).fail(function(){
                    $.notify("Couldn't save Javascript.", "error");
                });
			  });
			  
			cmHtml.on("change", function(cm, change) {
				var code = cmHtml.getValue();
				console.log(code);
				$.post("/" + id + "/" + currentSceneId + "/edit?type=html", code, function(response) {
                    $.notify("Saved!", "success");
           			console.log("Updated succeeded! (html)");
           		}).fail(function() {
                    $.notify("Couldn't save HTML.", "error");
                });
			  });

            

            /*function fillSelectOptions(scene) {
                $("select").html("");
                $("select").append("<option value=''></option>");
                for (s of scenes) {
                    if (s !== scene) {
                        var option = "<option value='" + s + "'>" + s + "</option>";
                        $("select").append(option);
                    }
                }
            }

            $("select").change(function() {
                console.log($(this).val());
                var val = $(this).val();
                if (val === "") {
                    htmlVisible(true);
                } else {
                    htmlVisible(false);
                }
            });*/

            /**
            * Change editing div from scene editor to general.
            */
            $(".side-title").click(function() {
                if (onScene) {
                    $(".inactive").removeClass("inactive");
                    $("#sceneEdit").fadeOut();
                    $("#generalEdit").fadeIn();
                    onScene = false;
                    $(".curr").removeClass("curr");
                    $(this).addClass("curr");
                }
            });

            $(".back").click(function() {
                window.location.replace("/maker");
            });
            

            /**
            * Uses a get request to give a list of
            * scenes, then appends them to the scene list
            * in the sidebar.
            *
            * Returns a promise to load the scenes
            */
            function listScenes() {
            
            	return new Promise(function(resolve, reject) {
            
	                var list = $(".list");

                    list.empty();
                    list.append("<li id='Main'>Main</li>");
	
	                $.get("/" + id + "/scenes", function(responseJSON){
	                    var responseObject = JSON.parse(responseJSON);
	                    for (o in responseObject) {
	                        var scene = responseObject[o].id;
	                        scenes.push(scene);
	                        var s = "<li id=" + scene + ">" + scene + "</li>";
	                        list.append(s);
	                    }
	
	                    $(".list").append("<li id='newScene'>+</li>");
	
	                    // Set up scene click handlers
	                    $("ul.list li").click(function() {
                            if (!onScene) {
                                onScene = true;
                                $("#generalEdit").fadeOut();
                                $("#sceneEdit").fadeIn();
                            }

                            $(".curr").removeClass("curr");
                            $(this).addClass("curr");

                            $(".inactive").removeClass("inactive");

                            var scene = $(this).attr('id');

                            if (scene === "newScene") {
                                fillNewScene();
                                return;
                            }
                            
                            if (scene === "Main") {
                                fillMainInfo();
                            } else {
                               fillSceneInfo(scene); 
                           }
                        });
	                    
	                    resolve();
	                });
	        	});
            }

            function fillNewScene() {
                $.ajax({
                    type: "PUT",
                    url: "/" + id + "/newscene",
                    success: function(result) {
                        result = JSON.parse(result);
                        var id = result.scene.id;
                        var js = result.scene.js;
                        var html = result.scene.html;
                        var css = result.scene.css;
                        var scene = "New Scene";
						currentSceneId = id;
                        fillFields(scene, id, js, html, css);
                        listScenes().then(function() {
                        	console.log(id);
                        	console.log(document.getElementById(id));
                        	$(".curr").removeClass("curr");
                        	$("li#" + id).addClass("curr");
                        });
                    }
                });
            }

            function fillMainInfo() {
                $.get("/" + id + "/main/edit", function(responseJSON) {
                    var responseObject = JSON.parse(responseJSON);
                    console.log(responseObject);
                    var sceneJs = responseObject.js;
                    var sceneHtml = responseObject.html;
                    var sceneCss = responseObject.css;

                    $("input[name=sceneTitle]").val("");
                    $("input[name=sceneId]").val("");
                    $("input[name=sceneTitle]").addClass("inactive");
                    $(".settings").addClass("inactive");

                    $("#scenejs").html("index.js");
                    $("#scenehtml").html("index.html");
                    $("#scenecss").html("index.css");

                    cmJs.setValue(sceneJs);
                    cmHtml.setValue(sceneHtml);
                    cmCss.setValue(sceneCss);
                });
            }

            /**
            * Uses a get request to fill the scene fields.
            */
            function fillSceneInfo(scene) {
                $.get("/" + id + "/" + scene + "/edit", function(responseJSON){
                    var responseObject = JSON.parse(responseJSON);
                    var sceneId = responseObject.value.id;
                    var sceneJs = responseObject.value.js;
                    var sceneHtml = responseObject.value.html;
                    var sceneCss = responseObject.value.css;
	
					currentScene = sceneId;
                    currentSceneId = sceneId;
                    fillFields(scene, sceneId, sceneJs, sceneHtml, sceneCss);
                   // fillSelectOptions(scene);
                });
            }

            function fillFields(scene, sceneId, sceneJs, sceneHtml, sceneCss) {
                $("input[name=sceneTitle]").val(scene);
                $("input[name=sceneId]").val(sceneId);

                $("#scenejs").html(sceneId + ".js");
                $("#scenehtml").html(sceneId + ".html");
                $("#scenecss").html(sceneId + ".css");

                if (sceneJs === undefined || sceneJs === "") {
                    sceneJs = "\t";
                }

                if (sceneHtml === undefined || sceneHtml === "") {
                    sceneHtml = "\t";
                }

                if (sceneCss === undefined || sceneCss === "") {
                    sceneCss = "\t";
                }

                cmJs.setValue(sceneJs);
                cmHtml.setValue(sceneHtml);
                cmCss.setValue(sceneCss);
            }

            $("textarea[name=js]").change(function() {
                if (onScene) {
                    onSceneChange($("textarea[name=js]").val(), "js", $("input[name=sceneId]").val());
                }
            });

            $("textarea[name=html]").change(function() {
                if (onScene) {
                    onSceneChange($("textarea[name=html]").val(), "html", $("input[name=sceneId]").val());
                }
            });

            $("textarea[name=css]").change(function() {
                if (onScene) {
                    onSceneChange($("textarea[name=css]").val(), "css", $("input[name=sceneId]").val());
                }
            });

            function onSceneChange(text, type, scene) {
                console.log("Scene changed!");
                var input = {"text" : text, "type" : type};
                $.post("/" + id + "/" + scene + "/edit", input, function(responseJSON){
                    console.log(responseJSON);
                });
                /*var txt = new Blob([editor.val()], {type:'text/plain'});
                $.ajax({
                    type: "POST",
                    url: "/" + id + "/" + scene + "/edit",
                    data: { myText: txt },
                    success: function(result) {
                        console.log('Success : ' + result);
                    }
                });*/
            }

            /**
            * Changes the color of a given element.
            */
            function changeColor(element, color) {
                // The second class should always be the color class
                var classList = element.attr('class').split(/\s+/);
                element.removeClass(classList[1]);
                element.removeAttr('id');

                // Add on new color class
                element.addClass("c" + color);
                element.attr('id', color);
            }

            /**
            * Sets the visual color of the theme to the given color.
            */
            function showColor(color) {
                changeColor($(".sidebar"), color);
                changeColor($("input[type=radio] + label"), color);
            }

            /**
            * Shows the correct color box as checked.
            */
            function showCheckedColor(color) {
                var index = colorArray.indexOf(color);
                document.colors.themeColor[index].checked = true;
            }

            /**
            * Shows the correct score box as checked.
            */
            function showCheckedScore(highToLow) {
                var index = scoreArray.indexOf(highToLow);
                document.score.scoreRanking[index].checked = true;
            }

            /**
            * On click of a new color, change the color.
            */
            $("input[name=themeColor]").click(function() {
                color = $(this).attr('id');
                showColor(color);
                senseChanges();
            });

            /**
            * When a score ranking button is clicked,
            * change the score ranking.
            */
            $("input[name=scoreRanking]").click(function() {
                var valId = $(this).attr('id');
                if (valId === "low-to-high") {
                    highToLow = "false";
                } else {
                    highToLow = "true";
                }
                senseChanges();
            });

            /**
            * When the title input is edited, change the experience title.
            */
            $("input[name='experienceTitle']").change(function() {
                title = $(this).val();
                $(".side-title").html(title);
                senseChanges();
            });

            /**
            * When the description input is edited, change the experience description.
            */
            $("textarea[name='experienceDesc']").change(function() {
                description = $(this).val();
                senseChanges();
            });

            /**
            * When the id input is edited, change the experience id.
            */
            $("input[name='id']").change(function() {
                id = $(this).val();
                senseChanges();
            });

            /**
            * Resets "Save" button on change.
            */
            function senseChanges() {
                $(".save").html("Save");
                $(".save").removeClass("active");
            }

            /**
            * Tests if an id is valid (non-empty and only contains
            * words, numbers, or underscores).
            */
            function isValidId(str) {
                return /^[0-9a-z]+$/.test(str);
            }

            /**
            * Replaces "<" and ">" with the the
            * escaped version.
            */
            function sanitize(str) {

                return str;
            }

            /**
            * Save the experience using a post request.
            */
            function saveEdit() {
                var id = $("input[name=id]").val();

                if (id === null || id === "" || id === undefined) {
                    $.notify("You must specify an id for your experience.", "warning");
                    return;
                }

                if (!isValidId(id)) {
                    $.notify("Your id can only have lowercase letters and numbers.", "warning");
                    return;
                }

                var input = {"title": sanitize(title), "id" : id, "oldId": oldId, "color": color, "description": sanitize(description),
                             "highToLow": highToLow};
                $.post("/" + id + "/saveedit", input, function(responseJSON){
                    var responseObject = JSON.parse(responseJSON);
                    var worked = JSON.parse(responseObject.worked);
                    if (worked === true) {
                        var currentdate = new Date();
                        var datetime = currentdate.getHours() + ":" + currentdate.getMinutes();
                        $(".save-info").html("Last saved " + datetime);
                        $(".save").html("Saved!");
                        $(".save").addClass("active");
                        oldId = id;
                        if (isNew) {
                            console.log("Yep.");
                            window.location.replace("/"+id+"/editor");
                        }
                    } else {
                        var error = responseObject.error;
                        $.notify(error, "error");
                    }
                });
            }

            /**
            * Save on click of the save button.
            */
            $(".save").click(function() {
                saveEdit();
            });

            function deleteExperience() {
                $.ajax({
                    url: '/' + id,
                    type: 'DELETE',
                    success: function(result) {
                        if (JSON.parse(result).success === "true") {
                            console.log("Successfully deleted.");
                            window.location.replace("/maker");
                        } else {
                            $.notify("Experience couldn't be deleted.", "error");
                        }
                    },
                    error: function(result) {
                        $.notify("Experience couldn't be deleted.", "error");
                    }
                });
            }

            /**
            * Delete experience on click.
            */
            $("#deleteExperience").click(function() {
                deleteExperience();
            });

            function deleteScene() {
                console.log("Meoooowwwww");
                $.ajax({
                    url: '/' + id + '/' + currentSceneId + '/edit',
                    type: 'DELETE',
                    success: function(result) {
                        console.log("Successfully deleted.");
                        $.notify("Scene deleted! Get rid of this notification!", "success");
                    },
                    error: function(result) {
                        $.notify("Scene couldn't be deleted.", "error");
                    }
                });
            }

            /**
            * Delete scene on click.
            */
            $("#sceneDelete").click(deleteScene);

        });
    </script>
</body>
</html>