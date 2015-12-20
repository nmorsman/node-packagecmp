var fs = require('fs');
var path = require('path');
var async = require('async');
var semver = require('semver');


function findRootDeps(root, callback) {
    var rootPath = path.join(root, 'package.json');

    fs.exists(rootPath, function(exists) {
        if (!exists)
            return callback('Could not find package: ' + rootPath);

        var rootPackage = require(rootPath);
        callback(null, (rootPackage.dependencies || {}));
    });
}

function checkDep(root, name, wanted, callback) {
    var depPath = path.join(root, 'node_modules', name, 'package.json');

    fs.exists(depPath, function(exists) {
        if (!exists) {
            return callback(null, {
                wanted: wanted,
                current: null,
                satisfies: false
            });
        }

        var depPackage = require(depPath);

        callback(null, {
            wanted: wanted,
            current: depPackage.version,
            satisfies: semver.satisfies(depPackage.version, wanted)
        });
    });
}


module.exports = function(root, callback) {
    findRootDeps(root, function(err, dependencies) {
        if (err) return callback(err);

        var jobs = {};

        for (var name in dependencies)
            jobs[name] = async.apply(checkDep, root, name, dependencies[name]);

        async.parallel(jobs, callback);
    });
};
