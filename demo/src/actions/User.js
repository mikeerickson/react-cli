import fetch from '../tools/fetch';

import { BASE, USER } from '../constants/ActionTypes';
import * as urls from '../constants/RemoteUrls';

export function login(params, setting){
    return (dispatch, getState) => 
        dispatch(dispatch => fetch(urls.user.login, params, setting)
        .then(response => response.json())
        .then(res => dispatch({ type: USER.LOGIN, res }))
        .catch((err) => dispatch({ type: BASE.ERROR, err }))
    )
}

export function hide(){
    return { type: USER.SHOW, user: null };
}

export function create(){
    return { type: USER.SHOW, user: null };
}

export function update(user){
    return { type: USER.SHOW, user };
}

export function list(){
    return _remote(null, null, urls.user.list);
}

export function updateUser(params, setting) {
    return _remote(params, setting, urls.user.update);
}

export function deleteUser(params, setting) {
    return _remote(params, setting, urls.user.del);
}

export function createUser(params, setting) {
    return _remote(params, setting, urls.user.add);
}

export function filter(key) {
    return { type: USER.FILTER, key };
}

function _dispatch(dispatch, res){
    res.ok ? dispatch({ type: USER.LIST, res }) : dispatch({ type: BASE.ERROR, res });
}

function _remote(params, setting, url){
    return (dispatch, getState) => 
        dispatch(dispatch => fetch(url, null, setting, params)
        .then(response => response.json())
        .then(res => _dispatch(dispatch, res))
        .catch(err => dispatch({ type: BASE.ERROR, err }))
    )
}