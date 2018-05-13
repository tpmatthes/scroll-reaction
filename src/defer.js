/**
 * Helper function: a single function for debouncing or throttling
 * Debounce mode executes a given callback function
 * if there was no new call in $interval milliseconds
 * Throttle mode (default) executes a given callback function
 * once every $interval milliseconds
 * @param {Function} callback Function to be debounced/throttled
 * @param {Object} context For this binding
 * @param {Number} interval Between function calls in milliseconds
 * @param {Boolean} debounce Debounce mode enabled? [default: false]
 * @returns {Function}
 */
export default function(callback, context, interval, debounce) {
	var lastTime, deferTimer;
	// Return a function, because this function is used as a callback
	return function() {
		// Save current time
		var now = Date.now();
		// Defer the callback function if debounce mode is activated
		// Or throttle the function if necessary
		if (debounce || (lastTime && now < lastTime + interval)) {
			// Restart current timeout
			clearTimeout(deferTimer);
			// Execute the callback function in $interval milliseconds
			deferTimer = setTimeout(function() {
				// Save the current time for the next call
				lastTime = now;
				// Execute the callback function with the given context
				callback.call(context);
			}, interval);
		} else {
			// Save the current time for the next call
			lastTime = now;
			// Execute the callback function with the given context
			callback.call(context);
		}
	};
}
