const gulp = require('gulp');



gulp.task('build:lib', (cb) => {
  const exec = require('child_process').exec;
  exec('ng build ngx-list', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})
