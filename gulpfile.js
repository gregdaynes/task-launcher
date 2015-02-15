




// GULP ========================
// =============================

// load the plugins
var gulp       = require('gulp')
  , nodemon    = require('gulp-nodemon')
  , watch      = require('gulp-watch')
  , livereload = require('gulp-livereload')
  ;

// NODEMON ---------------------
gulp.task('nodemon', function() {
    nodemon({
        script: 'server.js',
        ext: 'js html'
    })

        .on('start', ['watch'])
        .on('change', ['watch'])
        .on('restart', function() {
            console.log('Restarted!');
        });
});

// JS --------------------------
gulp.task('js', function() {
    gulp.src('public/*.js')
        .pipe(livereload());
});

// HTML ------------------------
gulp.task('html', function() {
    gulp.src('public/*.html')
        .pipe(livereload());
});

// WATCH -----------------------
gulp.task('watch', function() {
    livereload.listen();

    gulp.watch(['server.js'], []);
    gulp.watch(['public/*.js'], ['js']);
    gulp.watch(['public/*.html'], ['html']);
});

// defining the main gulp task
gulp.task('default', ['nodemon']);