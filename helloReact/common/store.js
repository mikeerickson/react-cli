/* global exports */

var fs = require('fs');

// key为本地文件名，data为数据
var setToLocal = function (filepath, data, callback) {
    fs.writeFile(filepath, data, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};
exports.setToLocal = setToLocal;

// 初始化数据
var getFromLocal = function (filepath, callback) {
    fs.readFile(filepath, 'utf-8', function (err, filedata) {
        if (err) {
            return callback(err);
        }
        callback(null, filedata);
    });
};
exports.getFromLocal = getFromLocal;

// 初始化数据【同步版本】
var getFromLocalSync = function (filepath) {
    return fs.readFileSync(filepath, 'utf-8');
};
exports.getFromLocalSync = getFromLocalSync;