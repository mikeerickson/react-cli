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
    login: host + '/user/login/{user}/{password}',
    logout: host + '/user/logout'
};