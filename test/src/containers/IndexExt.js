require('es5-shim')
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
require('core-js/fn/object/assign');
require('fetch-ie8');

const React = require('react');
const ReactDOM = require('react-dom');
const Root = require('./Index');

ReactDOM.render(
    <Root />,
    document.getElementById('index_content')
);