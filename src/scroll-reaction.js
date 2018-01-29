/*!
 * ScrollReaction 1.2.0 by Tim-Patrick Matthes
 * Performant, dependency free and fully customizable scroll effects
 * Learn more: https://github.com/tpmatthes/scroll-reaction
 * MIT License
 */

// Global object, can be used as a constructor function (e.g. new ScrollReaction())
// Wrapped in an IIFE to make use of private variables
window.ScrollReaction = (function() {
	/**
	 * Default config, may be overriden by passing a config object to the constructor function
	 * @type {Object}
	 *
	 * @example
	 * new ScrollReaction({offset: 80})
	 */
	var config = {
		/**
		 * This attribute is used to find listener elements, add it to any element
		 * By default the href page anchor (e.g. href="#test") will be used to identify emitter elements
		 * However, you can set this attribute to a valid id, if no href attribute exists
		 * @type {String}
		 *
		 * @example
		 * <a href="#section-1" data-scroll-reaction>...</a>
		 * <section id="section-1">...</section>
		 */
		attribute: 'data-scroll-reaction',

		/**
		 * This attribute will be added to listener elements, when the user reaches an emitter element
		 * If you pass an empty string or explicity set it to false, no attribute will be added
		 * It’s entirely up to you to add styling, e.g. a[data-scroll-active] { ... }
		 * @type {String}
		 */
		attributeCurrent: 'data-scroll-active',

		/**
		 * This offset will be subtracted from the vertical position of any emitter element
		 * If your listener element should receive its attribute earlier (scrolling down), pass a higher value
		 * @type {Number}
		 */
		offset: 5,

		/**
		 * If you enable this option, the base offset will be calculated from the height of an element
		 * This option accepts any query selector, e.g. '#navigation' or 'nav'
		 * The first element, which matches the given selector, will be used
		 * If you use both offset options, the base offset will be added to this
		 * @type {String}
		 */
		offsetFrom: '',

		/**
		 * Should smooth scrolling be enabled for all listener elements?
		 * You probably want to disable this option, if you use custom event listeners for your links
		 * If this option is set to 'auto', the script will automatically check for browser support
		 * If you use your own polyfill for scroll behavior, set this option to true
		 * The file scroll-reaction-with-polyfill.min.js includes a polyfill (see releases)
		 * @type {Boolean}
		 */
		smoothScroll: 'auto',

		/**
		 * The update method will get called at a limited rate on scroll (by default 10 times per second)
		 * However, the max rate can be changed, because it limits the FPS in a custom update callback
		 * @type {Number}
		 */
		throttleDelay: 100,

		/**
		 * The last emitter element may be "unreachable" on bigger screens
		 * An emitter is only triggered when the user scrolls past it (- configured offset)
		 * If the user scrolls to the bottom, the last emitter will be activated automatically
		 * If the listener element should receive its attribute earlier (scrolling down), pass a higher value
		 * Any negative value (<0) will make the last emitter unreachable (do you really want that?)
		 * @type {Number}
		 */
		windowBottomOffset: 20
	};

	// Arrays with all elements affected by this script
	// This script assigns an attribute to all listener elements, if the user scrolls past a linked emitter element
	var listeners = [],
		emitters = [];
	// Official offset (generated from config)
	var offset = 0;
	// The offset will match this elements height, if offsetFrom is enabled
	var offsetFromElement = null;

	// Callback functions
	var callbacks = {
		update: null,
		click: null
	};

	// Does the browser support smooth scroll behaviour?
	var supportsSmoothScrolling = config.smoothScroll == 'auto' && 'scrollBehavior' in document.documentElement.style;

	// The constructor function returns this object and all of its methods
	var ScrollReaction = {
		/** @type {Number} How far has the user scrolled (in pixels)? */
		position: 0,
		/** @type {Number} How far has the user scrolled (in percent)? */
		status: 0,

		/**
		 * Initializes all event listeners and updates emitters and listeners for the first time
		 * This method will be called automatically
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
			// The update method will get called at a limited rate (5 times per second)
			// This prevents unnecessary function calls and improves the overall performance
			window.addEventListener('scroll', defer(this.update, this, config.throttleDelay, true));
		},

		/**
		 * Sets a callback with access to Scroll Reactions properties (via this)
		 * Advanced scroll effects rely on multiple event listeners
		 * Pass 'update' as the event name to call the callback on each update
		 * Pass 'click' to call the callback whenever the user clicks on a smooth scroll link
		 * @param {String} event Name of the event (e.g. 'update', 'click')
		 * @param {Function} callback Function to be called
		 */
		on: function(event, callback) {
			// Abort, if the callback is not a valid function
			if (typeof callback !== 'function') return;

			// Assign the callback
			callbacks[event] = callback.bind(this);

			// Call update callback on initialization
			if (event == 'update') callback();
		},

		/**
		 * Finds all listener and emitter elements and adds them (with metadata) to the corresponding arrays
		 */
		refresh: function() {
			// Find all listener elements (by attribute)
			var foundListeners = document.querySelectorAll('[' + config.attribute + ']');
			// Lookup array to check if an emitter is already registered
			var emittersLookup = [];

			// Process listener elements, if at least one exists
			if (foundListeners.length > 0) {
				// Empty both arrays, because this method may be called again
				listeners = [];
				emitters = [];

				// Loop trough all listener elements (no for...of loop for <ES6 compatibility)
				for (var i = 0; i < foundListeners.length; i++) {
					// Get the href attribute of the listener element
					var href = foundListeners[i].getAttribute('href');
					// Does the href attribute contain a page anchor?
					var listenerHref = href.indexOf('#') == 0 ? href.replace('#', '') : '';
					// Find the corresponding emitter element (by ID)
					// If the href attribute is a page anchor, it will be used to find the emitter element
					// Otherwise the configured attribute will be used
					var emitterId = listenerHref ? listenerHref : foundListeners[i].getAttribute(config.attribute);
					var emitter = emitterId ? document.getElementById(emitterId) : null;
					// Variables for new listener and emitter objects
					var newListener, newEmitter;

					// Add an event listener for smooth scrolling
					// A valid listener element or a scroll to top link is required
					if (config.smoothScroll !== false && (listenerHref || href == '#')) {
						// An existing emitter isn't required, because a "scroll to top" link should be possible
						// In that case, an empty scroll reaction attribute is used (e.g. <a href="#" data-scroll-reaction="">)
						// If the event listener is already defined on the object, it will not be added again (named function)
						foundListeners[i].addEventListener('click', scrollSmoothly);
					}

					// Does the emitter element exist?
					// Listeners without linked emitters aren't allowed (they would be useless)
					if (emitter) {
						// Create a new emitter object
						newEmitter = {
							element: emitter,
							active: false
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
			// Update the status: How far has the user scrolled?
			// Math.min fixes rounding errors: The status can't be >100%
			this.status = Math.min(this.position / windowBottomPosition * 100, 100);

			// Call the update callback function, if set
			if (callbacks.update) callbacks.update();

			// Abort, if no attribute should be added for listeners linked to an active emitter (performance)
			if (!config.attributeCurrent) return;

			// Update the offset, if necessary
			// It can be calculated from an elements height (including borders and padding)
			if (offsetFromElement) offset = offsetFromElement.offsetHeight + config.offset;

			// Loop trough all emitters (from last to first)
			for (var i = emitters.length - 1; i >= 0; i--) {
				// Get the Y coordinate of the emitter element (+ configured offset)
				var emitterPosition = emitters[i].element.getBoundingClientRect().top + this.position - offset;

				// Has the user reached the position of the emitter element?
				// Or has the user scrolled all the way to the bottom of the page?
				// And is it the first emitter to be activated?
				if ((this.position > emitterPosition || this.position >= bottomPosition) && !activatedOnce) {
					// Mark this emitter as currently active
					emitters[i].active = true;
					// Every other emitter in the loop should not be currently active
					activatedOnce = true;
				} else {
					// Mark this element as not currently active
					emitters[i].active = false;
				}
			}

			// Loop trough all listeners (no for...of loop for <ES6 compatibility)
			for (var p in listeners) {
				var emitter = emitters[listeners[p].emitterIndex];
				var listener = listeners[p];

				// Is the linked emitter active?
				if (emitter.active) {
					// Add the configured attribute to the listener element
					listener.element.setAttribute(config.attributeCurrent, '');
				} else {
					// Remove the attribute, if the emitter is not currently active
					listener.element.removeAttribute(config.attributeCurrent);
				}
			}
		},

		/**
		 * Scrolls to an element with a given ID or scrolls to top, if no ID is specified
		 * @param {String} id Of the element the browser should scroll to [optional]
		 */
		scrollTo: function(id) {
			// Scroll to top by default
			var endPosition = 0;
			// Find the corresponding element
			var element = id ? document.getElementById(id) : null;
			// Current URL for history API
			var currentUrl;

			// Does the element exist?
			if (element) {
				// Update the offset, if necessary
				// It will be calculated from an elements height (including borders and padding)
				// Needs to be calculated again, because the height of a mobile menu may change (on dropdown)
				if (offsetFromElement) offset = offsetFromElement.offsetHeight + config.offset;

				// Get the position of the element, relative to the current position
				// Subtract the configured offset and add one extra pixel to trigger linked listeners
				endPosition = element.getBoundingClientRect().top + this.position - offset + 1;
				// Focus the element for screen readers (accessibility)
				element.focus();
			}

			// Does the browser support the history API?
			if (window.history.replaceState) {
				// Get the current url, without the hash
				currentUrl = window.location.href.replace(window.location.hash, '');
				// Change the state in the history
				// If the ID is empty, the hash will be removed from the url
				window.history.replaceState(null, null, id ? '#' + id : currentUrl);
			}

			// Is smooth scrolling explicity enabled or supported?
			if (config.smoothScroll === true || supportsSmoothScrolling) {
				// Scroll to the position - smoothly!
				window.scrollTo({ top: endPosition, left: 0, behavior: 'smooth' });
			} else {
				// Scroll to the position - not smoothly, but it works
				window.scrollTo(0, endPosition);
			}
		}
	};

	/**
	 * Helper function: scroll smoothly, if the user clicks on a listener link
	 * Needs to be called from an onclick event listener
	 * @param {Object} event Automatically passed by the event listener
	 */
	function scrollSmoothly(event) {
		// Get the ID of the element (without the hash symbol)
		var id = this.getAttribute('href').replace('#', '');

		// Prevent default behaviour (jumping to #link)
		event.preventDefault();

		// Call the click callback function, if set
		if (callbacks.click) callbacks.click();

		// Scroll to the desired location
		// Needs to be called with the correct scope, because scrollTo is a method from ScrollReaction
		ScrollReaction.scrollTo(id);
	}

	/**
	 * Helper function: a single function for debouncing or throttling
	 * Debounce mode: Executes a given callback function if there was no new call in $interval milliseconds
	 * Throttle mode (default): Executes a given callback function once every $interval milliseconds
	 * @param {Function} callback Function to be debounced/throttled
	 * @param {Object} context For this binding
	 * @param {Number} interval Between function calls in milliseconds
	 * @param {Boolean} debounce Mode enabled? [default: false]
	 * @returns {Function}
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
	 * Constructor function for Scroll Reaction
	 * It should be called when the DOM is ready (e.g. onload)
	 * @param {Object} userConfig Custom configuration
	 * @return {Object}
	 */
	return function(userConfig) {
		// Overwrite default config properties where necessary
		for (p in userConfig) {
			// Copy the property to the config object
			config[p] = userConfig[p];
		}

		// Initialize Scroll Reaction
		ScrollReaction.init();

		// Return an object with all public methods
		return ScrollReaction;
	};

	// Thanks for reading the source code! Have a nice day
})();
