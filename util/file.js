var fs = require('fs');

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } src 需要复制的目录
 * @param{ String } dst 复制到指定的目录
 */
var copy = function (src, dst) {
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
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable);
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    copy(_src, _dst);
                }
            });
        });
    });
};

/**
 * 复制目录中的所有文件包括子目录
 * @param {type} src 需要复制的目录
 * @param {type} dst 复制到指定的目录
 * @returns {undefined}
 */
var copySync = function (src, dst) {
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
            fs.createReadStream(_src).pipe(fs.createWriteStream(_dst));
        } else if (stat.isDirectory()) {
            copySync(_src, _dst);
        }
    });
};

/**
 * 判断该目录是否存在，不存在需要先创建目录
 * @param {string} dst
 * @returns {undefined}
 */
var existsSync = function (dst) {
    if (!fs.existsSync(dst)) {
        fs.mkdirSync(dst);
    }
};

copy("E:\\Node\\a", "E:\\Node\\bb");
copySync("E:\\Node\\a", "E:\\Node\\aa");