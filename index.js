'use strict';

const
    sassGraph = require('sass-graph'),
    through = require('through2'),
    vinylFile = require('vinyl-file'),
    isWin = /^win/.test(process.platform);

const path = require('path');

function sass_partials_imported(scss_dir) {

  scss_dir = scss_dir || './';

    let graph = sassGraph.parseDir(scss_dir, { loadPaths: [scss_dir] }),
        processedFiles = [];

    return through.obj(function (file, enc, cb) {

        let file_path = file.path,
            files_to_sass = checkFiles(file_path, scss_dir, graph),
            files = createVinylFileArray(files_to_sass, scss_dir);
        if (files_to_sass.length > 0) {

            files.forEach( f => {

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

  let files_to_sass = [],
      file_path = isWin ? file.replace(/\//g, '\\') : file;

  files_to_sass = getSassFileToUpdate(file_path, graph);
  files_to_sass.sort();
  return files_to_sass;

}

function getSassFileToUpdate(file_path, graph, files) {

  files = files || [];

  try {

    if (!isPartial(file_path)) {
        if (files.indexOf(file_path) === -1) {
            files.push(file_path);
        }
    }

    if (graph.index[file_path].importedBy.length > 0) {
      // console.log("Parse", graph.index[file_path].importedBy);

      graph.index[file_path].importedBy.forEach(function (file_path) {
        getSassFileToUpdate(file_path, graph, files);
      });

      return files;

    }

    return files;

  } catch(e) {
    return [];
  }

}

function isPartial(file_path) {
    return path.basename(file_path).indexOf('_') === 0;
}

function createVinylFileArray(files, base) {

    let filesArray = [];

    files.forEach( value => {

        let f = vinylFile.readSync(value, {
            base: base
        });

        filesArray.push(f);

    });

    return filesArray;

}

module.exports = sass_partials_imported;
