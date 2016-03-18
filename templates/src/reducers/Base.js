import { BASE } from '../constants/ActionTypes'

const initialState = {
    menu: [],
    mmenu: [],
    errormsg: null
};

export default function baseReducer(state = initialState, action) {
    const { type, res, err } = action;
    switch (type) {
        case BASE.MENU:
            const classify = action.classify;
            const menu = classify === 1 ? { mmenu: res.data } : { menu: res.data };
            return Object.assign({}, state, menu);
        case BASE.ERROR:
            if(err){
                return Object.assign({}, state, {
                    errormsg: err
                });
            }
            if(res && res.code !== 0){
                return Object.assign({}, state, {
                    errormsg: res.error || res.err
                });
            }
        default:
            return Object.assign({}, state, { errormsg: null });
    }
}