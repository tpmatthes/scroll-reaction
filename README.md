# Scroll-Reaction.js
### Performant, dependency free and fully customizable scroll effects

Let’s face it: We develop a lot of single page websites these days. Most of them need some sort of navigation, where the current section is highlighted.

It can be a tedious task: It involves listening to scroll and resize events, updating class names and thinking about edge cases (e.g. unreachable sections). And did I mention the perfomance issues of an un-throttled callback function? 

You probably don’t want to think about that, but you don’t want to pull in a huge library either.

Introducing Scroll-Reaction.js: a tiny JavaScript library for ridiculously easy scroll effects

**Some benefits:**
- very small file size (~ 1KB gzipped)
- optimized for performance
- dependency free
- fully customizable

# Get up and running
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

We want to add a navigation with the link to the current section highlighted. For that purpose we add some markup with Scroll-Reaction-spefic data attributes:
``` html
<nav>
	<!-- The value of the data attribute should match the id of the element we want to target -->
	<a href="#section-1" data-scroll-reaction="section-1">Section 1</a>
	<a href="#section-2" data-scroll-reaction="section-2">Section 2</a>
	<a href="#section-3" data-scroll-reaction="section-3">Section 3</a>
</nav>
```

We’re almost there! We only have to include Scroll-Magic.js an initialize it:
``` html
<script src="scroll-reaction.js"></script>
<script>
	var scrollEffects = new ScrollReaction();
	scrollEffects.init();
</script>
```

Done!

Now, if a user scrolls to one of our sections, the corresponding anchor tag receives a new class: `.is-active`

If the user scrolls past one of our sections, the class of the anchor tag changes to: `.was-active`

It’s entirely up to you to add styling to those classes, Scroll-Reaction.js only assigns them.

Be sure to have a look at the [examples](https://github.com/tpmatthes/scroll-reaction/tree/master/examples) to learn more about Scroll-Reaction.js

# Options (and default values)
``` js
var scrollEffects = new ScrollReaction({
	// This attribute is used to find listener elements
	// Add it to any element, e.g. <a data-scroll-reaction="section-1" ...>
	// The value should match the id of the emitter element, e.g. <section id="section-1" ...>
	attribute: 'data-scroll-reaction',
	// These classes will be added to all listener elements when the user scrolls to a linked emitter element
	// The first class will be added when the user reaches an emitter element
	// The second class will be added when the user has scrolled past an emitter element
	// If you pass an empty string for one of these class names, no class will be added
	classes: {
		isActive: 'is-active',
		wasActive: 'was-active',
	},
	// This function will be called when the user is scrolling or resizing the window
	// The vertical scroll position and the status (0-100%) will be passed to the callback function as arguments
	callback: null,
	// This offset will be subtracted from the vertical position of any emitter element
	// If your listener element should receive its class earlier (scrolling down), pass a higher value
	offset: 5,
	// If you enable this option, the base offset will be calculated from the height of an element
	// This option accepts any query selector, e.g. '#navigation' or 'nav'
	// The first element, which matches the given selector, will be used
	// If you use both offset options, the base offset will be added to this
	offsetFrom: null,
	// The update method will get called at a limited rate on scroll (by default 20 times per second)
	// However, the max rate can be changed, because it limits the FPS in a custom callback
	throttleDelay: 50,
	// The last emitter element may be "unreachable" on bigger screens
	// An emitter is only triggered when the user scrolls past it (- configured offset)
	// However, if the user scrolls to the bottom of the page, the last emitter will be activated automatically
	// If the listener element should receive its class earlier (scrolling down), pass a higher value
	// Any negative value (<0) will make the last emitter unreachable (do you really want that?)
	windowBottomOffset: 20,
});
```

# Help
Be sure to have a look at the [examples](https://github.com/tpmatthes/scroll-reaction/tree/master/examples) to learn more about Scroll-Magis.js

If you run into trouble, feel free to post your questions in the [issues section](https://github.com/tpmatthes/scroll-reaction/pulls).

# License
Scroll-Reaction.js is licensed under the [MIT license](https://github.com/tpmatthes/scroll-reaction/blob/master/LICENSE).

Copyright 2017 Tim-Patrick Matthes
