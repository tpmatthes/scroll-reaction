import defaultConfig from './default-config.js';
import defer from './defer.js';

/**
 * Constructor function for Scroll Reaction
 * It should be called when the DOM is ready (e.g. onload)
 * @param {Object} userConfig Custom configuration
 * @return {Object}
 */
export default function(userConfig) {
	// Helper variable for correct this binding
	// Arrow functions would solve this problem, but they are not supported by ES5
	var self = this;

	// Lists of all available listener and emitter elements
	// Searching in the DOM is not very efficient, so the data is stored temporary
	var listeners = [];
	// Each emitter element has a unique ID, so a "real" object is used for storing their data
	var emitters = {};

	// Official offset, calculated from user config and offsetFrom element
	var offset = 0;
	// The offset will match this elements height, if offsetFrom is enabled
	var offsetFromElement = null;

	// List of all active event handlers
	var events = [];

	// Merged config, user config overrides default conig
	var config = {};

	// Overwrite default config properties where necessary
	for (var c in defaultConfig) {
		// Copy the property to the "real" config object
		config[c] = c in userConfig ? userConfig[c] : defaultConfig[c];
	}

	// Does the browser support smooth scroll behaviour?
	var supportsSmoothScrolling = config.smoothScroll == 'auto' && 'scrollBehavior' in document.documentElement.style;

	// Global properties, available inside event listeners
	this.position = 0;
	this.status = 0;

	/**
	 * Initializes everything for the first usage
	 * Updates emitter and listener elements for the first time
	 * This method will be called automatically
	 */
	this.init = function() {
		// Create fresh data for emitters and listeners
		this.refresh();

		// Update emitter and listener elements if the user changes the window size
		// Usually the update method won't get called while resizing the window
		// This prevents unnecessary function calls and improves the overall performance
		window.addEventListener('resize', defer(this.update, this, 200, true));
		window.addEventListener('orientationchange', defer(this.update, this, 200, true));

		// Update emitter and listener elements if the user scrolls
		// The update method will get called at a limited rate (X times per second)
		// This prevents unnecessary function calls and improves the overall performance
		window.addEventListener('scroll', defer(this.update, this, config.throttleDelay, false));
	};

	/**
	 * Finds all listener and emitter elements in the DOM
	 * Needs to be called again when the structure of the DOM changes
	 */
	this.refresh = function() {
		// Find all listener elements by attribute of choice
		var foundListeners = document.querySelectorAll('[' + config.attribute + ']');

		// Process listener elements, if at least one exists
		if (foundListeners.length > 0) {
			// Empty stored data, because this method may be called again
			listeners = [];
			emitters = {};

			// Loop trough all listener elements
			for (var f = foundListeners.length - 1; f >= 0; f--) {
				// Does the element have a href attribute and does it contain a page anchor?
				var href = foundListeners[f].getAttribute('href');
				var listenerHref = href && href.indexOf('#') == 0 ? href.replace('#', '') : '';
				// Find the corresponding emitter element (by ID)
				// If the href attribute is a page anchor, it will be used to find the emitter element
				// Otherwise the configured attribute will be used
				var emitterId = listenerHref ? listenerHref : foundListeners[f].getAttribute(config.attribute);
				var emitter = emitterId ? document.getElementById(emitterId) : null;

				// Add an event listener for smooth scrolling
				// A valid listener element or a scroll to top link is required
				if (config.smoothScroll !== false && (listenerHref || href == '#')) {
					// An existing emitter isn't required, because a "scroll to top" link should be possible
					// In that case, an empty scroll reaction attribute is used (e.g. <a href="#" data-scroll-reaction="">)
					// If the event listener is already defined on the object, it will not be added again (named function)
					foundListeners[f].addEventListener('click', scrollSmoothly);
				}

				// Does the emitter element exist?
				// Listener elements without linked emitter elements aren't allowed
				// They would be useless
				if (emitter) {
					// Create a new emitter object
					// If the emitter is already known, it will be overriden
					emitters[emitterId] = {
						element: emitter,
						active: false
					};
					// Add the listener object to the corresponding array
					// It's possible to have multiple listener elements linked to the same emitter element
					listeners.push({
						element: foundListeners[f],
						emitterId: emitterId
					});
				}
			}
		}

		// Should the offset be calculated from an elements height?
		if (config.offsetFrom) {
			// Try to find the element based on the configured selector
			offsetFromElement = document.querySelector(config.offsetFrom);
		} else {
			// If no selector is specified, the offset is simply an option
			offset = config.offset;
		}

		// Update all elements, just in case the user has already scrolled
		// This can happen when the URL contans a page anchor (e.g. #link)
		this.update();
	};

	/**
	 * Updates everything to reflect the current scroll position
	 */
	this.update = function() {
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

		// Call any update callback, if set
		this.emit('update');

		// Abort, if no attribute should be added for listener elements
		// This increases the performance, because unnecessary code is skipped
		if (!config.attributeCurrent) return;

		// Update the offset, if necessary
		// It may be calculated from an elements height
		// This includes all borders and padding
		if (offsetFromElement) offset = offsetFromElement.offsetHeight + config.offset;

		// Loop trough all emitter elements
		for (var e in emitters) {
			// Get the Y coordinate of the emitter element (+ configured offset)
			var emitterPosition = emitters[e].element.getBoundingClientRect().top + this.position - offset;

			// Has the user reached the position of the emitter element (- offset)?
			// Or has the user scrolled all the way to the bottom of the page?
			var hasReachedEmitter = this.position > emitterPosition || this.position >= bottomPosition;

			// Can the emitter element be marked as active?
			if (hasReachedEmitter && !activatedOnce) {
				// Mark this emitter element as currently active
				emitters[e].active = true;
				// Every other emitter element in the loop should not be currently active
				activatedOnce = true;
			} else {
				// Mark this emitter element as not currently active
				emitters[e].active = false;
			}
		}

		// Loop trough all listener elements
		for (var l in listeners) {
			var emitter = emitters[listeners[l].emitterId];
			var listener = listeners[l];

			// Is the linked emitter element currently active?
			if (emitter.active) {
				// Add the configured attribute to the listener element
				listener.element.setAttribute(config.attributeCurrent, '');
			} else {
				// Remove the attribute, if the emitter is not currently active
				listener.element.removeAttribute(config.attributeCurrent);
			}
		}
	};

	/**
	 * Scrolls to an element with a given ID
	 * Scrolls to top, if no ID is specified
	 * @param {String} id Of the element the browser should scroll to [optional]
	 */
	this.scrollTo = function(id) {
		// Find the corresponding element
		var element = id ? document.getElementById(id) : null;
		// Scroll to top by default
		var endPosition = 0;
		// Current URL for history API
		var currentUrl;

		// Does the element exist?
		if (element) {
			// Update the offset, if necessary
			// It may be be calculated from an elements height
			// This includes all borders and padding
			// It neeeds to be calculated again, because the height may change
			if (offsetFromElement) offset = offsetFromElement.offsetHeight + config.offset;

			// Get the position of the element, relative to the current position
			// Subtract the configured offset
			// Add one extra pixel to trigger linked listener elements
			endPosition = element.getBoundingClientRect().top + this.position - offset + 1;

			// Focus the element for screen readers (accessibility)
			element.focus();
		}

		// Does the browser support the history API?
		if (window.history.replaceState) {
			// Get the current url, without the hash
			currentUrl = window.location.href.replace(window.location.hash, '');
			// Change the state in the history
			// If scrolling to top, the hash can be removed from the url
			window.history.replaceState(null, null, id ? '#' + id : currentUrl);
		}

		// Is smooth scrolling supported or forced (config)?
		if (supportsSmoothScrolling || config.smoothScroll === true) {
			// Scroll to the position - smoothly!
			window.scrollTo({ top: endPosition, left: 0, behavior: 'smooth' });
		} else {
			// Scroll to the position - not smoothly, but it works
			window.scrollTo(0, endPosition);
		}
	};

	/**
	 * Helper function: scroll smoothly, if the user clicks on a listener link
	 * Needs to be called from an onclick event listener
	 * @param {Object} event Automatically passed by the event listener
	 */
	var scrollSmoothly = function(event) {
		// Get the ID of the element (without the hash symbol)
		var id = this.getAttribute('href').replace('#', '');

		// Prevent default behaviour (jumping to #link)
		event.preventDefault();

		// Call any click callback, if set
		this.emit('click');

		// Scroll to the desired location
		// Needs to be called with the correct scope, because scrollTo is an internal method
		self.scrollTo(id);
	};

	/**
	 * Sets a callback with access to Scroll Reactions properties (via this)
	 * Advanced scroll effects rely on multiple event listeners
	 * Pass 'update' as the event name to call the callback on each update
	 * Pass 'click' to call the callback whenever the user clicks on a smooth scroll link
	 * @param {String} event Name of the event (e.g. 'update', 'click')
	 * @param {Function} callback Function to be called
	 */
	this.on = function(name, callback) {
		// Abort, if the callback is not a valid function
		if (typeof callback !== 'function') return;

		// Assign the callback with the correct this binding
		events.push({ name: name, callback: callback });

		// Call update callback on initialization
		if (name == 'update') callback.call(this);
	};

	/**
	 * Emits an event and calls linked event listeners
	 * Used internally, e.g. in the update method
	 * @param {String} name Of the event
	 */
	this.emit = function(name) {
		// Loop trough all events
		for (var e = 0; e < events.length; e++) {
			// Call appropriate callbacks
			if (events[e].name === name) {
				events[e].callback.call(this);
			}
		}
	};

	// No need to call this manually - it just works!
	this.init();

	// Thanks for reading the source code! Have a nice day
}
