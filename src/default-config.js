/**
 * Default configuration
 */
export default {
	/**
	 * This attribute is used to find listener elements
	 * By default the href page anchor (e.g. href="#test")
	 * will be used to identify emitter elements
	 * However, you can set this attribute to a valid id,
	 * if no href attribute exists
	 * @type {String}
	 *
	 * @example
	 * <a href="#section-1" data-scroll-reaction>...</a>
	 * <section id="section-1">...</section>
	 */
	attribute: 'data-scroll-reaction',

	/**
	 * This attribute will be added to listener elements,
	 * if the user reaches an emitter element
	 * If you pass an empty string or explicity set it to false,
	 * no attribute will be added
	 * It’s entirely up to you to add styling
	 * Example: a[data-scroll-active] { ... }
	 * @type {String}
	 */
	attributeCurrent: 'data-scroll-active',

	/**
	 * This offset will be subtracted from the vertical position
	 * of any emitter element before calculating the current scroll position
	 * If your listener element should receive its attribute earlier,
	 * you should pass a (much) higher value
	 * @type {Number}
	 */
	offset: 5,

	/**
	 * If you enable this option, the base offset
	 * will be calculated from the height of an element
	 * This option accepts any query selector, e.g. '#navigation' or 'nav'
	 * The first element, which matches the given selector, will be used
	 * If you use both offset options, the base offset will be added to this
	 * @type {String}
	 */
	offsetFrom: '',

	/**
	 * If the user scrolls past an emitter element,
	 * all linked listener elements will get a new attribute
	 * If the user scrolls back up or reaches another emitter element,
	 * existing attributes will be removed immediately
	 * Set this option to false to prevent removing of attributes
	 * This can be used to create one-off animations for appearing elements
	 * @type {Boolean}
	 */
	rewind: true,

	/**
	 * Should smooth scrolling be enabled for all listener elements?
	 * Browser support is checked automatically, if set to 'auto'
	 * If you use custom event listeners for your links,
	 * you probably want to disable this option (= false)
	 * Set this option to true, if you use your own polyfill
	 * The script can only check for native support, not for polyfills
	 * @type {Boolean}
	 */
	smoothScroll: 'auto',

	/**
	 * The update method will get called at a limited rate on scroll
	 * By default it will get called 10 times per second
	 * This can limit the FPS in a custom update callback
	 * Feel free to change it to a lower value, if that's the case
	 * @type {Number}
	 */
	throttleDelay: 100,

	/**
	 * The last emitter element may be "unreachable" on bigger screens
	 * Usually an emitter element is only triggered when the user scrolls past it
	 * However, if the user scrolls to the bottom of the page,
	 * the last emitter element will be activated automatically
	 * If linked listener elements should receive their attributes earlier,
	 * you should pass a (much) higher value
	 * Negative values (<0) will make the last emitter element unreachable
	 * Do you really want that?
	 * @type {Number}
	 */
	windowBottomOffset: 20
};
