/**
*	windowmanager.js
*
*	A library for creating windows95 style windows for your website, powered by jQuery.
*/

/*
*	Constructs a new WindowManager
*
*		contentDivID - The div in which the window manager should place its
*					content. This is the ID of the div. 
*
*					If: 
*						- a div with this id does not exist, one will be created
*						- a div with this id DOES exist, use it.
*						- a NON DIV element with this id exists, an error will be written to the console.
*/
function WindowManager(contentDivID) {
	var existingDiv = document.getElementById(contentDivID);

	if (existingDiv == null) {
		// Create a div
		this.contentDiv = document.createElement("div");
		document.body.appendChild(contentDiv);
	} else {
		// Is it a div?
		if (existingDiv.tagName == "DIV") {
			this.contentDiv = existingDiv;
		} else {
			// Don't load if not a div
			console.log("[windowmanager.js] Error: Couldn't load content div - tag must be a div");
			return false;
		}
	}

	// Initialize hashtable
	this.windows = {};
	return true;
}


WindowManager.addWindow(windowObject) {

}

WindowManager.removeWindow(windowObject) {

}

/*
*		Returns the window object associated with the given window
*		Id. This is implemented with an object hashtable.
*
*		windowId - The id of Window.
*/
WindowManager.getWindowWithId(windowId) {
	// Check if windowId exists in the hashtable
	if (!(windowId in this.windows)) {
		console.log("[windowmanager.js] Error: Window ID doesn't exist in the manager.");
	} else {
		return this.windows[windowId];
	}
}

/*
*		Searches the div for a template of ID ‘templateName’ whose
*		class is set to ‘windowTemplate’. This is then copied and instantiated
*		and returned as a Window object.
*
*		template - The id of the template div.
*/
WindowManager.inflate(template) {
	var templateDiv = $("#" + template);

	if (templateDiv == null) {
		console.log("[windowmanager.js] Error: Couldn't find a template div.");
		return null;
	}

	var newWindow = template.cloneNode(true);
	// TODO: Make window.js
}