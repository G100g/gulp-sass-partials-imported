# 

# gulp-sass-partials-imported

> Filter partial scss files, adding theirs ancestors 


## Install

```
$ npm install --save-dev gulp-sass-partials-imported
```


## Usage

```js
const gulp = require('gulp');
const sassPartialsImported = require('gulp-sass-partials-imported');

gulp.task('sass', () => {
	gulp.src('src/*.scss')
		.pipe(sassPartialsImported())
		.pipe(gulp.dest('dist'))
);
```


## License

MIT © G100g(http://g100g.net)
