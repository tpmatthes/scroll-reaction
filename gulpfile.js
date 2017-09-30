/*
 * Build Script for scroll-reaction.js
 */

var gulp = require('gulp');
// gulp-minify to minify JavaScript
var minifyJS = require('gulp-minify');

// Minify all JavaScript files
gulp.task('buildJS', function() {
	return gulp.src('src/*.js')
		.pipe(minifyJS({
			ext: {src: '.js', min: '.min.js'}, // File extensions
			noSource: true, // Don't copy the unminified source code
			mangle: true, // Shorten variable names
			preserveComments: 'some' // Preserve comments like /*! */
		}))
		.pipe(gulp.dest('build'));
});

// The command 'gulp' builds everything
gulp.task('default', ['buildJS']);
