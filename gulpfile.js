'use strict';

var gulp            = require('gulp'),
    browserSync     = require('browser-sync').create(),
    jade            = require('gulp-jade'),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    browserify      = require('gulp-browserify'),
    spritesmith     = require('gulp.spritesmith'),
    rename          = require('gulp-rename'),
    eslint          = require('gulp-eslint'),
    autoprefixer    = require('autoprefixer'),
    postcss         = require('gulp-postcss'),
    notify          = require("gulp-notify"),
    rename          = require("gulp-rename"),
    csso            = require('gulp-csso'),
    del             = require('del'),
    uglify          = require('gulp-uglify'),
    sassGlob        = require('gulp-sass-glob'),
    merge           = require('merge-stream'),

    path = {
      html: 'app/*.html',
      css:  'app/**/*.css',
      js: 'app/js/**/*.js',
      jade: 'app/markups/**/*.jade',
      jadeSrc: 'app/markups/*.jade',
      jadeDest: 'app/',
      scss: 'app/scss/**/*.scss',
      sassSrc: 'app/scss/main.scss',
      sassDest: 'app/css/',
      browserifySrc: './app/js/entry.js',
      browserifyDest:'./app/js/',
      sprite: {
        spritesSrc: 'app/img/icons/*.png',
        spriteImgDest: './app/img/',
        spriteStylesDest: './app/scss/_layout/' 
      },
      build: {
        cssoSrc: 'build/css/main.css',
        compressedSrc: './app/js/bundle.js',
        compressedJS: 'build/js/'
      }
    };

// =============================================
// === JADE
// =============================================
gulp.task('jade', function() {
  var YOUR_LOCALS = {};
 
  gulp.src(path.jadeSrc)
      .pipe(jade({
        locals: YOUR_LOCALS,
        pretty: '\t'
      })).on('error', notify.onError()).on('change', browserSync.reload)
      .pipe(gulp.dest(path.jadeDest));
});

// =============================================
// === Sass
// =============================================
gulp.task('sass', function() {
  gulp.src(path.sassSrc)
      .pipe(sourcemaps.init())
      .pipe(sassGlob())
      .pipe(sass()).on('error', notify.onError())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.sassDest))
      .pipe(browserSync.stream());
});

// =============================================
// === Sprites
// =============================================
gulp.task('sprites', function() {
  var spriteData =
      gulp.src(path.sprite.spritesSrc)
          .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            algorithm: 'binary-tree',
            imgPath: '../../img/sprite.png', // path in mixins
            cssOpts: {functions: false},
            padding: 20
          }));
  spriteData.img.pipe(gulp.dest(path.sprite.spriteImgDest)); // path where to save the sprite-img
  spriteData.css.pipe(gulp.dest(path.sprite.spriteStylesDest)); // path where to save the styles
});

// =============================================
// === Eslint
// =============================================
gulp.task('lint', function() {
    
    return gulp.src(['**/*.js','!node_modules/**'])
        .pipe(eslint()) 
        .pipe(eslint.format()) 
        .pipe(eslint.failAfterError());
});

// =============================================
// === Autoprefixer
// =============================================
gulp.task('autoprefixer', function () { 
    return gulp.src('./app/css/main.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({ browsers: ['last 3 version', '> 1%', 'ie 8', 'ie 9', 'Opera 12.1'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'));
});

// =============================================
// === CSSO
// =============================================
gulp.task('minifyCss', function() {
  return gulp.src(path.build.cssoSrc)
      .pipe(csso({
          restructure: false,
          sourceMap: true,
          debug: true
      }))
      .pipe(rename({suffix: ".min"}))
      .pipe(gulp.dest('./build/css/'));
});

// =============================================
// === Clean files that are not minified
// =============================================
gulp.task('clean', function () {
  return del([
    './build/css/main.css',
    '!./build/js/bundle.min.js',
    '!./build/css/main.min.css'
  ]);
});

// =============================================
// === Browserify JS
// =============================================
gulp.task('scripts', function() {
  gulp.src(path.browserifySrc)

      .pipe(browserify({
        debug : true // Maps
      })).on('error', notify.onError())
      .pipe(rename('bundle.js'))
      .pipe(gulp.dest(path.browserifyDest));
});

// =============================================
// === Compress JS
// =============================================
gulp.task('js:compress', function() {
  return gulp.src(path.build.compressedSrc)
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest(path.build.compressedJS));
});

// =============================================
// === Replacing files for build
// =============================================
gulp.task('replaceFiles', function() {
  var imgs = gulp.src('app/img/*.*').pipe(gulp.dest('build/img/'));
  var bower = gulp.src('app/bower/**/*.*').pipe(gulp.dest('build/bower'));

  return merge(imgs, bower);
});

// =============================================
// === Static Server
// =============================================
gulp.task('serve', function() {

  browserSync.init({
    port: 9000,
    server: "app/"
  });

  browserSync.watch(['./app/**/*.js', './app/**/*.html', '!**/*.scss'], browserSync.reload);
});

// =============================================
// === Watching
// =============================================
gulp.task('watch', function() {
  gulp.watch(path.jade, gulp.series('jade'));
  gulp.watch(path.scss, gulp.series('sass'));
  gulp.watch(path.spritesSrc, gulp.series('sprites'));
  gulp.watch(path.js, gulp.series('scripts', 'lint'));
});

// =============================================
// === Default
// =============================================
gulp.task('default', gulp.parallel('serve', 'watch'));




// =============================================
// === Build (for production)
// =============================================
gulp.task('build', gulp.series('replaceFiles', 'autoprefixer', 'minifyCss', 'js:compress', 'clean'));

