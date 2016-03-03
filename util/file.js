/* global exports */

var fs = require('fs');

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } src 需要复制的目录
 * @param{ String } dst 复制到指定的目录
 */
var copy = function (src, dst, options) {
    // 判断文件是否存在
    existsSync(dst);
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function (path) {
            var _src = src + '/' + path;
            var _dst = dst + '/' + path;
            var readable, writable;
            fs.stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src, options);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst, options);
                    // 通过管道来传输流
                    readable.pipe(writable);
                    console.log('   \x1b[36mcreate\x1b[0m : ' + _dst);
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    copy(_src, _dst, options);
                }
            });
        });
    });
};

exports.copy = copy;

/**
 * 复制目录中的所有文件包括子目录
 * @param {type} src 需要复制的目录
 * @param {type} dst 复制到指定的目录
 * @returns {undefined}
 */
var copySync = function (src, dst, options) {
    // 判断文件是否存在
    existsSync(dst);
    // 读取目录中的所有文件/目录
    var fileArray = fs.readdirSync(src);
    fileArray.forEach(function (file) {
        var _src = src + '/' + file;
        var _dst = dst + '/' + file;
        var stat = fs.statSync(_src);
        // 判断是否为文件
        if (stat.isFile()) {
            fs.createReadStream(_src, options).pipe(fs.createWriteStream(_dst, options));
            console.log('   \x1b[36mcreate\x1b[0m : ' + _dst);
        } else if (stat.isDirectory()) {
            copySync(_src, _dst, options);
        }
    });
};

exports.copySync = copySync;

/**
 * 判断该目录是否存在，不存在需要先创建目录
 * @param {string} dst
 * @returns {undefined}
 */
var existsSync = function (dst) {
    if (!fs.existsSync(dst)) {
        fs.mkdirSync(dst);
        console.log('   \x1b[36mcreate\x1b[0m : ' + dst);
    }
};