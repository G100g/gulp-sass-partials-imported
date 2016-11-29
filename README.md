# gulp-sass-partials-imported [![Build Status](https://travis-ci.org/G100g/gulp-sass-partials-imported.svg?branch=master)](https://travis-ci.org/G100g/gulp-sass-partials-imported)

>It process scss partials files and add the files that import them to the pipe.

Use it with gulp-cached and gulp-sass to create a watch task that avoid the re-compile of all the scss files in the project everytime you save one of them, saving a lot of time.

## Install

```
$ npm install --save-dev gulp-sass-partials-imported
```

## Usage

In the example below we have a `watch` task that, everytime we save a partial file, adds to the pipe files that import the partial file.

```js
const gulp = require('gulp'),
const sass = require('gulp-sass');
const cached = require('gulp-cached');
const sassPartialsImported = require('gulp-sass-partials-imported');

let scss_dir = 'src/scss/';

gulp.task('sass', () => {
	gulp.src('src/*.scss')
		.pipe(cached('sassfiles'))
		.pipe(sassPartialsImported(scss_dir))
		.pipe(sass({ includePaths: scss_dir }).on('error', sass.logError))
		.pipe(gulp.dest('dist'));
});


gulp.task('watch', function () {

    gulp.watch('src/*.scss', ['sass'])

});

```

## License

MIT ©
G100g(http://g100g.net)
Davide Cantelli (http://ww.davidecantelli.it)
