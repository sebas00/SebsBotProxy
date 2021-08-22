var gulp = require("gulp");
var gulp_tslint = require('gulp-tslint');
var del = require("del");
var ts = require("gulp-typescript");
var merge = require("merge2");
var tsProject = ts.createProject("tsconfig.json", {
    declaration: true
});

gulp.task('default', ['scripts']);

gulp.task("clean", () => {
  return del("dist/*.*");
});

gulp.task("scripts", () => {
  var tsResult = tsProject.src()
    .pipe(tsProject());

  return merge([tsResult.js.pipe(gulp.dest("dist")),
                tsResult.dts.pipe(gulp.dest("dist"))]);
});

gulp.task("watch", ["scripts"], () => {
  return gulp.watch('src/*.ts', ['scripts']);
});

gulp.task('tslint', () => {
    gulp.src(['src/*.ts'])
      .pipe(gulp_tslint({
          formatter: "prose"
      }))
      .pipe(gulp_tslint.report({
          emitError: false
      }));
});
