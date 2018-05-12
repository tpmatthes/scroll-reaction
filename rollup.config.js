// Import Rollup plugins
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify-es';
import license from 'rollup-plugin-license';

/**
 * Creates a copyright banner for our bundles
 * @param {Boolean} polyfill Does the bundle include a polyfill?
 */
function banner(polyfill = false) {
	// Default banner
	let text = `
		<%= pkg.name %> <%= pkg.version %> by <%= pkg.author.name %>
		<%= pkg.description %>
		Learn more: <%= pkg.homepage %>
		License: <%= pkg.license %>
	`;
	// Polyfill included?
	if (polyfill) {
		text += `
			Bundled with smooth scroll polyfill:
			https://github.com/iamdustan/smoothscroll
		`;
	}
	return { banner: text };
}

// Rollup exports multiple bundles
export default [
	// ES6 Module bundle for modern web apps
	{
		input: 'src/scroll-reaction.js',
		output: {
			file: 'dist/scroll-reaction.es.js',
			name: 'ScrollReaction',
			format: 'es'
		},
		plugins: [license(banner())]
	},
	// Unmnified UMD bundle for Node.js and build tools
	{
		input: 'src/scroll-reaction.js',
		output: {
			file: 'dist/scroll-reaction.js',
			name: 'ScrollReaction',
			format: 'umd'
		},
		plugins: [nodeResolve(), commonjs(), license(banner())]
	},
	// Minified UMD bundle for modern browsers
	{
		input: 'src/scroll-reaction.js',
		output: {
			file: 'dist/scroll-reaction.min.js',
			name: 'ScrollReaction',
			format: 'umd'
		},
		plugins: [nodeResolve(), commonjs(), uglify(), license(banner())]
	},
	// Minified UMD bundle with smooth scroll polyfill for browsers
	{
		input: 'src/scroll-reaction-with-polyfill.js',
		output: {
			file: 'dist/scroll-reaction-with-polyfill.min.js',
			name: 'ScrollReaction',
			format: 'umd'
		},
		plugins: [nodeResolve(), commonjs(), uglify(), license(banner(true))]
	}
];
