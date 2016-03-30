## Installation

```sh
$ npm install -g react_cli
```

## Quick Start

```bash
$ react-cli test -e -w -i -p --git
```

Install dependencies:

```bash
$ cd test && npm install
```

Rock and Roll

```bash
$ npm start     #pm2 start
$ npm restart   #pm2 restart
$ npm stop      #pm2 stop
$ npm test      #node start
```

Luncher

```html
http://localhost:8801
user: admin
password: admin
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
