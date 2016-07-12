'use strict';

const gulp = require('gulp')
  , babel = require('gulp-babel')
  , rename = require('gulp-rename');

gulp.task('default', () => {
  return gulp.src('console-factory.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(rename("index.js"))
    .pipe(gulp.dest('./'));
});