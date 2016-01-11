import { combineReducers } from 'redux';
import base from './Base';
import searcher from './Searcher';
import contact from './Contact';
import ecommerce from './Ecommerce';
import operator from './Operator';
import configer from './Configer';
import bank from './Bank';
    
export default combineReducers({
    base,
    configer,
    searcher,
    bank,
    contact,
    ecommerce,
    operator
});