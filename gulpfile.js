'use strict';

const gulp          = require('gulp'),
      browserSync   = require('browser-sync').create(),
      pug           = require('gulp-pug'),
      sass          = require('gulp-sass'),
      sourcemaps    = require('gulp-sourcemaps'),
      spritesmith   = require('gulp.spritesmith'),
      rename        = require('gulp-rename'),
      eslint        = require('gulp-eslint'),
      autoprefixer  = require('autoprefixer'),
      postcss       = require('gulp-postcss'),
      notify        = require("gulp-notify"),
      csso          = require('gulp-csso'),
      uglify        = require('gulp-uglify'),
      sassGlob      = require('gulp-sass-glob'),
      merge         = require('merge-stream'),
      babel         = require("gulp-babel"),
      concat        = require('gulp-concat'),

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
        php:'app/php/**/*.php',
        sprite: {
          spritesSrc: 'app/img/icons/*.png',
          spriteImgDest: './build/img/',
          spriteStylesDest: './app/scss/_layout/'
        }
      };

// =============================================
// === Pug
// =============================================
gulp.task('pug', function() {
  let YOUR_LOCALS = {};
 
  return gulp.src(path.pugSrc)
      .pipe(pug({
        locals: YOUR_LOCALS,
        pretty: '\t'
      })).on('error', notify.onError()).on('change', browserSync.reload)
      .pipe(gulp.dest(path.pugDest));
});

// =============================================
// === Sass
// =============================================
gulp.task('sass', function() {
  return gulp.src(path.sassSrc)
      .pipe(sourcemaps.init())
      .pipe(sassGlob())
      .pipe(sass()).on('error', notify.onError())
      .pipe(postcss([ autoprefixer({ browsers: ['last 3 version', '> 1%', 'ie 8', 'ie 9', 'Opera 12.1'] }) ]))
      .pipe(csso({
          restructure: false,
          sourceMap: false,
          debug: true
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.sassDest))
      .pipe(browserSync.stream());
});

// =============================================
// === Sprites
// =============================================
gulp.task('sprites', function() {
  let spriteData =
      gulp.src(path.sprite.spritesSrc)
          .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            algorithm: 'binary-tree',
            imgPath: '../../img/sprite.png', // path in mixins
            cssOpts: {functions: false},
            padding: 20
          }));
  let imgDest = spriteData.img.pipe(gulp.dest(path.sprite.spriteImgDest)); // path where to save the sprite-img
  let cssDest = spriteData.css.pipe(rename({prefix: "_"}))
                .pipe(gulp.dest(path.sprite.spriteStylesDest)); // path where to save the styles
  return merge(imgDest, cssDest);
});

// =============================================
// === Eslint
// =============================================
gulp.task('lint', function() {
    
    return gulp.src(['./js/**/*.js','!node_modules/**'])
        .pipe(eslint()) 
        .pipe(eslint.format()) 
        .pipe(eslint.failAfterError());
});

// =============================================
// === JS
// =============================================
gulp.task('script', function() {

  return gulp.src(path.jsSrc)
          .pipe(sourcemaps.init())
          .pipe(concat('bundle.js'))
          .pipe(babel({
            presets: ['es2015']
          }))
          .pipe(uglify())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(path.jsDest))
          .on('error', notify.onError());
});


// =============================================
// === Replacing files for build
// =============================================
gulp.task('replaceFiles', function() {
  let imgs = gulp.src('app/img/*.*', {since: gulp.lastRun('replaceFiles')}).pipe(gulp.dest('build/img/')),
      fonts = gulp.src('app/fonts/*.*', {since: gulp.lastRun('replaceFiles')}).pipe(gulp.dest('build/fonts/')),
      fav = gulp.src('app/favicon.ico/*.*', {since: gulp.lastRun('replaceFiles')}).pipe(gulp.dest('build/favicon.ico/')),
      php = gulp.src('app/php/*.*', {since: gulp.lastRun('replaceFiles')}).pipe(gulp.dest('build/php/'));

  return merge(imgs, fonts, fav, php);
});

// =============================================
// === Static Server
// =============================================
gulp.task('serve', function() {

  browserSync.init({
    port: 9001,
    server: "build/"
  });

  browserSync.watch(['./build/js/bundle.js', './build/**/*.html', '!**/*.scss', './app/img/icons/'], browserSync.reload);
});

// =============================================
// === Watching
// =============================================
gulp.task('watch', function() {
  gulp.watch(path.pug, gulp.series('pug'));
  gulp.watch(path.sassSrc, gulp.series('sass'));
  gulp.watch(path.jsSrc, gulp.series('script', 'lint'));
  gulp.watch(path.sprite.spritesSrc, gulp.parallel('sprites'));
  gulp.watch(path.php, gulp.series('replaceFiles'));
});

// =============================================
// === Default
// =============================================
gulp.task('default', gulp.series('pug', 'sass', 'script', 'sprites', 'replaceFiles', gulp.parallel('watch', 'serve')));

