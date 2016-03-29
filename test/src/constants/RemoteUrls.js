import config from '../tools/config';

const host = config.host.local;

// base
export const base = {
    menu: host + '/menu',
    mmenu: host + '/mmenu'
};

// user
export const user = {
    list: host + '/list',
    del: host + '/del',
    add: host + '/add',
    update: host + '/update',
    login: host + '/login/{username}/{password}',
    logout: host + '/logout'
};