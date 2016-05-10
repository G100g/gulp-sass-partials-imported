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

test('partial_c is imported by a, b and c', function (t) {

  let sass_dir = path.join(__dirname, 'scss/');
  let piped_files = [];

  function* run() {

    var file_path;

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
      // .pipe(logpipe())
      .pipe(through.obj(function (file, enc, cb) {

        gen.next(file.path);

        cb(null, file);

      }));

});

test('partial_b is not imported by a', function (t) {

  let sass_dir = path.join(__dirname, 'scss/');
  let piped_files = [];

  let files = [];

  gulp.src(path.join(sass_dir, '_partial_b.scss'))
      .pipe(partials(sass_dir))
      // .pipe(logpipe())
      // .pipe(through.obj(function (file, enc, cb) {
      //
      //   let r = gen.next(file.path);
      //
      //   console.log(enc);
      //
      //   if (r.done) {
      //     t.end();
      //   }
      //   cb(null, file);
      //
      // }))
      .on('data', function (data) {
        files.push(data.path)
      })
      .on('end', function () {

        t.equal(files.length, 2, "Only two files");

        t.equal(files.indexOf('a.scsss'), -1, "a file not present");
        t.equal(files.indexOf('b.scsss'), -1, "b file present");
        t.equal(files.indexOf('c.scsss'), -1, "c file present");
        // files.forEach(function (file) {
        //   console.log()
        //
        // });

        t.end();

      });

});
