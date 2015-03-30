/**
*	window.js
*
*	A Windows95-style window to be used with the WindowManager. Allows for
*	a functioning dragbar, an x-button, and a minimize button for each window.
*	Can ONLY be inflated by the WindowManager.
*/

/**
*   Constructs a new Window.
*
*		element: A reference to the DOM element, specifically a div, that represents the Window object.
*		x: The x-position of the Window, in pixels. Note that this is relative to the containing
*		   div, and that the 0-position is the leftmost edge of that div.
*		y: The y-position of the Window, in pixels. Note that this is relative to the containing
*		   div, and that the 0-position is the topmost edge of that div.
*/
function Window(element, x, y) {
	this.element = element;
	this.x = x;
	this.y = y;
	this.element.style.left = this.x;
	this.element.style.top = this.y;

	// Window can be closed by default
	this.cancellable = true;

	// Make sure to initialize with the window class
	if (!this.element.hasClass("window")) {
		this.element.classList.add("window");
	}
}

/**
*	Animates a windows movement across the screen.
*		pos_x: The x-position to move the Window to, in pixels. (Cannot be a string.)
*		pos_y: The y-position to move the Window to, in pixels. (Cannot be a string.)
*/
Window.moveTo(pos_x, pos_y) {
	this.element.css({left: pos_x, top: pos_y});
}

/**
*	Sets the title of the Window. To set the title,
*	the Window must have a child element with
*	the class "title", else an error is logged to
*	the console.
*
*		new_title: The title to put in the title bar of the Window.
*/
Window.setTitle(new_title) {
	var title = this.element.find(".title");

	// Checks if the title element was found
	if(title.length > 0) {
		title.html(new_title);
	} else {
		console.log("[window.js] Error: No title element found in given Window.");
	}
}

/**
*
*/
Window.setXHandler(x_handler) {
	this.element.find($(".close")).click(function() {
		if (this.cancellable) {

		}
	});
}

/**
*	Sets whether or not a window can be closed. This is a less
*	intrusive way of preventing closing (instead of overriding setXHandler).
*
*		is_cancellable: Boolean representing if the window is able to be closed
*					   or not.
*/
Window.setCancellable(is_cancellable) {
	this.cancellable = is_cancellable;
}
