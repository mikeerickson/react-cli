import { USER } from '../constants/ActionTypes'

const initialState = {
    list: [],
    show: false,
    updater: null,
    filter: "",
    logined: false,
    loginmsg: ""
};

export default function userReducer(state = initialState, action) {
    const { type, res, key } = action;
    switch (type) {
        case USER.LOGIN:
            return Object.assign({}, state, {
                logined: res.ok,
                loginmsg: res.msg
            });
        case USER.SHOW:
            return Object.assign({}, state, {
                show: !state.show,
                updater: action.user
            });
        case USER.LIST:
            return Object.assign({}, state, {
                list: res.data || [],
                show: false
            });
        case USER.FILTER:
            return Object.assign({}, state, {
                filter: key
            });
        default:
            return state;
    }
}