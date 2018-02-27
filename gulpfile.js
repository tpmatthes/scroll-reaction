/*
 * Build Script for scroll-reaction.js
 */

var gulp = require('gulp');
// gulp-minify to minify JavaScript
var minify = require('gulp-minify');
// gulp-concat to combine files
var concat = require('gulp-concat');
// gulp-replace to replace strings in files
var replace = require('gulp-replace');

// Create dist/scroll-reaction.min.js
gulp.task('build', function() {
	return gulp
		.src('src/*.js')
		.pipe(
			minify({
				ext: { src: '.js', min: '.min.js' }, // File extensions
				mangle: true, // Shorten variable names
				preserveComments: 'some' // Preserve comments like /*! */
			})
		)
		.pipe(gulp.dest('dist'));
});

// The command 'gulp' creates dist/scroll-reaction.min.js first
// Afterwards it will create a version including a scroll behavior polyfill
gulp.task('default', ['build'], function() {
	return (gulp
			// Get polyfill and minifed JavaScript code
			.src(['node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js', 'dist/scroll-reaction.min.js'])
			// Set smoothScroll config option to true, because Scroll-Reaction.js can't detect polyfills
			.pipe(replace('smoothScroll:"auto"', 'smoothScroll:true'))
			// Combine files
			.pipe(concat('scroll-reaction-with-polyfill.min.js'))
			.pipe(gulp.dest('dist')) );
});
