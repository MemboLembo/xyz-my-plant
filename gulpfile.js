const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('server', function () {

  browserSync({
    server: {
      baseDir: "dist"
    }
  });

  gulp.watch("src/*.html").on('change', browserSync.reload);
  gulp.watch("src/assets/js/**/*.js").on('change', browserSync.reload);
});

gulp.task('styles', function () {
  return gulp.src("src/assets/sass/**/*.+(scss|sass)")
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }).on('error', console.error.bind(console)))
    .pipe(rename({
      suffix: '.min',
      prefix: ''
    }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream())
});

gulp.task('watch', function () {
  gulp.watch("src/assets/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
  gulp.watch("src/*.html").on('change', gulp.parallel('html'));
});

gulp.task('html', function () {
  return gulp.src("src/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("dist/"));
});

gulp.task('images', function () {
  return gulp.src("src/assets/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"));
});

gulp.task('css-vendors', function () {
    return gulp.src("src/assets/css-vendors/**/*")
      .pipe(gulp.dest("dist/css"))
      .pipe(browserSync.stream());
  });

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'html', 'images', 'css-vendors'));