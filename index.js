'use strict';

var  _ = require('lodash'),
    sassGraph = require('sass-graph'),
    through = require('through2');
    // gutil = require('gulp-util');

const vinylFile = require('vinyl-file');

function sass_cache(includePaths) {

  let graph = sassGraph.parseDir(includePaths, {
                                  loadPaths: [includePaths]
                                });

  let processedFiles = [];

  return through.obj(function (file, enc, cb) {

    let file_path = file.path;

    let files_to_sass = checkFiles(file_path, includePaths, graph);

    let files = createVinylFileArray(files_to_sass, includePaths)

    if (files_to_sass.length > 0) {

      _.each(files, f => {

        if (processedFiles.indexOf(f.path) === -1) {
          this.push(f);
          processedFiles.push(f.path);
        }

      });

    }

    cb();

  });

}

function checkFiles(file, project_path, graph) {

  var files_to_sass = [];

  let file_path = file.replace(/\//g, '\\');

  files_to_sass = getSassFileToUpdate(file_path, project_path, graph);

  return files_to_sass;

}

function getSassFileToUpdate(file_path, project_path, graph) {

  // let files_to_update = [];

  // Find whick file imports the partial file

  // _.each(graph.index, function (value, key) {
  //
  //   let pos = value.imports.indexOf(file_path);
  //   // console.log(file_path, value.imports);
  //   if( pos !== -1) {
  //     files_to_update.push(key);
  //   }
  //
  // });
  //
  // return files_to_update;

  try {

    return graph.index[file_path].importedBy;

  } catch(e) {
    return [];
  }

}

function createVinylFileArray(files, base) {

  let  filesArray = [];

  _.each(files, function (value) {

    let f = vinylFile.readSync(value, {
      base: base
    });

    filesArray.push(f);

  });

  return filesArray;

}

module.exports = sass_cache;
