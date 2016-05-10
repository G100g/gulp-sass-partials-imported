#

# gulp-sass-partials-imported

> Add SCSS files that import the file you are saving to the Gulp pipe.

Use it with gulp-cached and gulp-sass to create a gulp watcher that avoid the re-compile of all the scss files in the project everytime you save one of them, saving a lot of time.

## Install
======

```
$ npm install --save-dev gulp-sass-partials-imported
```

## Usage
======

In the example below we have a `watch` that everytime we save a file, compiles only that file and, if it's a partial .scss, also .scss that imported its.

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

MIT © G100g(http://g100g.net)
