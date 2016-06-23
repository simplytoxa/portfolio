'use strict';

const gulp          = require('gulp'),
      browserSync   = require('browser-sync').create(),
      merge         = require('merge-stream'),
      del           = require('del'),
      $             = require('gulp-load-plugins')({
          lazy: true
      }),

    path = {
        html: 'app/*.html',
        css:  'app/**/*.css',
        jsSrc: 'app/js/*.js',
        jsDest:'build/js/',
        pug: 'app/markups/**/*.pug',
        pugSrc: 'app/markups/_pages/*.pug',
        pugDest: 'build/',
        sassSrc: 'app/scss/**/*.scss',
        sassDest: 'build/css/',
        sprite: {
            spritesSrc: 'app/img/icons/*.png',
            spriteImgDest: './build/img/',
            spriteStylesDest: './app/scss/_layout/'
        }
    };

// =============================================
// === Pug
// =============================================
gulp.task('pug', () => {
    let YOUR_LOCALS = {};

    return gulp.src(path.pugSrc)
        .pipe($.plumber({
            errorHandler: $.notify.onError((err) => {
                return {
                    title: 'Pug',
                    message: err.message
                };
            })
        }))
        .pipe($.pug({
            locals: YOUR_LOCALS,
            pretty: '\t'
        })).on('change', browserSync.reload)
        .pipe(gulp.dest(path.pugDest));
});

// =============================================
// === Sass
// =============================================
gulp.task('sass', () => {
    return gulp.src(path.sassSrc)
        .pipe($.plumber({
            errorHandler: $.notify.onError((err) => {
                return {
                    title: 'Styles',
                    message: err.message
                };
            })
        }))
        .pipe($.sourcemaps.init())
        .pipe($.sassGlob())
        .pipe($.sass())
        .pipe($.autoprefixer({
            browsers: ['last 3 version', '> 1%', 'ie 8', 'ie 9', 'Opera 12.1'],
            cascade: false
        }))
        .pipe($.csso({
            restructure: false,
            sourceMap: true
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.sassDest))
        .pipe(browserSync.stream());
});

// =============================================
// === Sprites
// =============================================
gulp.task('sprites', () => {
    let spriteData =
            gulp.src(path.sprite.spritesSrc, {since: gulp.lastRun('sprites')})
                .pipe($.spritesmith({
                    imgName: 'sprite.png',
                    cssName: 'sprite.scss',
                    algorithm: 'binary-tree',
                    imgPath: '../../img/sprite.png', // path in mixins
                    cssOpts: {functions: false},
                    padding: 20
                })),
        imgDest = spriteData.img.pipe(gulp.dest(path.sprite.spriteImgDest)), // path where to save the sprite-img
        cssDest = spriteData.css.pipe($.rename({prefix: "_"}))
            .pipe(gulp.dest(path.sprite.spriteStylesDest)); // path where to save the styles

    return merge(imgDest, cssDest);
});

// =============================================
// === Eslint
// =============================================
gulp.task('lint', () => {

    return gulp.src(['./js/**/*.js','!node_modules/**'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});

// =============================================
// === JS
// =============================================
gulp.task('script', () => {

    return gulp.src(path.jsSrc)
        .pipe($.plumber({
            errorHandler: $.notify.onError((err) => {
                return {
                    title: 'JAVASCRIPT',
                    message: err.message
                };
            })
        }))
        .pipe($.sourcemaps.init())
        .pipe($.concat('bundle.js'))
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.jsDest));
});


// =============================================
// === Replacing files for build
// =============================================
gulp.task('replaceFiles', () => {
    let imgs = gulp.src('app/img/*.*', {since: gulp.lastRun('replaceFiles')}).pipe(gulp.dest('build/img/')),
        fonts = gulp.src('app/fonts/*.*', {since: gulp.lastRun('replaceFiles')}).pipe(gulp.dest('build/fonts/')),
        fav = gulp.src('app/favicon.ico/*.*', {since: gulp.lastRun('replaceFiles')}).pipe(gulp.dest('build/favicon.ico/')),
        php = gulp.src('app/php/*.*').pipe(gulp.dest('build/php/'));

    return merge(imgs, fonts, fav, php);
});

// =============================================
// === Static Server
// =============================================
gulp.task('serve', () => {

    browserSync.init({
        port: 9001,
        server: "build/"
    });

    browserSync.watch(['./build/js/bundle.js', './build/**/*.html', '!**/*.scss', path.sprite.spriteImgDest], browserSync.reload);
});

// =============================================
// === Watching
// =============================================
gulp.task('watch', () => {
    gulp.watch(path.pug, gulp.series('pug'));
    gulp.watch(path.sassSrc, gulp.series('sass'));
    gulp.watch(path.jsSrc, gulp.series('script', 'lint'));
    gulp.watch(path.sprite.spritesSrc, gulp.series('sprites'));
});

// =============================================
// === Clean All Build Directory
// =============================================
gulp.task('clean', () => {
    return del(['./build/']);
});

// =============================================
// === Default
// =============================================
gulp.task('default', gulp.series('pug', 'sass', 'script', 'sprites', 'replaceFiles', gulp.parallel('watch', 'serve')));

