# Scroll-Reaction.js
### Performant, dependency free and fully customizable scroll effects

**Now with native smooth scrolling!**

Let’s face it: We develop a lot of single page websites these days. Most of them need some sort of navigation, where the current section is highlighted. And they need smooth scrolling, too.

It can be a tedious task: It involves listening to scroll and resize events, updating class names and thinking about edge cases (e.g. unreachable sections). And did I mention the perfomance issues of an un-throttled callback function? 

You probably don’t want to think about that, and you don’t want to pull in a huge library either.

Introducing *Scroll-Reaction.js* – a tiny JavaScript library for ridiculously easy scroll effects

**Some benefits:**
- very small file size (~ 1KB gzipped)
- dependency free
- optimized for performance
- fully customizable
- easy to use

# Download
Download it here: [Scroll-Reaction.js](https://github.com/tpmatthes/scroll-reaction/releases/download/v1.1.2/scroll-reaction.zip)

Include it in your HTML file:

``` html
<script src="scroll-reaction.min.js"></script>
```

If you want to use smooth scrolling (disabled by default), you should add a [polyfill](https://github.com/iamdustan/smoothscroll). Most modern browsers still [don’t support scroll behavior](https://developer.mozilla.org/de/docs/Web/CSS/scroll-behavior).

# Getting started
Let’s say we’re building a simple website with 3 sections:

``` html
<section id="section-1">
  ...
</section>
<section id="section-2">
  ...
</section>
<section id="section-3">
  ...
</section>
```

We want to add a navigation, where the link to the current section is highlighted. For that purpose we add some markup with *Scroll-Reaction.js*-specific data attributes:

``` html
<nav>
  <!-- The value of the data attribute should match the id of the element we want to target -->
  <a href="#section-1" data-scroll-reaction="section-1">Section 1</a>
  <a href="#section-2" data-scroll-reaction="section-2">Section 2</a>
  <a href="#section-3" data-scroll-reaction="section-3">Section 3</a>
</nav>
```

We’re almost there! We only have to include *Scroll-Reaction.js* and initialize it:

``` html
<script src="scroll-reaction.min.js"></script>
<script>
  var scrollEffects = new ScrollReaction();
  scrollEffects.init();
</script>
```

Done!

Now, if a user scrolls to one of our sections, the corresponding anchor tag receives a new class: `.is-active`. If the user scrolls past one of our sections, the class of the anchor tag changes to: `.was-active`.

It’s entirely up to you to add styling to those classes, *Scroll-Reaction.js* only assigns them.

#### Bonus tip: “Scroll to top” link

You can easily create a “scroll to top” link with smooth scrolling. Just add an empty data attribute:

``` html
<a href="#" data-scroll-reaction>Beam me up!</a>
```

And enable smooth scrolling in your config:
``` html
<script src="scroll-reaction.min.js"></script>
<script>
  var scrollEffects = new ScrollReaction({
    smoothScroll: true
  });
  scrollEffects.init();
</script>
```

Smooth scrolling requires an external [polyfill](https://github.com/iamdustan/smoothscroll) for most modern browsers. Please scroll down to learn more about browser support for smooth scrolling.

#### More examples

Be sure to have a look at the [examples](https://github.com/tpmatthes/scroll-reaction/tree/master/examples) to learn more about *Scroll-Reaction.js*.

# Options
*Scroll-Reaction.js* is fully customizable.

You can pass a config object to the constructor function. These are the default values:

``` js
var scrollEffects = new ScrollReaction({
  /**
   * This attribute is used to find listener elements
   * Add it to any element, the value should match the id of the emitter element
   * @type {String}
   * 
   * @example
   * <a data-scroll-reaction="section-1" href="#section-1">...</a>
   * <section id="section-1">...</section>
   */
  attribute: 'data-scroll-reaction',

  /**
   * This classes will be added to listener elements
   * It will be added when the user reaches an emitter element
   * If you pass an empty string, no class will be added
   * @type {String}
   */
  classCurrent: 'is-active',

  /**
   * This classes will be added to listener elements
   * It will be added when the user has scrolled past an emitter element
   * If you pass an empty string, no class will be added
   * @type {String}
   */
  classPrevious: 'was-active',

  /**
   * This offset will be subtracted from the vertical position of any emitter element
   * If your listener element should receive its class earlier (scrolling down), pass a higher value
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
   * This function will be called when the user clicks on a listener link
   * If smooth scrolling is enabled, all listener links will automatically get event listeners
   * The ID of the emitter element will be passed as an argument
   * @type {Function}
   */
  onClick: null,

  /**
   * This function will be called when the user is scrolling or resizing the window
   * The vertical scroll position and the status (0-100%) will be passed as arguments
   * @type {Function}
   */
  onUpdate: null,

  /**
   * Should smooth scrolling be enabled for all listener elements?
   * You should add a polyfill (not included) for scroll behavior, if you enable this option
   * If this is enabled and the browser doesn't support it, you will only get a warning in the console
   * You probably don't want to enable this option, if you use custom event listeners for your links
   * Polyfill: https://github.com/iamdustan/smoothscroll
   * @type {Boolean}
   */
  smoothScroll: false,

  /**
   * The update method will get called at a limited rate on scroll (by default 20 times per second)
   * However, the max rate can be changed, because it limits the FPS in a custom callback
   * @type {Number}
   */
  throttleDelay: 50,

  /**
   * The last emitter element may be "unreachable" on bigger screens
   * An emitter is only triggered when the user scrolls past it (- configured offset)
   * However, if the user scrolls to the bottom, the last emitter will be activated automatically
   * If the listener element should receive its class earlier (scrolling down), pass a higher value
   * Any negative value (<0) will make the last emitter unreachable (do you really want that?)
   * @type {Number}
   */
  windowBottomOffset: 20,
});

// Initialize
scrollEffects.init();
```

# API
*Scroll-Reaction.js* has a simple API:

``` js
// Include scroll-reaction.min.js first!

// Basic Setup
var scrollEffects = new ScrollReaction({
  // Enable smooth scrolling
  smoothScroll: true
});
scrollEffects.init();

// Access the current scroll position in pixels at any time:
var pixels = scrollEffects.position; // e.g. 750

// Access the current scroll position in percent at any time:
var percentage = scrollEffects.status + '%'; // e.g. 75%

// If you reorder or delete elements on the page, you should refresh the cache:
scrollEffects.refresh();

// If you add elements or change their height, you should update the position and the status:
scrollEffects.update(); // Otherwise they will update when the next scroll or resize event occurs

// Scroll to a specific element:
scrollEffects.scrollTo('my-id'); // Just pass the ID as an argument

// Scroll to top:
scrollEffects.scrollTo();
```

# Help and browser support
Be sure to have a look at the [examples](https://github.com/tpmatthes/scroll-reaction/tree/master/examples) to learn more about *Scroll-Reaction.js*.

If you run into trouble, feel free to post your questions in the [issues section](https://github.com/tpmatthes/scroll-reaction/issues).

*Scroll-Reaction.js* supports all modern browsers (requires [ES5](http://caniuse.com/#feat=es5) and [classList](http://caniuse.com/#feat=classlist)). It doesn’t rely on ES6 features, so it should support a fair amount of older browsers as well – even Internet Explorer 10+.

If you use smooth scrolling (disabled by default), you should add a [polyfill](https://github.com/iamdustan/smoothscroll). Most modern browsers still [don’t support scroll behavior](https://developer.mozilla.org/de/docs/Web/CSS/scroll-behavior). However, *Scroll-Reaction.js* won’t fail if the browser lacks support for scroll behavior. It will use a non-smooth “page jump” instead.

# License
*Scroll-Reaction.js* is licensed under the [MIT license](https://github.com/tpmatthes/scroll-reaction/blob/master/LICENSE).

Attribution is not required, but always appreciated. Building great things? Show me! :)

Copyright 2017 Tim-Patrick Matthes
