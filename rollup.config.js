import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify-es';
import license from 'rollup-plugin-license';

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/scroll-reaction.js',
		name: 'ScrollReaction',
		format: 'umd'
	},
	plugins: [
		nodeResolve(),
		commonjs(),
		uglify(),
		license({
			banner: `
				<%= pkg.name %> <%= pkg.version %> by <%= pkg.author.name %>
				<%= pkg.description %>
				Learn more: <%= pkg.homepage %>
				License: <%= pkg.license %>
			`
		})
	]
};
