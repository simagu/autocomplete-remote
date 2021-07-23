const gulp = require('gulp');
const serve = require('gulp-serve');

gulp.task('default', serve({
    root: ['client'],
    port: 3001
}));