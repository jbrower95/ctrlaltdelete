/* editorExp.js */

var isNew = $(".container").attr('id');

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
    $("#deleteExperience").css('display', 'none');
    $("#generalEdit .test").css('display', 'none');
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
    if (confirm("Are you sure you want to delete " + title + "?")) {
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
}

/**
* Delete experience on click.
*/
$("#deleteExperience").click(function() {
    deleteExperience();
});
