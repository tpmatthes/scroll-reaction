/*!
 * ScrollReaction 1.1.0 by Tim-Patrick Matthes
 * Performant, dependency free and fully customizable scroll effects
 *
 * Learn more: https://github.com/tpmatthes/scroll-reaction
 *
 * MIT License
 */

// Global object, can be used as a constructor function (e.g. new ScrollReaction())
// Wrapped in an IIFE to make use of private variables
window.ScrollReaction = (function() {
	// Default config, may be overriden by passing a config object to the constructor function
	// Example: new ScrollReaction({callback: customCallback, offset: -80})
	var config = {
		/* This attribute is used to find listener elements
		 * Add it to any element, e.g. <a data-scroll-reaction="section-1" ...>
		 * The value should match the id of the emitter element, e.g. <section id="section-1" ...>
		 */
		attribute: 'data-scroll-reaction',

		/* These classes will be added to listener elements
		 * The first class will be added when the user reaches an emitter element
		 * The second class will be added when the user has scrolled past an emitter element
		 * If you pass an empty string for one of these class names, no class will be added
		 */
		classes: {
			isActive: 'is-active',
			wasActive: 'was-active',
		},

		/* This function will be called when the user is scrolling or resizing the window
		 * The vertical scroll position and the status (0-100%) will be passed as arguments
		 */
		callback: null,

		/* This offset will be subtracted from the vertical position of any emitter element
		 * If your listener element should receive its class earlier (scrolling down), pass a higher value
		 */
		offset: 5,

		/* If you enable this option, the base offset will be calculated from the height of an element
		 * This option accepts any query selector, e.g. '#navigation' or 'nav'
		 * The first element, which matches the given selector, will be used
		 * If you use both offset options, the base offset will be added to this
		 */
		offsetFrom: null,

		/* The update method will get called at a limited rate on scroll (by default 20 times per second)
		 * However, the max rate can be changed, because it limits the FPS in a custom callback
		 */
		throttleDelay: 50,

		/* The last emitter element may be "unreachable" on bigger screens
		 * An emitter is only triggered when the user scrolls past it (- configured offset)
		 * However, if the user scrolls to the bottom, the last emitter will be activated automatically
		 * If the listener element should receive its class earlier (scrolling down), pass a higher value
		 * Any negative value (<0) will make the last emitter unreachable (do you really want that?)
		 */
		windowBottomOffset: 20,

		/* Should smooth scrolling be enabled for all listener elements?
		 * You should add a polyfill (not included) for scroll behavior, if you enable this option
		 * If this is enabled and the browser doesn't support it, you will only get a warning in the console
		 * You probably don't want to enable this option, if you use custom event listeners for your links
		 */
		smoothScroll: false,
	};

	// Arrays with all elements affected by this script
	// This script will assign a class to all listener elements if the user scrolls past a linked emitter element
	var listeners = [], emitters = [];
	// Official offset (generated from config)
	var offset = 0;
	// The offset will match this elements height, if offsetFrom is enabled
	var offsetFromElement = null;

	// The constructor function returns this object and all of its methods
	var ScrollReaction = {
		/**
		 * Public property: position
		 * How far has the user scrolled? [in pixels]
		 */
		position: 0,
		/**
		 * Public property: status
		 * How far has the user scrolled? [0-100%]
		 */
		status: 0,

		/**
		 * Initializes all event listeners and updates emitters and listeners for the first time
		 * This method should be called when the DOM is ready (e.g. onload)
		 */
		init: function() {
			// Create fresh arrays for emitters and listeners
			this.refresh();

			// Update emitters and listeners if the user resizes the window or changes the device orientation
			// Usually the update method won't get called in the process (while the user is actively resizing)
			// This prevents unnecessary function calls and improves the overall performance
			window.addEventListener('resize', defer(this.update, this, 200, true));
			window.addEventListener('orientationchange', defer(this.update, this, 200, true));

			// Update emitters and listeners if the user scrolls
			// The update method will get called at a limited rate (by default 20 times per second)
			// This prevents unnecessary function calls and improves the overall performance
			// However, the max rate can be configured, because it limits the FPS in a custom callback
			window.addEventListener('scroll', defer(this.update, this, config.throttleDelay, false));
		},

		/**
		 * Finds all listener and emitter elements and adds them (with metadata) to the corresponding arrays
		 */
		refresh: function() {
			// Find all listener elements (by attribute)
			var foundListeners = document.querySelectorAll('[' + config.attribute + ']');
			// Lookup array to check if an emitter is already registered
			var emittersLookup = [];
			// Required for using the correct scope in the smooth scroll event listeners
			var self = this, scrollTo = this.scrollTo;

			// Abort if no listener elements have been found
			if (foundListeners.length == 0) {
				return false;
			}

			// Empty both arrays, because this method may be called again
			listeners = [];
			emitters = [];

			// Loop trough all listener elements (no for...of loop for <ES6 compatibility)
			for (var i = 0; i < foundListeners.length; i++) {
				// Find the corresponding emitter element (by ID)
				var emitterId = foundListeners[i].getAttribute(config.attribute);
				var emitter = emitterId ? document.getElementById(emitterId) : null;
				// Variables for new listener and emitter objects
				var newListener, newEmitter;
				// Href attribute of the listener element
				var listenerHref = foundListeners[i].getAttribute('href');

				// If smooth scrolling is enabled and the listener has a page anchor: Add an event listener
				if (config.smoothScroll && listenerHref && (listenerHref.indexOf('#') == 0)) {
					// An existing emitter isn't required, because a "scroll to top" link should be possible
					// In that case, an empty scroll reaction attribute is used (e.g. <a href="#" data-scroll-reaction="">)
					foundListeners[i].addEventListener('click', function(event) {
						// Prevent default behaviour (jumping to #link)
						event.preventDefault();
						// Scroll to the desired location
						// Needs to be called with the correct scope, because scrollTo is a method from ScrollReaction
						scrollTo.call(self, this.getAttribute(config.attribute));
					});
				}

				// Does the emitter element exist?
				// Listeners without linked emitters aren't allowed (they would be useless)
				if (emitter) {
					// Create a new emitter object
					newEmitter = {
						element: emitter,
						isActive: false,
						wasActive: false
					};

					// Add the emitter object to the corresponding array, only if it doesn't exist yet
					// It is possible to have multiple listeners linked to the same emitter
					if (emittersLookup.indexOf(emitterId) == -1) {
						emitters.push(newEmitter);
						// Add it to the lookup array, too
						emittersLookup.push(emitterId);
					}

					// Create a new listener object (refers to the current emitter)
					newListener = {
						element: foundListeners[i],
						emitterIndex: emittersLookup.indexOf(emitterId)
					};

					// Add the listener object to the corresponding array
					listeners.push(newListener);
				}
			}

			// Should the offset be calculated from an elements height?
			if (config.offsetFrom) {
				// Find the element based on the configured selector
				offsetFromElement = document.querySelector(config.offsetFrom);
			// Else: the offset is simply an option
			} else {
				offset = config.offset;
			}

			// Update all elements, just in case the user has already scrolled (e.g. #link)
			this.update();
		},

		/**
		 * Updates everything to reflect the current scroll position
		 */
		update: function() {
			// Only one emitter should be active at any given time
			var activatedOnce = false;
			// Calculate the highest possible scroll position (bottom of the page)
			var windowBottomPosition = document.body.clientHeight - window.innerHeight;
			// Include the offset for the bottom of the page
			var bottomPosition = windowBottomPosition - config.windowBottomOffset;
			// Get the current scroll position (how far has the user scrolled?)
			this.position = window.scrollY;

			// Update the offset, if necessary
			if (offsetFromElement) {
				// It will be calculated from an elements height (including borders and padding)
				offset = offsetFromElement.offsetHeight + config.offset;
			}

			// Loop trough all emitters (from last to first)
			for (var i = emitters.length - 1; i >= 0; i--) {
				// Get the Y coordinate of the emitter element (+ configured offset)
				var emitterPosition = emitters[i].element.getBoundingClientRect().top + this.position - offset;

				// Has the user reached the position of the emitter element?
				// Or has the user scrolled all the way to the bottom of the page?
				// And is it the first emitter to be activated?
				if ((this.position > emitterPosition) || (this.position >= bottomPosition)) {
					// Is this the first active emitter?
					if (!activatedOnce) {
						// Mark this emitter as currently active
						emitters[i].isActive = true;
						emitters[i].wasActive = false;
						// Every other emitter in the loop should not be currently active
						activatedOnce = true;
					// Else: one of the previous emitters is active
					} else {
						// Mark this emitter as active, but not currently active
						emitters[i].isActive = false;
						emitters[i].wasActive = true;
					}
				// Else: mark this element as not active
				} else {
					emitters[i].isActive = false;
					emitters[i].wasActive = false;
				}
			}

			// Loop trough all listeners (no for...of loop for <ES6 compatibility)
			for (var p in listeners) {
				var emitter = emitters[listeners[p].emitterIndex];
				var listener = listeners[p];
				var isClass = config.classes.isActive;
				var wasClass = config.classes.wasActive;

				// Is the linked emitter active?
				if (emitter.isActive) {
					// Remove the configured wasActive class from the listener element, if necessary
					// If both classes are actually the same, it will not be removed
					if (wasClass && wasClass != isClass) listener.element.classList.remove(wasClass);
					// Add the configured isActive class to the listener element, if necessary
					if (isClass) listener.element.classList.add(isClass);
				// Has the emitter been active?
				} else if (emitter.wasActive) {
					// Remove the configured isActive class from the listener element, if necessary
					// If both classes are actually the same, it will not be removed
					if (isClass && isClass != wasClass) listener.element.classList.remove(isClass);
					// Add the configured wasActive class to the listener element, if necessary
					if (wasClass) listener.element.classList.add(wasClass);
				// Else: the linked emitter is not active
				} else {
					// Remove both classes from the listener element, if necessary
					if (isClass) listener.element.classList.remove(isClass);
					if (wasClass) listener.element.classList.remove(wasClass);
				}
			}

			// Update the status: How far has the user scrolled?
			// Math.min fixes rounding errors: The status can't be >100%
			this.status = Math.min(this.position / windowBottomPosition * 100, 100);

			// Call the callback function, if possible
			if (typeof config.callback === 'function') {
				// Pass the scroll position and the status as an argument
				config.callback(this.position, this.status);
			}
		},

		/**
		 * Scrolls to an element with a given ID or scrolls to top, if no ID is specified
		 * @param {string} id: ID of the element the browser should scroll to [optional]
		 */
		scrollTo: function(id) {
			// Scroll to top by default
			var endPosition = 0;
			// Find the corresponding element
			var element = (id) ? document.getElementById(id) : null;

			// Does the element exist?
			if (element) {
				// Get the position of the element, relative to the current position
				// Subtract the configured offset and add one extra pixel to trigger linked listeners
				endPosition = element.getBoundingClientRect().top + this.position - offset + 1;
				// Focus the element for screen readers (accessibility)
				element.focus();
			}

			// Does the browser support the history API?
			if (window.history.replaceState) {
				// Change the hash in the history
				window.history.replaceState(null, null, '#' + id);
			}

			// Is smooth scrolling enabled?
			if (config.smoothScroll) {
				// Does the browser support smooth scroll behaviour?
				// Is isn't possible to check for browser support by using a simple if statement
				// The new API extends the old scrollTo function
				try {
					// Scroll to the position - smoothly!
					window.scrollTo({top: endPosition, left: 0, behavior: 'smooth'});
				}
				catch(error) {
					console.warn('Smooth scroll behavior is not supported by your browser. Please use a polyfill or disable smooth scrolling for scroll-reaction.js');
					// Jump to the position
					window.scrollTo(0, endPosition);
				}
			// Else: Smooth Scrolling is disabled
			} else {
				// Scroll to the position - not smoothly, but it works
				window.scrollTo(0, endPosition);
			}
		}
	};

	/**
	 * Helper function: a single function for debouncing or throttling
	 * Debounce mode: Executes a given callback function if there was no new call in $interval milliseconds
	 * Throttle mode (default): Executes a given callback function once every $interval milliseconds
	 * @param {function} callback: function to be debounced/throttled
	 * @param {object} context: context for this binding
	 * @param {number} interval: interval between function calls in milliseconds
	 * @param {boolean} debounce: activates the debounce mode [default: false]
	 * @returns {function}
	 */
	function defer(callback, context, interval, debounce) {
		var lastTime, deferTimer;
		// Return a function, because this function is used as a callback
		return function() {
			// Save current time
			var now = Date.now();
			// Defer the callback function if debounce mode is activated
			// Or throttle the function if necessary
			if (debounce || (lastTime && now < lastTime + interval)) {
				// Clear current timeout
				clearTimeout(deferTimer);
				// Execute the callback function in $interval milliseconds
				deferTimer = setTimeout(function() {
					// Save the current time for the next call
					lastTime = now;
					// Execute the callback function
					callback.call(context);
				}, interval);
			// Else: simply execute the callback function (only for throttling)
			} else {
				// Save the current time for the next call
				lastTime = now;
				// Execute the callback function
				callback.call(context);
			}
		};
	}

	/**
	 * Constructor
	 * @param {object} userConfig: custom configuration
	 * @returns {object}
	 */
	return function(userConfig) {
		// Overwrite default config properties where necessary
		for (p in userConfig) {
			// Is the current property named classes?
			if (p == 'classes') {
				// The classes option is an object, so its properties need to be copied as well
				for (np in userConfig.classes) {
					config.classes[np] = userConfig.classes[np];
				}
			// Else: any other property
			} else {
				// Copy the property to the config object
				config[p] = userConfig[p];
			}
		}

		// Return an object with all public methods
		return ScrollReaction;
	};

	// Thanks for reading the source code! Have a nice day
}());
