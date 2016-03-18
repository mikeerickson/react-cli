import { BASE } from '../constants/ActionTypes'

const initialState = {
    list: [],
    filter: {},
    logined: false,
    loginmsg: ""
};

export default function userReducer(state = initialState, action) {
    const { type, res, key } = action;
    
    switch (type) {
        case BASE.LOGIN:
            return Object.assign({}, state, {
                logined: res.ok,
                loginmsg: res.msg
            });
        case BASE.LIST:
            return Object.assign({}, state, {
                list: res.data
            });
        case BASE.FILTER:
            return Object.assign({}, state, {
                filter: key
            });
        default:
            return state;
    }
}