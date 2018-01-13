# Scroll-Reaction.js

### Performant and fully customizable scroll effects

**Supports native smooth scrolling by default!**

Let’s face it: We develop a lot of single page websites these days. Most of them need some sort of navigation, where the
current section is highlighted. And they need smooth scrolling, too.

It can be a tedious task: It involves listening to scroll and resize events, updating DOM elements and thinking about
edge cases (e.g. unreachable sections). And did I mention the perfomance issues of an un-throttled callback function?

You probably don’t want to think about that, and you don’t want to pull in a huge library either.

Introducing _Scroll-Reaction.js_ – a tiny JavaScript library for ridiculously easy scroll effects.

**Some benefits:**

* ready to use in less than a minute
* very small file size (~ 1KB gzipped)
* dependency free
* optimized for performance
* fully customizable, if you need it
* easy to use

# Table of contents

* [Download](#download)
* [Getting started](#getting-started)
* [Options](#options)
* [API and Events](#api-and-events)
* [Help and browser support](#help-and-browser-support)
* [License](#license)

# Download

Download it here:
[Scroll-Reaction.js](https://github.com/tpmatthes/scroll-reaction/releases/download/v2.0.0/scroll-reaction.zip)

Include the basic version in your HTML file:

```html
<script src="scroll-reaction.min.js"></script>
```

**Please note:** Most modern browsers still
[don’t support scroll behavior](https://developer.mozilla.org/de/docs/Web/CSS/scroll-behavior) for native smooth
scrolling. The default version of _Scroll-Reaction.js_ doesn’t include a polyfill. If you need a polyfill, you can use
the file `scroll-reaction-with-polyfill.min.js`.

# Getting started

Let’s say we’re building a simple website with 3 sections:

```html
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

We want to add a navigation, where the link to the current section is highlighted. For that purpose we add some markup
with _Scroll-Reaction.js_-specific data attributes:

```html
<nav>
  <a href="#section-1" data-scroll-reaction>Section 1</a>
  <a href="#section-2" data-scroll-reaction>Section 2</a>
  <a href="#section-3" data-scroll-reaction>Section 3</a>
</nav>
```

We’re almost there! We now have to include _Scroll-Reaction.js_ and initialize it:

```html
<script src="scroll-reaction.min.js"></script>
<script>
  var reaction = new ScrollReaction();
</script>
```

Done!

If a user scrolls to one of our sections, the corresponding anchor tag receives a new attribute: `data-scroll-active`.
Additionally, if the user clicks on a link, the browser will scroll smoothly to the destination.

It’s entirely up to you to add styling, _Scroll-Reaction.js_ only assigns attributes.

#### Bonus tip: “Scroll to top” link

You can easily create a “scroll to top” link with smooth scrolling. Just add a data attribute:

```html
<a href="#" data-scroll-reaction>Beam me up!</a>
```

#### More examples

Be sure to have a look at the [examples](https://github.com/tpmatthes/scroll-reaction/tree/master/examples) to learn
more about _Scroll-Reaction.js_.

# Options

_Scroll-Reaction.js_ is fully customizable, if you need it.

You can pass a config object to the constructor function. These are the default values:

```js
var reaction = new ScrollReaction({
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
  attribute: "data-scroll-reaction",

  /**
   * This attribute will be added to listener elements, when the user reaches an emitter element
   * If you pass an empty string or explicity set it to false, no attribute will be added
   * It’s entirely up to you to add styling, e.g. a[data-scroll-active] { ... }
   * @type {String}
   */
  attributeCurrent: "data-scroll-active",

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
  offsetFrom: "",

  /**
   * Should smooth scrolling be enabled for all listener elements?
   * You probably want to disable this option, if you use custom event listeners for your links
   * If this option is set to 'auto', the script will automatically check for browser support
   * If you use a polyfill for scroll behavior, set this option to true
   * The file scroll-reaction-with-polyfill.min.js includes a polyfill (see releases)
   * @type {Boolean}
   */
  smoothScroll: "auto",

  /**
   * The update method will get called at a limited rate on scroll (by default 10 times per second)
   * However, the max rate can be changed, because it limits the FPS in a custom update callback
   * @type {Number}
   */
  throttleDelay: 100,

  /**
   * The last emitter element may be "unreachable" on bigger screens
   * An emitter is only triggered when the user scrolls past it (- configured offset)
   * However, if the user scrolls to the bottom, the last emitter will be activated automatically
   * If the listener element should receive its attribute earlier (scrolling down), pass a higher value
   * Any negative value (<0) will make the last emitter unreachable (do you really want that?)
   * @type {Number}
   */
  windowBottomOffset: 20
});
```

# API and Events

_Scroll-Reaction.js_ has a simple API:

```js
// Include scroll-reaction.min.js first!

// Basic Setup
var reaction = new ScrollReaction();

// Access the current scroll position in pixels at any time:
var pixels = reaction.position; // e.g. 750

// Access the current scroll position in percent at any time:
var percentage = reaction.status + "%"; // e.g. 75%

// Call this function on scroll, resize and orientation change
reaction.on("update", function() {
  // Available variables (see above)
  // this.position
  // this.status
});

// If you reorder or delete elements on the page, you should refresh the cache:
reaction.refresh();

// If you add elements or change their height, you should update the position and the status:
reaction.update(); // Otherwise they will update when the next scroll or resize event occurs

// Scroll to a specific element:
reaction.scrollTo("my-id"); // Just pass the ID as an argument

// Scroll to top:
reaction.scrollTo();
```

# Help and browser support

Be sure to have a look at the [examples](https://github.com/tpmatthes/scroll-reaction/tree/master/examples) to learn
more about _Scroll-Reaction.js_.

If you run into trouble, feel free to post your questions in the
[issues section](https://github.com/tpmatthes/scroll-reaction/issues).

_Scroll-Reaction.js_ supports all modern browsers (requires [ES5](http://caniuse.com/#feat=es5)). It doesn’t rely on ES6
features, so it should support a fair amount of older browsers as well – even Internet Explorer 9+.

Most modern browsers still
[don’t support scroll behavior](https://developer.mozilla.org/de/docs/Web/CSS/scroll-behavior) for native smooth
scrolling. The default version of _Scroll-Reaction.js_ doesn’t include a polyfill. If you need a polyfill, you can use
the file `scroll-reaction-with-polyfill.min.js`.

# License

_Scroll-Reaction.js_ is licensed under the
[MIT license](https://github.com/tpmatthes/scroll-reaction/blob/master/LICENSE).

Attribution is not required, but always appreciated. Building great things? Show me! :)

Copyright 2017 Tim-Patrick Matthes
