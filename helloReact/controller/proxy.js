/* global exports, require */
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var proxyconfig = require("../config/config").proxy;

exports.proxy = function (req, res) {
    proxy.web(req, res, {
        target: proxyconfig.remote_host
    }, function (e) {
        res.render('error', {
            message: e.message,
            error: {}
        });
    });
};