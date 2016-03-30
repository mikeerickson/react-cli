import { combineReducers } from 'redux';

// import Reducers
import base from './Base';
import user from './User';

// add Reducers
export default combineReducers({
    base,
    user
});