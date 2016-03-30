import { BASE } from '../constants/ActionTypes'

const initialState = {
    menu: [],
    mmenu: [],
    errormsg: null
};

export default function baseReducer(state = initialState, action) {
    const { type, res, err } = action;
    if(err){
        return Object.assign({}, state, {
            errormsg: err
        });
    }
    if(res && !res.ok){
        return Object.assign({}, state, {
            errormsg: res.msg || res.error
        });
    }
    switch (type) {
        case BASE.MENU:
            const classify = action.classify;
            const menu = classify === 1 ? { mmenu: res.data } : { menu: res.data };
            return Object.assign({}, state, menu);
        default:
            return Object.assign({}, state, { errormsg: null });
    }
}