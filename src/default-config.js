/**
 * Default configuration
 */
export default {
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
