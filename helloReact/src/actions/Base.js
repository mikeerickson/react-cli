import fetch from '../tools/fetch';

import { BASE } from '../constants/ActionTypes';
import * as urls from '../constants/RemoteUrls';

export function getMainMenu(){
    return (dispatch, getState) => 
        dispatch(dispatch => fetch(urls.base.mmenu)
        .then(response => response.json())
        .then(res => dispatch({ type: BASE.MENU, res, classify: 1 }))
        .catch((err) => dispatch({type: BASE.ERROR, err}))
    )
}

export function getMenu(){
    return (dispatch, getState) => 
        dispatch(dispatch => fetch(urls.base.menu)
        .then(response => response.json())
        .then(res => dispatch({ type: BASE.MENU, res, classify: 2 }))
        .catch((err) => dispatch({type: BASE.ERROR, err}))
    )
}