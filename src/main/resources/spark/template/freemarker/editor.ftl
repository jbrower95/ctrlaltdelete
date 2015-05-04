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
                <div class="settings">
                    <div class="settings-bar">
                        <div class="bar-block label">Scene ID</div>
                        <div class="bar-block answers">
                            <input type="text" name="sceneId" id="sceneIdInput" value=""/>
                        </div>
                    </div>
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
    <!-- Lib Script -->
    <script src="lib/js/notify.min.js"></script>
    <script src="lib/js/editorExp.js"></script>
    <script src="lib/js/editorScene.js"></script>
    <script>
        $(document).ready(function() {
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
        });
    </script>
</body>
</html>