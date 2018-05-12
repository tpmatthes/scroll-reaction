// Import and run the smooth scroll polyfill
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

// Import the default config
import defaultConfig from './default-config.js';
// Explicity set smoothScroll to true
// The smooth scroll polyfill can't be auto detected
defaultConfig.smoothScroll = true;

// Import helper and main functions
import defer from './defer.js';
import ScrollReaction from './scroll-reaction';

// Export the default constructor function
export default ScrollReaction;
