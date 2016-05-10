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

test('partial_a is imported by a and c', function (t) {

  let sass_dir = path.join(__dirname, 'scss/');
  let piped_files = [];

  function* run() {

    var file_path;

    file_path = yield;
    t.notEqual(file_path.indexOf('a.scss'), -1, "a.scss added");

    file_path = yield;
    t.notEqual(file_path.indexOf('c.scss'), -1, "c.scss added");

    t.end();
  }

  let gen = run();
  gen.next();

  gulp.src(path.join(sass_dir, '_partial_a.scss'))
      .pipe(partials(sass_dir))
      // .pipe(logpipe())
      .pipe(through.obj(function (file, enc, cb) {

        gen.next(file.path);

        cb(null, file);

      }));

});

test('partial_c is imported by b and c', function (t) {

  let sass_dir = path.join(__dirname, 'scss/');
  let piped_files = [];

  function* run() {

    var file_path;

    file_path = yield;
    t.notEqual(file_path.indexOf('_partial_b.scss'), -1, "_partial_b.scss added");

    file_path = yield;
    t.notEqual(file_path.indexOf('a.scss'), -1, "a.scss added");

    file_path = yield;
    t.notEqual(file_path.indexOf('b.scss'), -1, "b.scss added");

    file_path = yield;
    t.notEqual(file_path.indexOf('c.scss'), -1, "c.scss added");

    t.end();
  }

  let gen = run();
  gen.next();

  gulp.src(path.join(sass_dir, '_partial_c.scss'))
      .pipe(partials(sass_dir))
      .pipe(logpipe())
      .pipe(through.obj(function (file, enc, cb) {

        gen.next(file.path);

        cb(null, file);

      }));

});
