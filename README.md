## Installation

```sh
$ npm install -g react_cli
```

## Quick Start

```bash
$ react-cli test -e -w -i -p --git && cd test
```

Install dependencies:

```bash
$ npm install
```

Rock and Roll

```bash
$ npm start  #pm2 start
$ npm test   #node start
```

## Command Line Options

    -h, --help          output usage information
    -V, --version       output the version number
    -e, --ejs           add ejs engine support (defaults to jade)
        --hbs           add handlebars engine support
    -w, --webpack       add webpack middleware support
    -i, --ie8           add ie8 engine support
    -p, --pm2           add pm2 start script
    -H, --hogan         add hogan.js engine support
    -c, --css <engine>  add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git           add .gitignore
    -f, --force         force on non-empty directory
