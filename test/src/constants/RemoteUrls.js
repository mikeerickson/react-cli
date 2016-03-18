import config from '../tools/config';

const host = config.host.local;

// base
export const base = {
    menu: host + '/menu',
    mmenu: host + '/mmenu'
};

// user
export const user = {
    list: host + '/user/list',
    del: host + '/user/del',
    add: host + '/user/add',
    update: host + '/user/update',
    login: host + '/user/login/{user}/{password}',
    logout: host + '/user/logout'
};