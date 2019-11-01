/**
 * Default configuration
 */
export default {
	/**
	 * This attribute is used to find listener elements.
	 * By default the href page anchor (e.g. href="#...")
	 * will be used to identify emitter elements.
	 * However, you can set this attribute to a valid id,
	 * if no href attribute exists.
	 * @type {String}
	 *
	 * @example
	 * <a href="#section-1" data-scroll-reaction>...</a>
	 * <section id="section-1">...</section>
	 */
	attribute: 'data-scroll-reaction',

	/**
	 * This attribute will be added to listener elements,
	 * if the user reaches an emitter element.
	 * If you pass an empty string or explicity set it to false,
	 * no attribute will be added.
	 * It’s entirely up to you to add styling.
	 * @type {String}
	 *
	 * @example
	 * a[data-scroll-active] { ... }
	 */
	attributeCurrent: 'data-scroll-active',

	/**
	 * By default only one emitter element can be active at any given time.
	 * This is always the latest element, which has been reached by the user.
	 * If this option is set to true, every visible emitter element will become active.
	 * @type {Boolean}
	 */
	multiple: false,

	/**
	 * Top offset for detecting emitter elements inside the viewport.
	 * If your listener element should receive its attribute earlier,
	 * you should pass a (much) higher value.
	 * If you want the offset to always match the height of an element,
	 * you can pass a function, that calculates the offset and returns a number.
	 * @type {Number|function}
	 */
	offsetTop: 5,

	/**
	 * Bottom offset for detecting emitter elements inside the viewport.
	 * If your listener element should receive its attribute earlier,
	 * you should pass a (much) higher value.
	 * If you want the offset to always match the height of an element,
	 * you can pass a function, that calculates the offset and returns a number.
	 * This value has no effect, if the multiple config option is set to false.
	 * @type {Number|function}
	 */
	offsetBottom: 5,

	/**
	 * If the user scrolls past an emitter element,
	 * all linked listener elements will get a new attribute.
	 * If the user scrolls back up or reaches another emitter element,
	 * existing attributes will be removed immediately.
	 * Set this option to false to prevent removing of attributes.
	 * This can be used to create one-off animations for appearing elements.
	 * @type {Boolean}
	 */
	rewind: true,

	/**
	 * Should smooth scrolling be enabled for all listener elements?
	 * Browser support is checked automatically, if set to 'auto'.
	 * If you use custom event listeners for your links,
	 * you probably want to disable this option (= false).
	 * Set this option to true, if you use your own polyfill.
	 * The script can only check for native support, not for polyfills.
	 * @type {Boolean|'auto'}
	 */
	smoothScroll: 'auto',

	/**
	 * The update method will get called at a limited rate on scroll.
	 * By default it will get called 10 times per second.
	 * This can limit the FPS in a custom update callback.
	 * Feel free to change it to a lower value, if that's the case.
	 * @type {Number}
	 */
	throttleDelay: 100,

	/**
	 * The last emitter element may be "unreachable" on bigger screens.
	 * Usually an emitter element is only triggered when the user scrolls past it.
	 * However, if the user scrolls to the bottom of the page,
	 * the last emitter element will be activated automatically.
	 * If linked listener elements should receive their attributes earlier,
	 * you should pass a (much) higher value.
	 * Negative values (<0) will make the last emitter element unreachable.
	 * @type {Number}
	 */
	windowBottomOffset: 20
};
