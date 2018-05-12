import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify-es';
import license from 'rollup-plugin-license';

const licenseOptions = {
	banner: `
		<%= pkg.name %> <%= pkg.version %> by <%= pkg.author.name %>
		<%= pkg.description %>
		Learn more: <%= pkg.homepage %>
		License: <%= pkg.license %>
	`
};

export default [
	// Unmnified UMD bundle (Node.js and browser)
	{
		input: 'src/main.js',
		output: {
			file: 'dist/scroll-reaction.js',
			name: 'ScrollReaction',
			format: 'umd'
		},
		plugins: [nodeResolve(), commonjs(), license(licenseOptions)]
	},
	// Minified UMD bundle (browser, optimizied file size)
	{
		input: 'src/main.js',
		output: {
			file: 'dist/scroll-reaction.min.js',
			name: 'ScrollReaction',
			format: 'umd'
		},
		plugins: [nodeResolve(), commonjs(), uglify(), license(licenseOptions)]
	},
	// ES6 Module bundle for modern web apps
	{
		input: 'src/main.js',
		output: {
			file: 'dist/scroll-reaction.es.js',
			name: 'ScrollReaction',
			format: 'es'
		},
		plugins: [license(licenseOptions)]
	}
];
