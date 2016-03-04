import fetch from '../tools/fetch';

import { BASE, USER } from '../constants/ActionTypes';
import * as urls from '../constants/RemoteUrls';


export function login(params, setting){
    return (dispatch, getState) => 
        dispatch(dispatch => fetch(urls.user.login, params, {...setting})
        .then(response => response.json())
        .then(res => dispatch({ type: USER.LOGIN, res }))
        .catch((err) => dispatch({type: BASE.ERROR, err}))
    )
}

export function list(){
    return (dispatch, getState) => 
        dispatch(dispatch => fetch(urls.user.list)
        .then(response => response.json())
        .then(res => dispatch(_list({ type: USER.LIST, res })))
        .catch((err) => dispatch({type: BASE.ERROR, err}))
    )
}

export function filter(key) {
    return { type: BANK.FILTER, key };
}