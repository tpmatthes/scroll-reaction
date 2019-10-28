# Scroll-Reaction.js

### Performant, dependency free and fully customizable scroll effects

Highlight the current section in your navigation, hide your header on scroll or let elements appear with beautiful CSS transitions – it’s easy with _Scroll-Reaction.js_.

# Why do I need it?

Let’s face it: We develop a lot of single page websites these days. Most of them need some sort of navigation, where the current section is highlighted. And they need smooth scrolling, too.

It can be a tedious task: It involves listening to scroll and resize events, updating DOM elements and thinking about many stress cases (e.g. unreachable sections, keyboard accessibility, reduced motion media query). And did I mention the perfomance issues of an un-throttled callback function?

You probably don’t want to think about that, and you don’t want to pull in a huge library either.

Introducing _Scroll-Reaction.js_ – a tiny JavaScript library for ridiculously easy scroll effects.

**Some benefits:**

- ready to use in less than a minute
- very small file size (~ 1KB gzipped)
- dependency free
- optimized for performance
- fully customizable, if you need it

# Table of contents

1. [Installation](#installation)
2. [Getting started](#getting-started)
3. [Examples](#examples)
4. [Options](#options)
5. [API and Events](#api-and-events)
6. [Help and browser support](#help-and-browser-support)
7. [License](#license)

# Installation

## Option 1: Browser

Download it here: [scroll-reaction.min.js](https://github.com/tpmatthes/scroll-reaction/releases/download/v1.3.4/scroll-reaction.zip)

Include the basic version in your HTML file:

```html
<script src="scroll-reaction.min.js"></script>
```

Read [Getting started](#getting-started), scroll and party! 🎉

## Option 2: Node.js (build tools)

Use npm to install _Scroll-Reaction.js_ in your project:

```bash
$ npm install scroll-reaction
```

Include it:

```js
const ScrollReaction = require("scroll-reaction");
```

Done! 📦

---

**Please note:** Most modern browsers still [don’t support scroll behavior](https://developer.mozilla.org/de/docs/Web/CSS/scroll-behavior) for native smooth scrolling. The default version of _Scroll-Reaction.js_ doesn’t include a polyfill. If you need a polyfill, you can use the file `scroll-reaction-with-polyfill.min.js`.

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

We want to add a navigation, where the link to the current section is highlighted. For that purpose we add some markup with _Scroll-Reaction.js_-specific data attributes:

```html
<nav>
  <a href="#section-1" data-scroll-reaction>Section 1</a>
  <a href="#section-2" data-scroll-reaction>Section 2</a>
  <a href="#section-3" data-scroll-reaction>Section 3</a>
</nav>
```

Afterwards we include _Scroll-Reaction.js_ in the HTML file before `</body>` and initialize it:

```html
<script src="scroll-reaction.min.js"></script>
<script>
  var reaction = new ScrollReaction();
</script>
```

Done! 😮

Now, if a user scrolls to one of our sections, the corresponding anchor tag receives a new attribute: `data-scroll-active`. Additionally, if the user clicks on a link, the browser will scroll smoothly to the destination.

It’s entirely up to you to add styling. _Scroll-Reaction.js_ only assigns attributes. You can use an attribute selector to assign CSS styles to active links:

```css
a[data-scroll-active] {
  /* ... */
}
```

# Examples

## “Scroll to top” link

You can easily create a “scroll to top” link with smooth scrolling. Just add a data attribute:

```html
<a href="#" data-scroll-reaction>Beam me up!</a>
```

_Scroll-Reaction.js_ is smart enough to read the `href` attribute and send the user to the right location. It even updates the URL with the correct hash.

## Animated appearance of elements

_Scroll-Reaction.js_ works well with links, but it can handle any kind of HTML element. You want to animate the appearance of an element? Do it:

```html
<section id="example" data-scroll-reaction="example">
  Animate me!
</section>
```

If there is no `href` attribute, you have to assign a value to the data attribute. _Scroll-Reaction.js_ finds the element with the given ID (emitter element). It then assigns the new attribute `data-scroll-active` to the element with the `data-scroll-reaction` attribute (listener element), if the user reaches the position of the emitter element. In this example `<section>` is both emitter and listener element.

Include _Scroll-Reaction.js_:

```html
<script src="scroll-reaction.min.js"></script>
<script>
  var reaction = new ScrollReaction({
    // Never remove attributes
    rewind: false
  });
</script>
```

And add some nice CSS transitions:

```css
#example[data-scroll-active] {
  transition: all 1s ease;
  transform: rotate(180deg);
}
```

It’s easy! 🎊

## Hide your header on scroll

Maybe you have a fixed header like this:

```html
<header id="example">Hide me!</header>
```

You can use the _Scroll-Reaction.js_ API to hide it after a certain amount of scrolling:

```html
<script src="scroll-reaction.min.js"></script>
<script>
  // Get the header
  var header = document.getElementById("example");

  // Initialize Scroll Reaction
  var reaction = new ScrollReaction();

  reaction.on("update", function() {
    // Has the user scrolled too far?
    if (this.position > 999) {
      // Add a class to hide the header
      // You can easily animate it with CSS transitions
      header.classList.add("is-hidden");
    }
  });
</script>
```

Don’t forget to add some CSS for smooth transitions. ✨

## Even more examples

Be sure to have a look at the [examples folder](https://github.com/tpmatthes/scroll-reaction/tree/master/examples) to learn all about _Scroll-Reaction.js_.

# Options

_Scroll-Reaction.js_ is fully customizable, if you need it.

You can pass a config object to the constructor function. These are the default values:

```js
var reaction = new ScrollReaction({
  /**
   * Explanation of terms
   *
   * Listener elements can be registered
   * by adding custom data attributes, e.g.
   * <a href="#section-1" data-scroll-reaction>...</a>
   *
   * Emitter elements are linked to listener elements
   * Usually the href attribute of a listener element should
   * match the id of the emitter element, e.g.
   * <section id="section-1">...</section>
   *
   * Scroll-Reaction.js works well with links,
   * but it can handle any kind of HTML element
   * If there is no href attribute, you have to assign
   * a value to the data attribute, e.g.
   * <h1 data-scroll-reaction="section-1">...</h1>
   */

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
  attribute: "data-scroll-reaction",

  /**
   * This attribute will be added to listener elements,
   * if the user reaches an emitter element
   * If you pass an empty string or explicity set it to false,
   * no attribute will be added
   * It’s entirely up to you to add styling
   * Example: a[data-scroll-active] { ... }
   * @type {String}
   */
  attributeCurrent: "data-scroll-active",

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
  offsetFrom: "",

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
  smoothScroll: "auto",

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
});
```

You can create as many instances as you like, even with (very) different configurations.

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

/**
 * Call this function on every update
 * This includes: scroll, resize and orientation change
 * In most cases, you don't need to register
 * your own event listeners for these events
 * Scroll-Reaction.js uses custom event listeners
 * with performance optimizations
 */
reaction.on("update", function() {
  // Available variables (see above)
  // this.position
  // this.status
});

/**
 * Call this function whenever the user clicks on a link
 * with a Scroll-Reaction.js data attribute (see config)
 * If smoothScroll is explicity set to false,
 * Scroll-Reaction.js won't add event listeners to links
 * In that case you should register your own event listeners
 */
reaction.on("click", function() {
  // Available variables (see above)
  // this.position
  // this.status
});

// If you add, reorder or delete emitter or listener elements,
// you should refresh the cache
reaction.refresh();

// If you add elements or change their height,
// you should update the position and the status
// Otherwise they will update when the next scroll event occurs
reaction.update();

// You want the browser to scroll to a specific element?
// Just pass the ID as an argument
reaction.scrollTo("my-id");

// Scroll to top
reaction.scrollTo();
```

# Help and browser support

Be sure to have a look at the [examples](https://github.com/tpmatthes/scroll-reaction/tree/master/examples) to learn
more about _Scroll-Reaction.js_.

If you run into trouble, feel free to post your questions in the
[issues section](https://github.com/tpmatthes/scroll-reaction/issues).

_Scroll-Reaction.js_ supports all modern browsers (requires [ES5](http://caniuse.com/#feat=es5)). It doesn’t rely on ES6 features, so it should support a fair amount of older browsers as well – even Internet Explorer 9+.

Most modern browsers still [don’t support scroll behavior](https://developer.mozilla.org/de/docs/Web/CSS/scroll-behavior) for native smooth scrolling. The default version of _Scroll-Reaction.js_ doesn’t include a polyfill. If you need a polyfill, you can use the file `scroll-reaction-with-polyfill.min.js`. Thanks to [this awesome project](https://github.com/iamdustan/smoothscroll)!

# License

_Scroll-Reaction.js_ is licensed under the [MIT license](https://github.com/tpmatthes/scroll-reaction/blob/master/LICENSE.md).

Attribution is not required, but always appreciated. Building great things? Show me! :)

Copyright &copy; Tim-Patrick Matthes
