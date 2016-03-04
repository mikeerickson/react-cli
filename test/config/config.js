/* global module */
var config = {
    port: 30000,
    proxyport: 30001,
    session: {
        name: "jing",
        secret: "jing",
        resave: true,
        saveUninitialized: true
    },
    proxy: {
        default_hostname: 'localhost',
        default_port: 30002
    }
};

module.exports = config;