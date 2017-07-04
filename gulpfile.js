/**
 * Created by mirko on 30.05.17.
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');


// javascript task
gulp.task('scripts', function() {
    return gulp.src('./app/js/*.js')
        .pipe(concat('application.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

// minify css task
gulp.task('minify-css', function() {
    return gulp.src('./app/css/*.css')
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./dist/'));
});

// watch task
gulp.task('watch', function () {
    gulp.watch('./app/js/*.css', ['minify-css']);
    gulp.watch('./app/css/*.js', ['scripts']);
});

// default task
gulp.task('default', ['scripts', 'minify-css']);