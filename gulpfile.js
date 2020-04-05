const gulp = require("gulp");
const babel = require("gulp-babel");
const minify = require("gulp-babel-minify");
const cssminify = require("gulp-cssmin");
const concat = require("gulp-concat");

gulp.task("minifyCss", () => {
  return gulp
  .src("public/assets/css/styles.css")
  .pipe(cssminify())
  .pipe(concat("bundle.css"))
  .pipe(gulp.dest("public/assets/css/"))
})

gulp.task("minifyJs", () => {
  return gulp
    .src("src/app.js")
    .pipe(babel())
    .pipe(
      minify({
        mangle: {
          keepClassName: true,
        },
      })
    )
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest("src/"));
});
