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

    <style>
        html {
            position: relative;
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
        top: 0;
        overflow: hidden;
        }
        body {
            background-color: #222128;
        height: 100%;
        position: relative;
        padding: 0;
        margin: 0;
        top: 0;
        }

        hr {
            border: 0;
            height: 1px;
            background-color: rgba(255,255,255,0.4);
            margin-bottom: 2%;
            margin-top: 2%;
        }

        .clearfix:after {
            visibility: hidden;
            display: block;
            font-size: 0;
            content: " ";
            clear: both;
            height: 0;
        }

        .container {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
        }

        .sidebar {
            position: relative;
            width: 25%;
            height: 100%;
            margin: 0;
            float: left;
            padding-top: 2.5%;
            padding-bottom: 2.5%;
            overflow: hidden;
            box-sizing: border-box;
            transition: background-color 0.2s;
        }

        .side-title {
            font-family: 'Lato', sans-serif;
            font-size: 1.5em;
            display: block;
            margin-bottom: 2%;
            color: white;
            font-weight: 800;
            opacity: 1;
            padding-right: 2%;
            padding-left: 18%;
            width: 100%;
            background-color: rgba(0,0,0,0);
            box-sizing: border-box;
            transition: background-color 0.2s;
        }

        .side-title:hover {
            cursor: pointer;
            background-color: rgba(0,0,0,0.1);
        }

        .scene-list {
            position: relative;
            width: 100%;
            height: 78%;
            overflow: auto;
            box-sizing: border-box;
        }

        .left-bar {
            position: relative;
            float: left;
            width: 15%;
            height: 100%;
            box-sizing: border-box;
        }

        .list {
            list-style: none;
            position: relative;
            width: 100%;
            height: auto;
            overflow-x: hidden;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        .list li {
            font-family: 'Lato', sans-serif;
            color: white;
            font-size: 1.2em;
            opacity: 1;
            transition: background-color 0.2s;
            padding-right: 2%;
            padding-left: 18%;
            padding-top: 5px;
            padding-bottom: 5px;
            box-sizing: border-box;
            background-color: rgba(0,0,0,0);
        }

        .list li#Main {
            font-weight: 800;
        }

        .list li:hover {
            cursor: pointer;
            background-color: rgba(0,0,0,0.1);
        }

        .curr, .list li.curr {
            background-color: rgba(0,0,0,0.3);
        }

        .main {
            position: relative;
            width: 74%;
            height: 100%;
            float: right;
            padding: 2.5%;
            box-sizing: border-box;
            overflow: auto;
        }

        input[type=text] {
            background-color: transparent;
            border: 0;
            border-bottom: 1px solid white;
            color: white;
            width: 100%;
            padding-bottom: 10px;
            transition: border 0.2s;
            font-family: 'Lato', sans-serif;
        }

        input[type=text]:focus {
            outline: none;
            border-bottom: 3px solid white;
        }

        textarea {
            background-color: transparent;
            border: 0;
            color: white;
            font-family: 'Merriweather', serif;
            position: relative;
            width: 85%;
            height: 100px;
            resize: none;
            padding: 5px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        textarea:focus {
        outline: none;
        opacity: 1;
        }


        .title {
            font-family: 'Lato', sans-serif;
            font-size: 2.3em;
            display: block;
            margin-bottom: 2%;
        }

        .description {
            font-family: 'Merriweather', serif;
        }

        .settings {
            position: relative;
            width: 85%;
            height: auto;
            font-family: 'Merriweather', serif;
            color: white;
            margin-top: 5%;
        }

        .scene-settings {
            position: relative;
            width: 30%;
            height: auto;
            font-family: 'Merriweather', serif;
            color: white;
            margin-top: 2%;
        }

        .settings-title {
            color: white;
            font-family: 'Lato', sans-serif;
            font-size: 1.8em;
            font-weight: 700;
        }

        .settings-bar {
            position: relative;
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 4%;
        }

        .bar-block {
            position: relative;
            width: 50%;
            height: auto;
        }

        .label {
            font-size: 1.3em;
        }

        .answers, form {
            position: relative;
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .answers.scene {
            width: 50%;
        }

        input[type=radio] {
            position: absolute;
            left: -2040px;
        }

        input[type=radio] + label {
            display: block;
            position: relative;
            height: auto;
            opacity: .6;
            transition: opacity 0.2s;
            font-size: 1em;
            text-align: center;
            transition: background-color 0.2s;
        }

        input[type=radio] + label:hover {
            cursor: pointer;
            opacity: .9;
        }

        input[type=radio]:checked + label {
            opacity: 1;
        }

        .save-bar {
            position: relative;
            width: 85%;
            height: auto;
            margin-top: 8%;
            text-align: right;
        }

        .button {
            padding: 2%;
            padding-left: 4%;
            padding-right: 4%;
            width: 38.5%;
        }

        .save {
            position: relative;
            width: 31%;
            padding-top: 1%;
            padding-bottom: 1%;
            border: 3px solid white;
            color: white;
            background-color: rgba(255,255,255,0);
            font-family: 'Lato', sans-serif;
            font-size: 1.3em;
            transition: background-color 0.2s, color 0.2s;
        }

        .save:hover {
            cursor: pointer;
        }

        .save:hover, .active {
            background-color: rgba(255,255,255,1);
            color: darkslategray;
        }

        .save-info {
            position: absolute;
            width: 100%;
            height: auto;
            color: white;
            font-size: .6em;
            top: -20px;
            left: 0;
            text-align: left;
        }

        .color-block {
            position: relative;
            height: 25px;
            width: 100%;
        }

        label.color {
            width: 20%;
        }

        .c00bad6 {
        background-color: #00bad6;
        }

        .cef563d {
        background-color: #ef563d;
        }

        .cF5C70C {
        background-color: #F5C70C;
        }

        .cffaf00 {
        background-color: #ffaf00;
        }

        .asset-zone {
            position: absolute;
            width: 100%;
            height: 25%;
            left: 0;
            bottom: 0;
            box-sizing: border-box;
            padding: 1%;
        }
        
        #asset-upload-field {
            background-color: transparent;
            border: 3px dashed rgba(255,255,255,0.5);
            border-radius: 5px;
            position: relative;
            height: 100%;
            width: 100%;
            float: none;
            color: white;
            font-family: 'Lato', sans-serif;
            font-size: 1.2em;
            text-align: center;
            box-sizing: border-box;
            padding: 15%;
            transition: border-color 0.2s;
        }

        #asset-upload-field:hover {
            border-color: rgba(255,255,255,1);
        }

        .editor-bar {
            position: relative;
            width: 100%;
            height: auto;
            margin-top: 50px;
        }

        .editor-head {
            position: relative;
            width: 100%;
            height: 45px;
            font-family: 'Lato', sans-serif;
            color: white;
            font-size: 1.2em;
            padding: 10px;
            box-sizing: border-box;
            background-color: rgba(0,0,0,0.5);
        }

        .left {
            float: left;
            width: auto;
            padding-left: 20px;
        }

        .right {
            float: right;
            width: auto;
            padding-right: 20px;
        }

        .editor {
            position: relative;
            width: 100%;
            height: 500px;
            background-color: rgba(255,255,255,0.5);
            box-sizing: border-box;
            transition: height 0.2s;
        }

        .inactive {
            pointer-events: none;
            opacity: 0.5;
        }

        .back {
            position: relative;
            width: 60%;
            height: auto;
        }
    </style>
    <link rel="stylesheet" href="https://rawgit.com/enyo/dropzone/master/dist/dropzone.css">
</head>
<body>
    <div class="container clearfix" id="${isNew}">
        <div class="sidebar c${color}" id="${color}">
            <div class="scene-list">
                <!--<div class="left-bar">
                    <img class="back" src="lib/images/left.svg">
                </div>-->
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
                            <input type="text" name="sceneId" value=""/>
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
                            +
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
                            +
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
                        <div class="right" onclick="javascript:toggleCss()">
                            +
                        </div>
                    </div>

                    <textarea name="css" class="editor" id="css">
                    </textarea>
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
    	
    	//hide/show JS, CSS, and HTML.
    	function toggleJs() {
    		var editors = $(".editor-bar");
    		console.log(editors);
    		
    		var indicator = $(editors[0]).find("right");
    		
    		$(editors[0]).find(".CodeMirror").toggle({duration: 200});
    	}
    	
    	function toggleHtml() {
    		var editors = $(".editor-bar");
    		console.log(editors);
    		$(editors[1]).find(".CodeMirror").toggle({duration: 200});
    	}
    	
    	function toggleCss() {
    		var editors = $(".editor-bar");
    		console.log(editors);
    		$(editors[2]).find(".CodeMirror").toggle({duration: 200});
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
			
			 /* Handlers for saving the files */
           cmCss.on("change", function(cm, change) {
           
           		$.post("/" + id + "/" + currentSceneId + "/edit", {"change" : change, "file" : "css"}, function(response) {
           			console.log(response);
           		});
           		console.log(change);
			  });
			  
			cmJs.on("change", function(cm, change) {
				
				$.post("/" + id + "/" + currentSceneId + "/edit", {"change" : change, "file" : "js"}, function(response) {
           			console.log(response);
           		});
           		console.log(change);
			  });
			  
			cmHtml.on("change", function(cm, change) {
			
				$.post("/" + id + "/" + currentSceneId + "/edit", {"change" : change, "file" : "html"}, function(response) {
           			console.log(response);
           		});
           		console.log(change);
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
        });
    </script>
</body>
</html>