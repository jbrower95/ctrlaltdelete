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

// Hide/show JS, CSS, and HTML.
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

/**
* Refactors on id change for scenes.
*/
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
        changeHeaders(currentSceneId);
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

/**
* Changes the editor headers to the right id.
*/
function changeHeaders(newSceneId) {
  $("#scenejs").html(newSceneId + ".js");
  $("#scenehtml").html(newSceneId + ".html");
  $("#scenecss").html(newSceneId + ".css");
}

$("#sceneIdInput").blur(sceneIdChange);

 /* Handlers for saving the files */

 /**
* Saves CSS on blur.
*/
 cmCss.on("blur", function(cm) {
      var code = cmCss.getValue();
      var baseUrl = "/" + id + "/" + currentSceneId + "/edit?type=";
      $.post(baseUrl + "css", code, function(response) {
        $.notify("Saved!", "success");
            console.log("Update succeeded! (css)");
      }).fail(function(){
            $.notify("Couldn't save CSS.", "error");
        });
});

/**
* Saves JS on blur.
*/
cmJs.on("blur", function(cm) {
  var code = cmJs.getValue();
  $.post("/" + id + "/" + currentSceneId + "/edit?type=js", code , function(response) {
            $.notify("Saved!", "success");
        console.log("Update succeeded! (js).");
      }).fail(function(){
            $.notify("Couldn't save Javascript.", "error");
        });
});

/**
* Saves HTML on blur.
*/
cmHtml.on("blur", function(cm) {
  var code = cmHtml.getValue();
  $.post("/" + id + "/" + currentSceneId + "/edit?type=html", code, function(response) {
            $.notify("Saved!", "success");
        console.log("Updated succeeded! (html)");
      }).fail(function() {
            $.notify("Couldn't save HTML.", "error");
        });
});

/**
* Fillds new scene info.
*/
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

/**
* Fills the info of the main scene.
*/
function fillMainInfo() {
  $.get("/" + id + "/main/edit", function(responseJSON) {
      var responseObject = JSON.parse(responseJSON);
      console.log(responseObject);
      var sceneJs = responseObject.js;
      var sceneHtml = responseObject.html;
      var sceneCss = responseObject.css;

      $("input[name=sceneId]").val("");
      $("input[name=sceneTitle]").addClass("inactive");
      $(".settings").addClass("inactive");

      changeHeaders("index");

      cmJs.setValue(sceneJs);
      cmHtml.setValue(sceneHtml);
      cmCss.setValue(sceneCss);
      currentSceneId = null;
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

      currentSceneId = sceneId;
      fillFields(sceneId, sceneJs, sceneHtml, sceneCss);
  });
}

/**
* Fillds the fields of a scene.
*/
function fillFields(sceneId, sceneJs, sceneHtml, sceneCss) {
  $("input[name=sceneId]").val(sceneId);

  changeHeaders(sceneId);

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

/**
* Resets the state of the editor (for
* use after deleting a scene).
*/
function resetEditor() {
  currentSceneId = null;
  $(".inactive").removeClass("inactive");
  $("#sceneEdit").fadeOut();
  $("#generalEdit").fadeIn();
  onScene = false;
  listScenes();
  $(".curr").removeClass("curr");
  $(".side-title").addClass("curr");
}

/**
* Deletes the current scene, after double-checking with a modal.
*/
function deleteScene() {
  if (confirm("Are you sure you want to delete " + currentSceneId + "?")) {
      $.ajax({
          url: '/' + id + '/' + currentSceneId + '/edit',
          type: 'DELETE',
          success: function(result) {
              $.notify("Scene deleted.", "success");
              resetEditor();
          },
          error: function(result) {
              $.notify("Scene couldn't be deleted.", "error");
          }
      });
  }
}

/**
* Delete scene on click.
*/
$("#sceneDelete").click(deleteScene);