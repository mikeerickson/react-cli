#!/usr/bin/env node

var cmd = require('commander');
var mkdirp = require('mkdirp');
var os = require('os');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var sortedObject = require('sorted-object');

var _exit = process.exit;
var eol = os.EOL;
var pkg = require('../package.json');
var util = require('../util/file');

var version = pkg.version;

process.exit = exit;

before(cmd, 'outputHelp', function () {
    this.allowUnknownOption();
});

cmd.version(version).usage('[options] [dir]')
        .option('-e, --ejs', 'add ejs template engine support (defaults to jade)')
        .option('    --hbs', 'add handlebars template engine support')
        .option('-H, --hogan', 'add hogan.js template engine support')
        .option('-w, --webpack', 'add webpack template engine support')
        .option('-c, --css <engine>', 'add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)')
        .option('    --git', 'add .gitignore')
        .option('-f, --force', 'force on non-empty directory')
        .option('-P, --pm2', 'add PM2 production process manager for Node.js applications')
        .parse(process.argv);

if (!_exit.exited) {
    main();
}

function before(obj, method, fn) {
    var old = obj[method];

    obj[method] = function () {
        fn.call(this);
        old.apply(this, arguments);
    };
}

/**
 * 
 * @param {type} msg
 * @param {type} callback
 * @returns {undefined}
 */
function confirm(msg, callback) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(msg, function (input) {
        rl.close();
        callback(/^y|yes|ok|true$/i.test(input));
    });
}
;

/**
 * 
 * @param {type} app_name
 * @param {type} path
 * @returns {undefined}
 */
function createApplication(app_name, path) {
    var wait = 2;
    
    console.log();
    function complete() {
        if (--wait)
            return;
        var prompt = launchedFromCmd() ? '>' : '$';

        console.log();
        console.log('   install dependencies:');
        console.log('     %s cd %s && npm install', prompt, path);
        console.log();
        console.log('   run the app:');

        if (launchedFromCmd()) {
            console.log('     %s SET DEBUG=%s:* & npm start', prompt, app_name);
        } else {
            console.log('     %s DEBUG=%s:* npm start', prompt, app_name);
        }

        console.log();
    }

    var app = loadTemplate('templates/js/app.js');
    var router = loadTemplate('templates/js/router.js');

    mkdir(path, function () {

        // 生成package.json
        var pkg = {
            name: app_name
            , version: '0.0.0'
            , private: true
            , scripts: {start: 'node ./bin/www'}
            , dependencies: {
                'express': '~4.13.4',
                "express-session": "~1.12.1",
                'body-parser': '~1.13.2',
                'cookie-parser': '~1.3.5',
                'debug': '~2.2.0',
                'serve-favicon': '~2.3.0',
                "bootstrap": "~3.3.5",
                "history": "~1.13.1",
                "moment": "~2.10.6",
                "react": "~0.14.3",
                "react-dom": "~0.14.3",
                "react-bootstrap": "~0.28.1",
                "react-router": "~1.0.2",
                "react-router-bootstrap": "~0.19.3",
                "underscore": "~1.8.3"
            },
            devDependencies: {
            }
        };

        // 生成模板
        mkdir(path + '/src/views', function () {
            app = app.replace('{views}', cmd.template);
            switch (cmd.template) {
                case 'ejs':
                    copyTemplate('templates/views/ejs/index.ejs', path + '/src/views/index.ejs');
                    copyTemplate('templates/views/ejs/error.ejs', path + '/src/views/error.ejs');

                    pkg.dependencies['ejs'] = '~2.4.1';
                    break;
                case 'jade':
                    copyTemplate('templates/views/jade/index.jade', path + '/src/views/index.jade');
                    copyTemplate('templates/views/jade/layout.jade', path + '/src/views/layout.jade');
                    copyTemplate('templates/views/jade/error.jade', path + '/src/views/error.jade');

                    pkg.dependencies['jade'] = '~1.11.0';
                    break;
                case 'hjs':
                    copyTemplate('templates/views/hogan/index.hjs', path + '/src/views/index.hjs');
                    copyTemplate('templates/views/hogan/error.hjs', path + '/src/views/error.hjs');

                    pkg.dependencies['hjs'] = '~0.0.6';
                    break;
                case 'hbs':
                    copyTemplate('templates/views/hbs/index.hbs', path + '/src/views/index.hbs');
                    copyTemplate('templates/views/hbs/layout.hbs', path + '/src/views/layout.hbs');
                    copyTemplate('templates/views/hbs/error.hbs', path + '/src/views/error.hbs');

                    pkg.dependencies['hbs'] = '~4.0.0';
                    break;
            }
            complete();
        });

        // 生成css
        mkdir(path + '/src/stylesheets', function () {
            switch (cmd.css) {
                case 'less':
                    copyTemplate('templates/css/style.less', path + '/src/stylesheets/style.less');
                    copyTemplate('templates/css/bootstrap.less', path + '/src/stylesheets/bootstrap.less');
                    app = app.replace('{css}', eol + 'app.use(require(\'less-middleware\')(path.join(__dirname, \'src\')));');

                    pkg.dependencies['less-middleware'] = '~2.1.0';
                    break;
                case 'stylus':
                    copyTemplate('templates/css/style.styl', path + '/src/stylesheets/style.styl');
                    app = app.replace('{css}', eol + 'app.use(require(\'stylus\').middleware(path.join(__dirname, \'src\')));');

                    pkg.dependencies['stylus'] = '~0.53.0';
                    break;
                case 'compass':
                    copyTemplate('templates/css/style.scss', path + '/src/stylesheets/style.scss');
                    app = app.replace('{css}', eol + 'app.use(require(\'node-compass\')({mode: \'expanded\'}));');

                    pkg.dependencies['node-compass'] = '~0.2.4';
                    break;
                case 'sass':
                    copyTemplate('templates/css/style.sass', path + '/src/stylesheets/style.sass');
                    app = app.replace('{css}', eol + 'app.use(require(\'node-sass-middleware\')({\n  src: path.join(__dirname, \'src\'),\n  dest: path.join(__dirname, \'src\'),\n  indentedSyntax: true,\n  sourceMap: true\n}));');

                    pkg.dependencies['node-sass-middleware'] = '~0.9.7';
                    break;
                default:
                    copyTemplate('templates/css/style.css', path + '/src/stylesheets/style.css');
                    copyTemplate('templates/css/bootstrap.min.css', path + '/src/stylesheets/bootstrap.css');
                    app = app.replace('{css}', '');
            }
            complete();
        });

        // 增加webpack支持
        if (cmd.webpack) {
            app = app.replace('{webpack}', eol + fs.readFileSync(__dirname + '/../templates/webpack.js', 'utf-8'));
            write(path + '/webpack.config.js', loadTemplate('templates/webpack.config.js'));

            pkg.dependencies['webpack'] = '~1.12.14';
            pkg.dependencies['webpack-dev-middleware'] = '~1.5.1';
            pkg.dependencies['webpack-hot-middleware'] = '~2.9.0';

        } else {
            app = app.replace('{webpack}', '');
        }
        
        pkg.devDependencies['babel-core'] = '~6.6.0';
        pkg.devDependencies['babel-loader'] = '~6.2.4';
        pkg.devDependencies['raw-loader'] = '~0.5.1';
        pkg.devDependencies['style-loader'] = '~0.13.0';
        pkg.devDependencies['babel-plugin-react-transform'] = '~2.0.0';
        pkg.devDependencies['babel-plugin-add-module-exports'] = '~0.1.2';
        pkg.devDependencies['babel-preset-es2015'] = '~6.5.0';
        pkg.devDependencies['babel-preset-react'] = '~6.5.0';
        pkg.devDependencies['babel-preset-stage-0'] = '~6.3.13';
        pkg.devDependencies['es3ify-loader'] = '~0.1.0';

        // 排序
        pkg.dependencies = sortedObject(pkg.dependencies);

        // 写入文件
        write(path + '/package.json', JSON.stringify(pkg, null, 4));
        write(path + '/app.js', app);
        write(path + '/router.js', router);

        util.copySync('templates/src', path + '/src');
        util.copySync('templates/js/bin', path + '/bin');
        util.copySync('templates/js/common', path + '/common');
        util.copySync('templates/js/config', path + '/config');
        util.copySync('templates/js/controller', path + '/controller');
        util.copySync('templates/js/models', path + '/models');
        util.copySync('templates/js/test', path + '/test');

        // git
        if (cmd.git) {
            write(path + '/.gitignore', fs.readFileSync(__dirname + '/../templates/gitignore', 'utf-8'));
        }

        complete();
    });
}
;

/**
 * Check if the given directory `path` is empty
 * @param {type} path
 * @param {type} fn
 * @returns {undefined}
 */
function emptyDirectory(path, fn) {
    fs.readdir(path, function (err, files) {
        if (err && 'ENOENT' != err.code)
            throw err;
        fn(!files || !files.length);
    });
}
;

/**
 * 
 * @param {type} code
 * @returns {undefined}
 */
function exit(code) {
    function done() {
        if (!(draining--))
            _exit(code);
    }

    var draining = 0;
    var streams = [process.stdout, process.stderr];

    exit.exited = true;

    streams.forEach(function (stream) {
        draining += 1;
        stream.write('', done);
    });

    done();
}
;

/**
 * 
 * @returns {Boolean}
 */
function launchedFromCmd() {
    return process.platform === 'win32' && process.env._ === undefined;
}
;

/**
 * 
 * @param {type} name
 * @returns {unresolved}
 */
function loadTemplate(name) {
    return fs.readFileSync(path.join(__dirname, '..', name), 'utf-8');
}
;

/**
 * 
 * @param {type} from
 * @param {type} to
 * @returns {undefined}
 */
function copyTemplate(from, to) {
    write(to, loadTemplate(from));
}
;

/**
 * main
 * @returns {undefined}
 */
function main() {
    // Path
    var destinationPath = cmd.args.shift() || '.';

    // App name
    var appName = path.basename(path.resolve(destinationPath));

    // Template engine
    cmd.template = 'jade';
    if (cmd.ejs)
        cmd.template = 'ejs';
    if (cmd.hogan)
        cmd.template = 'hjs';
    if (cmd.hbs)
        cmd.template = 'hbs';

    emptyDirectory(destinationPath, function (empty) {
        if (empty || cmd.force) {
            createApplication(appName, destinationPath);
        } else {
            confirm('destination is not empty, continue? [y/N] ', function (ok) {
                if (ok) {
                    process.stdin.destroy();
                    createApplication(appName, destinationPath);
                } else {
                    console.error('aborting');
                    exit(1);
                }
            });
        }
    });
}
;

/**
 * echo str > path.
 * @param {type} path
 * @param {type} str
 * @param {type} mode
 * @returns {undefined}
 */
function write(path, str, mode) {
    fs.writeFileSync(path, str, {mode: mode || 0666});
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}
;

/**
 * Mkdir -p
 * @param {type} path
 * @param {type} fn
 * @returns {undefined}
 */
function mkdir(path, fn) {
    mkdirp(path, 0755, function (err) {
        if (err)
            throw err;
        console.log('   \033[36mcreate\033[0m : ' + path);
        fn && fn();
    });
}
;