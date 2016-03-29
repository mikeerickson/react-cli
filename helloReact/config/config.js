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
            "value": "demo",
            "label": "测试样例",
            "desc": "测试样例"
        },
        {
            "value": "user",
            "label": "用户列表",
            "desc": "用户列表"
        }
    ]
};

module.exports = config;