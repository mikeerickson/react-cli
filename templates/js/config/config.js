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
    },
    menu: [
        {
            "value": "user",
            "label": "User",
            "desc": "菜单0"
        },
        {
            "value": "test",
            "label": "Test",
            "desc": "菜单1"
        },
        {
            "value": "demo",
            "label": "Demo",
            "desc": "菜单2"
        }
    ]
};

module.exports = config;