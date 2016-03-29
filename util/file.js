/* global exports */

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

/**
 * 读取文件内容
 * @param {string} name
 * @returns {unresolved}
 */
var readSync = function (src, options) {
    return fs.readFileSync(src, options);
};

exports.readSync = readSync;

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } src 需要复制的目录
 * @param{ String } dst 复制到指定的目录
 * @param{ String } options 
 */
var copy = function (src, dst, options) {
    var exclude = options && options.exclude || "";
    fs.stat(src, function (err, st) {
        if (err) {
            throw err;
        }
        // 判断是否为文件
        if (st.isFile() && src !== exclude) {
            // 通过管道来传输流
            var dirname = path.dirname(dst);
            fs.exists(dst, function (exist) {
                if (!exist) {
                    mkdirp(dirname, function (err) {
                        if (err) {
                            throw err;
                        }
                        console.log('   \x1b[36mcreate\x1b[0m : ' + dirname);
                        fs.createReadStream(src, options).pipe(fs.createWriteStream(dst, options));
                        console.log('   \x1b[36mcreate\x1b[0m : ' + dst);
                    });
                } else {
                    fs.createReadStream(src, options).pipe(fs.createWriteStream(dst, options));
                    console.log('   \x1b[36mcreate\x1b[0m : ' + dst);
                }
            });
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
            // 判断文件是否存在
            fs.exists(dst, function (exist) {
                if (!exist) {
                    mkdirp(dst, function (err) {
                        if (err) {
                            throw err;
                        }
                        console.log('   \x1b[36mcreate\x1b[0m : ' + dst);
                        recopy(src, dst, options);
                    });
                } else {
                    recopy(src, dst, options);
                }
            });
        }
    });
};

/**
 * 递归复制
 * @param{ String } src 需要复制的目录
 * @param{ String } dst 复制到指定的目录
 * @param{ String } options 
 */
var recopy = function (src, dst, options) {
    var exclude = options && options.exclude || "";
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function (path) {
            var _src = src + '/' + path;
            var _dst = dst + '/' + path;
            fs.stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile() && _src !== exclude) {
                    // 通过管道来传输流
                    fs.createReadStream(_src, options).pipe(fs.createWriteStream(_dst, options));
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
 * @param {type} options 参数
 * @returns {undefined}
 */
var copySync = function (src, dst, options) {
    var exclude = options && options.exclude || "";
    // 先判断是否是文件
    var stat = fs.statSync(src);
    // 如果是文件直接复制
    if (stat.isFile() && src !== exclude) {
        var dirname = path.dirname(dst);
        existsSync(dirname);
        fs.createReadStream(src, options).pipe(fs.createWriteStream(dst, options));
        console.log('   \x1b[36mcreate\x1b[0m : ' + dst);
    }
    // 文件夹判断文件夹是否需要重新生成
    else if (stat.isDirectory()) {
        // 判断文件是否存在
        existsSync(dst);
        // 读取目录中的所有文件/目录
        var fileArray = fs.readdirSync(src);
        fileArray.forEach(function (file) {
            var _src = src + '/' + file;
            var _dst = dst + '/' + file;
            var stat = fs.statSync(_src);
            // 判断是否为文件
            if (stat.isFile() && _src !== exclude) {
                fs.createReadStream(_src, options).pipe(fs.createWriteStream(_dst, options));
                console.log('   \x1b[36mcreate\x1b[0m : ' + _dst);
            } else if (stat.isDirectory()) {
                copySync(_src, _dst, options);
            }
        });
    }
};

exports.copySync = copySync;

/**
 * 把内容写入指定文件
 * @param {type} src 指定的文件
 * @param {type} str 文件内容
 * @param {type} options 参数
 * @returns {undefined}
 */
var writeSync = function (src, str, options) {
    var dirname = path.dirname(src);
    existsSync(dirname);
    fs.writeFileSync(src, str, options || {mode: 0666});
    console.log('   \x1b[36mcreate\x1b[0m : ' + src);
};

exports.writeSync = writeSync;

/**
 * 判断该目录是否存在，不存在需要先创建目录
 * @param {string} dst
 * @returns {undefined}
 */
var existsSync = function (dst) {
    if (!fs.existsSync(dst)) {
        mkdirp.sync(dst);
        console.log('   \x1b[36mcreate\x1b[0m : ' + dst);
    }
};

/**
 * Mkdir -p
 * @param {type} path
 * @param {type} fn
 * @returns {undefined}
 */
var mkdir = function (path, fn) {
    mkdirp(path, 0755, function (err) {
        if (err)
            throw err;
        console.log('   \033[36mcreate\033[0m : ' + path);
        fn && fn();
    });
};
exports.mkdir = mkdir;