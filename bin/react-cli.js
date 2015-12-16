#!/usr/bin/env node

var program = require('commander');
var mkdirp = require('mkdirp');
var os = require('os');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var sortedObject = require('sorted-object');

var _exit = process.exit;
var eol = os.EOL;
var pkg = require('../package.json');

var version = pkg.version;

// Re-assign process.exit because of commander
// TODO: Switch to a different command framework
process.exit = exit

// CLI

before(program, 'outputHelp', function () {
    this.allowUnknownOption();
});

program.version(version)
        .usage('[options] [dir]')
        .option('-e, --ejs', 'add ejs engine support (defaults to jade)')
        .option('    --hbs', 'add handlebars engine support')
        .option('-H, --hogan', 'add hogan.js engine support')
        .option('-w, --webpack', 'add webpack engine support')
        .option('-c, --css <engine>', 'add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)')
        .option('    --git', 'add .gitignore')
        .option('-f, --force', 'force on non-empty directory')
        .parse(process.argv);

if (!exit.exited) {
    main();
}

/**
 * Install a before function; AOP.
 */

function before(obj, method, fn) {
    var old = obj[method];

    obj[method] = function () {
        fn.call(this);
        old.apply(this, arguments);
    };
}

/**
 * Prompt for confirmation on STDOUT/STDIN
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

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */

function createApplication(app_name, path) {
    var wait = 5;

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

    // JavaScript
    var app = loadTemplate('js/app.js');
    var webpack = loadTemplate('js/webpack.config.js');
    var www = loadTemplate('js/www');
    var router = loadTemplate('js/router.js');
    var user = loadTemplate('js/controller/user.js');
    var auth = loadTemplate('js/tools/auth.js');
    var host = loadTemplate('js/tools/host.js');
    var cas = loadTemplate('js/config/cas.js');
    var comptest = loadTemplate('js/components/Comptest.js');
    var MainMenu = loadTemplate('js/components/MainMenu.js');
    var index = loadTemplate('js/containers/Index.js');

    // CSS
    var css = loadTemplate('css/style.css');
    var bscss = loadTemplate('css/bootstrap.min.css');
    var less = loadTemplate('css/style.less');
    var bsless = loadTemplate('css/bootstrap.less');
    var stylus = loadTemplate('css/style.styl');
    var compass = loadTemplate('css/style.scss');
    var sass = loadTemplate('css/style.sass');

    mkdir(path, function () {
        mkdir(path + '/controller', function () {
            write(path + '/router.js', router);
            write(path + '/controller/user.js', user);
            complete();
        });
        mkdir(path + '/config', function () {
            write(path + '/config/cas.js', cas);
            complete();
        });
        mkdir(path + '/src');
        mkdir(path + '/src/containers', function () {
            write(path + '/src/containers/Index.js', index);
            complete();
        });
        mkdir(path + '/src/components', function () {
            write(path + '/src/components/Comptest.js', comptest);
            write(path + '/src/components/MainMenu.js', MainMenu);
            complete();
        });
        mkdir(path + '/src/tools', function () {
            write(path + '/src/tools/auth.js', auth);
            write(path + '/src/tools/host.js', host);
            complete();
        });
        mkdir(path + '/src/images');
        mkdir(path + '/src/stylesheets', function () {
            switch (program.css) {
                case 'less':
                    write(path + '/src/stylesheets/style.less', less);
                    write(path + '/src/stylesheets/bootstrap.less', bsless);
                    break;
                case 'stylus':
                    write(path + '/src/stylesheets/style.styl', stylus);
                    break;
                case 'compass':
                    write(path + '/src/stylesheets/style.scss', compass);
                    break;
                case 'sass':
                    write(path + '/src/stylesheets/style.sass', sass);
                    break;
                default:
                    write(path + '/src/stylesheets/style.css', css);
                    write(path + '/src/stylesheets/bootstrap.css', bscss);
            }
            complete();
        });

        mkdir(path + '/src/views', function () {
            switch (program.template) {
                case 'ejs':
                    copy_template('ejs/index.ejs', path + '/src/views/index.ejs');
                    copy_template('ejs/error.ejs', path + '/src/views/error.ejs');
                    break;
                case 'jade':
                    copy_template('jade/index.jade', path + '/src/views/index.jade');
                    copy_template('jade/layout.jade', path + '/src/views/layout.jade');
                    copy_template('jade/error.jade', path + '/src/views/error.jade');
                    break;
                case 'hjs':
                    copy_template('hogan/index.hjs', path + '/src/views/index.hjs');
                    copy_template('hogan/error.hjs', path + '/src/views/error.hjs');
                    break;
                case 'hbs':
                    copy_template('hbs/index.hbs', path + '/src/views/index.hbs');
                    copy_template('hbs/layout.hbs', path + '/src/views/layout.hbs');
                    copy_template('hbs/error.hbs', path + '/src/views/error.hbs');
                    break;
            }
            complete();
        });

        // CSS Engine support
        switch (program.css) {
            case 'less':
                app = app.replace('{css}', eol + 'app.use(require(\'less-middleware\')(path.join(__dirname, \'src\')));');
                break;
            case 'stylus':
                app = app.replace('{css}', eol + 'app.use(require(\'stylus\').middleware(path.join(__dirname, \'src\')));');
                break;
            case 'compass':
                app = app.replace('{css}', eol + 'app.use(require(\'node-compass\')({mode: \'expanded\'}));');
                break;
            case 'sass':
                app = app.replace('{css}', eol + 'app.use(require(\'node-sass-middleware\')({\n  src: path.join(__dirname, \'src\'),\n  dest: path.join(__dirname, \'src\'),\n  indentedSyntax: true,\n  sourceMap: true\n}));');
                break;
            default:
                app = app.replace('{css}', '');
        }

        // Template support
        app = app.replace('{views}', program.template);

        // webpack support
        if (program.webpack) {
            app = app.replace('{webpack}', eol + fs.readFileSync(__dirname + '/../templates/js/webpack.js', 'utf-8'));
            write(path + '/webpack.config.js', webpack);
        } else {
            app = app.replace('{webpack}', '');
        }

        // package.json
        var pkg = {
            name: app_name
            , version: '0.0.0'
            , private: true
            , scripts: {start: 'node ./bin/www'}
            , dependencies: {
                'express': '~4.13.1',
                "express-session": "~1.12.1",
                'body-parser': '~1.13.2',
                'cookie-parser': '~1.3.5',
                'debug': '~2.2.0',
                'morgan': '~1.6.1',
                'serve-favicon': '~2.3.0',
                "bootstrap": "~3.3.5",
                "history": "~1.13.1",
                "jquery": "~2.1.4",
                "ldapjs": "~0.7.1",
                "moment": "~2.10.6",
                "react": "~0.14.3",
                "react-dom": "~0.14.3",
                "react-bootstrap": "~0.28.1",
                "react-router": "~1.0.2",
                "react-router-bootstrap": "~0.19.3",
                "underscore": "~1.8.3",
                "node-cas": "~1.0.1",
                "jing_react_components": "~0.0.4"
            }
        };

        switch (program.template) {
            case 'jade':
                pkg.dependencies['jade'] = '~1.11.0';
                break;
            case 'ejs':
                pkg.dependencies['ejs'] = '~2.3.3';
                break;
            case 'hjs':
                pkg.dependencies['hjs'] = '~0.0.6';
                break;
            case 'hbs':
                pkg.dependencies['hbs'] = '~3.1.0';
                break;
            default:
        }

        // CSS Engine support
        switch (program.css) {
            case 'less':
                pkg.dependencies['less-middleware'] = '1.0.x';
                break;
            case 'compass':
                pkg.dependencies['node-compass'] = '0.2.3';
                break;
            case 'stylus':
                pkg.dependencies['stylus'] = '0.42.3';
                break;
            case 'sass':
                pkg.dependencies['node-sass-middleware'] = '0.8.0';
                break;
            default:
        }

        if (program.webpack) {
            pkg.dependencies['webpack'] = '^1.9.11';
            pkg.dependencies['webpack-dev-middleware'] = '^1.2.0';
            pkg.dependencies['webpack-hot-middleware'] = '^2.2.0';
            pkg.dependencies['babel-core'] = '^5.6.18',
                    pkg.dependencies['babel-loader'] = '^5.1.4',
                    pkg.dependencies['raw-loader'] = '^0.5.1',
                    pkg.dependencies['style-loader'] = '^0.12.3',
                    pkg.dependencies['babel-plugin-react-transform'] = '^1.0.3'
        }

        // sort dependencies like npm(1)
        pkg.dependencies = sortedObject(pkg.dependencies);

        // write files
        write(path + '/package.json', JSON.stringify(pkg, null, 2));
        write(path + '/app.js', app);
        mkdir(path + '/bin', function () {
            www = www.replace('{name}', app_name);
            write(path + '/bin/www', www, 0755);
            complete();
        });

        if (program.git) {
            write(path + '/.gitignore', fs.readFileSync(__dirname + '/../templates/js/gitignore', 'utf-8'));
        }

        complete();
    });
}

function copy_template(from, to) {
    from = path.join(__dirname, '..', 'templates', from);
    write(to, fs.readFileSync(from, 'utf-8'));
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory(path, fn) {
    fs.readdir(path, function (err, files) {
        if (err && 'ENOENT' != err.code)
            throw err;
        fn(!files || !files.length);
    });
}

/**
 * Graceful exit for async STDIO
 */

function exit(code) {
    // flush output for Node.js Windows pipe bug
    // https://github.com/joyent/node/issues/6247 is just one bug example
    // https://github.com/visionmedia/mocha/issues/333 has a good discussion
    function done() {
        if (!(draining--))
            _exit(code);
    }

    var draining = 0;
    var streams = [process.stdout, process.stderr];

    exit.exited = true;

    streams.forEach(function (stream) {
        // submit empty write request and wait for completion
        draining += 1;
        stream.write('', done);
    });

    done();
}

/**
 * Determine if launched from cmd.exe
 */

function launchedFromCmd() {
    return process.platform === 'win32'
            && process.env._ === undefined;
}

/**
 * Load template file.
 */

function loadTemplate(name) {
    return fs.readFileSync(path.join(__dirname, '..', 'templates', name), 'utf-8');
}

/**
 * Main program.
 */

function main() {
    // Path
    var destinationPath = program.args.shift() || '.';

    // App name
    var appName = path.basename(path.resolve(destinationPath));

    // Template engine
    program.template = 'jade';
    if (program.ejs)
        program.template = 'ejs';
    if (program.hogan)
        program.template = 'hjs';
    if (program.hbs)
        program.template = 'hbs';

    // Generate application
    emptyDirectory(destinationPath, function (empty) {
        if (empty || program.force) {
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

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str, mode) {
    fs.writeFileSync(path, str, {mode: mode || 0666});
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
    mkdirp(path, 0755, function (err) {
        if (err)
            throw err;
        console.log('   \033[36mcreate\033[0m : ' + path);
        fn && fn();
    });
}
