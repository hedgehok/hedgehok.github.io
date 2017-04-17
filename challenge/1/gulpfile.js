var gulp = require('gulp');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var watcher = require('gulp-watch');

gulp.task('sass', function () {
    gulp.src(['*.scss', '!_*.scss'], {cwd: './sass/'})
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                'ie >= 8',
                'ff >= 29',
                'Opera >= 12',
                'iOS >= 6',
                'Chrome >= 28',
                'Android >= 2'
            ],
            cascade: true,
            remove: false
        }))
        .pipe(gulp.dest('./css/'));
});

gulp.task('watch', function() {
    watcher(['./sass/**/*.scss'], function () {
        gulp.start('sass');
    });
});

gulp.task('default', function() {
    return runSequence(
        ['sass','watch']
    );
});