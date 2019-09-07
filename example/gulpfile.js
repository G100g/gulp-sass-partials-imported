const { src, dest, watch } = require("gulp");
const sass = require("gulp-sass");
const cached = require("gulp-cached");
const sassPartialsImported = require("../");

let scss_dir = "src/scss/";
let includePaths = [];

const sassTask = cb => {
    src("src/**/*.scss")
        .pipe(cached("sassfiles"))
        .pipe(sassPartialsImported(scss_dir, includePaths))
        .on("data", data => {
            console.log(data.path);
        })
        .pipe(sass({ includePaths: scss_dir }).on("error", sass.logError))
        .pipe(dest("dist"));

    cb();
};

watchTask = function() {
    watch(["src/**/*.scss"], sassTask);
};

exports.default = sassTask;
exports.watch = watchTask;
