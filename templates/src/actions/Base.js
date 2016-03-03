import fetch from '../tools/fetch';

import * as types from '../constants/ActionTypes';
import * as urls from '../constants/RemoteUrls';

import userinfo from '../models/UserInfoModel';

// 开关菜单
export function open() {
    return { type: types.BASE.OPEN };
}

// 显示细节窗口
function show(res) {
    return { type: types.BASE.SHOW, res };
}

// 获取菜单
function menu(res, classify) {
    return { type: types.BASE.MENU, res, classify };
}

// 关闭细节窗口
export function hide() {
    return { type: types.BASE.HIDE };
}

export function getMainMenu(){
    return (dispatch, getState) => 
        dispatch(dispatch => fetch(urls.configger.mmenu)
        .then(response => response.json())
        .then(res => dispatch(menu(res, 1)))
        .catch((err) => dispatch({type: "BASE.ERROR", err}))
    )
}

export function getMenu(){
    return (dispatch, getState) => 
        dispatch(dispatch => fetch(urls.configger.menu)
        .then(response => response.json())
        .then(res => dispatch(menu(res, 2)))
        .catch((err) => dispatch({type: "BASE.ERROR", err}))
    )
}

// 查询某个用户的概要【远程】
export function getUserProfile(params, setting){
    return (dispatch, getState) => 
        dispatch(dispatch => fetch(urls.user.getOne, params, {...setting}, params)
        .then(response => response.json())
        .then(res => dispatch(show(res)))
        .catch((err) => dispatch({type: "BASE.ERROR", err}))
    )
}

// 查询某个用户的概要【本地测试】
export function getUserProfileFromLocal(){
    return show({code: 0, data: userinfo});
}