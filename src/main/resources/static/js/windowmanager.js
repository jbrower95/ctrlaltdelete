/**
* windowmanager.js
*
* A library for creating Windows95 style windows for your website, powered by jQuery.
*/

/*
* Constructs a new WindowManager
*
*   content_div_id - The div in which the window manager should place its
*         content. This is the ID of the div. 
*
*         If: 
*           - a div with this id does not exist, one will be created
*           - a div with this id DOES exist, use it.
*           - a NON DIV element with this id exists, an error will be written to the console.
*/
function WindowManager(content_div_id) {
  console.log("[windowmanager.js] Getting content div: " + content_div_id);
  var existing_div = document.getElementById(content_div_id);

  if (existing_div === null) {
    // Create a div
    this.content_div = document.createElement("div");
    document.body.appendChild(this.content_div);
  } else {
    // Is it a div?
    if (existing_div.tagName == "DIV") {
      this.content_div = existing_div;
    } else {
      // Don't load if not a div
      console.error("[windowmanager.js] Couldn't load content div - tag must be a div");
      return null;
    }
  }

  // Initialize hashtable
  this.windows = {};
  return this;
}

/**
* Adds a window to the workspace, as well as to the windows hashtable.
*
*   window_obj: The Window to be added.
*/
WindowManager.prototype.addWindow = function(window_obj) {
  $(this.content_div).prepend(window_obj.element);

  $(window_obj.element).removeClass("hidden");

  // Add to windows hashtable
  this.windows[window_obj.winId] = window_obj;
}

/**
* Removes a window from the screen. This is the default
* action when the X button of a window is clicked.
*
*   window_obj: The Window to be removed.
*/
WindowManager.prototype.removeWindow = function(window_obj) {
  console.log("[windowmanager.js] Removing window: " + window_obj.winId);
  delete this.windows[window_obj.winId];
  $(window_obj.element).addClass("hidden");
}

/*
*   Returns the window object associated with the given window
*   Id. This is implemented with an object hashtable.
*
*   window_id - The id of Window.
*/
WindowManager.prototype.getWindowWithId = function(window_id) {
  // Check if windowId exists in the hashtable
  console.log(this.windows);
  if (!(window_id in this.windows)) {
    return null;
  } else {
    return this.windows[window_id];
  }
}

/*
*   Searches the div for a template of ID ‘template’ whose
*   class is set to ‘windowTemplate’. This is then copied and instantiated
*   and returned as a Window object.
*
*   template - The id of the template div.
*/
WindowManager.prototype.inflate = function(template) {
  console.log("Trying to inflate template: " + template);

  var template_div = document.getElementById(template);

  if (template_div == null) {
    console.error("[windowmanager.js] Couldn't find a template div.");
    return null;
  }

  // Sets class to 'windowTemplate', if not already there
  if (!$(template_div).hasClass("windowTemplate")) {
    $(template_div).addClass("windowTemplate");
  }

  // Check if window should be draggable (default to draggable)
  var draggable = true;
  if (!$(template_div).hasClass("draggable")) {
    console.log("Forcing draggable to false for div: " + template);
    draggable = false;
  }

  var copy = template_div.cloneNode(true);

  // Default position of (0,0)
  var win = new Window(copy, 0, 0, draggable);
  win.setId(template);

  return win;
}