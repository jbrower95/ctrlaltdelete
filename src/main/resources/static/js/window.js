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
function Window(element, x, y, draggable) {
	this.winId = 0;
	this.element = element;
	this.close = null;
	this.min = null;
	this.x = x;
	this.y = y;
	this.element.style.left = this.x;
	this.element.style.top = this.y;

	// Window can be closed by default
	this.cancellable = true;

	// Windows x-handler, to be called on close
	this.xOut = function(w) {
		console.log("x-ing out");
		$(this.element).remove();
	};

	// Make sure to initialize with the window class
	if (!$(this.element).hasClass("window")) {
		this.element.classList.add("window");
	}

	if (draggable) {
		var dragDiv = '<div class="dragbar clearfix">'
						+ '<img class="dragbar-icon" src="images/default_window_icon.png">'
						+ '<span class="title"></span>'
				        + '<div class="close right button"><img src="images/close.png"></div>'
				        + '<div class="right button"><img src="images/maximize.png"></div>'
				        + '<div class="right button"><img src="images/minimize.png"></div></div>';
		$(this.element).prepend(dragDiv);

		// Dragging
		this.mouse_offset_x = 0;
		this.mouse_offset_y = 0;
		this.dragbar = $(this.element).find(".dragbar");
		this.dragbar.find(".close").mousedown($.proxy(this.xHandler, this));
		this.dragbar.mousedown($.proxy(this.mouseDown, this));
		$(window).mouseup($.proxy(this.mouseUp, this));
	}
}

/**
* Mouse up for unbinding mouse move!
*/
Window.prototype.mouseUp = function() {
	$(window).unbind('mousemove', $.proxy(this.moveWindow, this));
}

/**
* Mouse down for window move!
*/
Window.prototype.mouseDown = function(e) {
	this.mouse_offset_x = e.pageX - this.x;
	this.mouse_offset_y = e.pageY - this.y;
	// remove class ".top-window" from all other windows
	$(".top-window").map(function() {
   		$(this).removeClass("top-window");
	});
	// add class ".top-window" to this window
	$(this.element).addClass("top-window");
	$(window).bind("mousemove", $.proxy(this.moveWindow, this));
}

/**
 * Make this window the active window and bring it into focus.
 */
Window.prototype.setActive = function(isActive) {
	if (isActive) {
		// remove class ".top-window" from all other windows
		$(".top-window").map(function() {
	   		$(this).removeClass("top-window");
		});
		// add class ".top-window" to this window
		$(this.element).addClass("top-window");
	} else {
		$(this).removeClass("top-window");
	}
}

/**
 * Make the window enabled and allow interaction with it.
 */
Window.prototype.setEnabled = function(enable) {
	if (enable) {
		$(this.element).removeClass("is-disabled")
	} else {
		$(this.element).addClass("is-disabled");
	}
}

/**
* Move window!
*/
Window.prototype.moveWindow = function(e) {
	this.x = (e.pageX - this.mouse_offset_x);
	this.y = (e.pageY - this.mouse_offset_y);
	$(this.element).css('top', this.y + 'px');
	$(this.element).css('left', this.x + 'px');
}

/**
* Set id of the window object.
*/
Window.prototype.setId = function(newId) {
	this.winId = newId;
}

/**
* Runs the close handler.
*/
Window.prototype.xHandler = function() {
	if (this.cancellable === true) {
		this.xOut(this);
	}
}

/**
*	Animates a windows movement across the screen.
*		pos_x: The x-position to move the Window to, in pixels. (Cannot be a string.)
*		pos_y: The y-position to move the Window to, in pixels. (Cannot be a string.)
*/
Window.prototype.moveTo = function(pos_x, pos_y) {
	$(this.element).css({left: pos_x + 'px', top: pos_y + 'px'});
	this.x = pos_x;
	this.y = pos_y;
}

/**
*	Sets the title of the Window. To set the title,
*	the Window must have a child element with
*	the class "title", else an error is logged to
*	the console.
*
*		new_title: The title to put in the title bar of the Window.
*/
Window.prototype.setTitle = function(new_title) {
	var title = $(this.element).find(".title");

	// Checks if the title element was found
	if(title.length > 0) {
		title.html(new_title);
	} else {
		console.error("[window.js] No title element found in given Window.");
	}
}

/**
*	Sets the icon of the Window. To set the icon,
*	the Window must have a child image element with
*	the class "dragbar-icon", else an error is logged to
*	the console.
*
*		new_icon: The icon's source to put in the drag bar of the Window.
*/
Window.prototype.setIcon = function(new_icon) {
	var icon = $(this.element).find(".dragbar-icon");

	// Checks if the icon element was found
	if (icon.length > 0) {
		icon.attr('src', new_icon);
	} else {
		console.error("[window.js] No icon element found in given Window.");
	}
}

/**
*
*/
Window.prototype.setXHandler = function(x_handler) {
	this.xOut = x_handler;
	//this.dragbar.find(".close").mousedown($.proxy(this.xHandler, this));
}

/**
*	Sets the default handler for when the minimize button,
*	which must have the "min" class, is clicked.
*/
Window.prototype.setMinHandler = function(min_handler) {
	this.element.find($(".min")).click(function() {
		min_handler(); // Should this be required to take a reference to element?
	});
}

/**
*	Sets whether or not a window can be closed. This is a less
*	intrusive way of preventing closing (instead of overriding setXHandler).
*
*		is_cancellable: Boolean representing if the window is able to be closed
*					   or not.
*/
Window.prototype.setCancellable = function(is_cancellable) {
	this.cancellable = is_cancellable;
}
