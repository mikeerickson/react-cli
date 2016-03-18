/* global module */
var config = {
    port: 8801,
    proxyport: 8802,
    session: {
        name: "jing",
        secret: "jing",
        resave: true,
        saveUninitialized: true
    },
    proxy: {
        default_hostname: 'localhost',
        default_port: 8803
    }
};

module.exports = config;