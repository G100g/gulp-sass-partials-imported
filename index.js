'use strict';

const
    sassGraph = require('sass-graph'),
    through = require('through2'),
    vinylFile = require('vinyl-file');

function sass_partials_imported(scss_dir) {

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

    let isWin = /^win/.test(process.platform),
        files_to_sass = [],
        file_path = isWin ? file.replace(/\//g, '\\') : file_path;

    files_to_sass = getSassFileToUpdate(file_path);

    return files_to_sass;

}

function getSassFileToUpdate(file_path) {

    try {

        return graph.index[file_path].importedBy;

    } catch(e) {

        return [];

    }

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
