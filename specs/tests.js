'use strict';

var path = require('path'),
    test = require('tape'),
    gulp = require('gulp'),
    through = require('through2'),
    partials = require('../');

function logpipe() {
  return through.obj(function (file, enc, cb) {

    console.dir('LOG: ' + file.path);

    cb(null, file);
  })
}


test('partial_b is not imported by a', function (t) {

  let sass_dir = path.join(__dirname, 'scss/');
  let piped_files = [];

  let files = [];

  gulp.src(path.join(sass_dir, '_partial_b.scss'))
      .pipe(partials(sass_dir))
      .on('data', function (data) {
        files.push(data.path)
      })
      .on('end', function () {

        t.equal(files.length, 2, "Only two files");
        t.equal(files.indexOf(path.join(sass_dir, 'a.scss')), -1, "a file not present");
        t.notEqual(files.indexOf(path.join(sass_dir, 'b.scss')), -1, "b file present");
        t.notEqual(files.indexOf(path.join(sass_dir, 'c.scss')), -1, "c file present");

        t.end();

      });

});

test('partial_c is imported by a, b and c', function (t) {

  let sass_dir = path.join(__dirname, 'scss/');
  let piped_files = [];

  let files = [];

  gulp.src(path.join(sass_dir, '_partial_c.scss'))
      .pipe(partials(sass_dir))
      .on('data', function (data) {
        files.push(data.path)
      })
      .on('end', function () {

        t.equal(files.length, 3, "Only three files");
        t.notEqual(files.indexOf(path.join(sass_dir, 'a.scss')), -1, "a file present");
        t.notEqual(files.indexOf(path.join(sass_dir, 'b.scss')), -1, "b file present");
        t.notEqual(files.indexOf(path.join(sass_dir, 'c.scss')), -1, "c file present");

        t.end();

      });

});


test('partial_a is imported by a and c', function (t) {

  let sass_dir = path.join(__dirname, 'scss/');
  let piped_files = [];

  let files = [];

  gulp.src(path.join(sass_dir, '_partial_a.scss'))
      .pipe(partials(sass_dir))
      .on('data', function (data) {
        files.push(data.path)
      })
      .on('end', function () {

        t.equal(files.length, 2, "Only two files");
        t.notEqual(files.indexOf(path.join(sass_dir, 'a.scss')), -1, "a file present");
        t.equal(files.indexOf(path.join(sass_dir, 'b.scss')), -1, "b file not present");
        t.notEqual(files.indexOf(path.join(sass_dir, 'c.scss')), -1, "c file present");

        t.end();

      });

});
