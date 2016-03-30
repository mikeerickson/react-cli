import _fetch from 'isomorphic-fetch';
import _format from '../tools/util';

/**
 * fetch
 * @param {type} url 请求得路径
 * @param {type} format 对url的格式化参数
 * @param {type} options 参数设置
 * @param {type} params body参数传递
 * @returns {undefined}
 */
export default function fetch(url, format, options, params) {
    if(format){
        url = _format(url, format);
    }
    let props = {};
    if(options){
        if(!options.credentials){
            props = {...props, credentials: 'include'};
        }
        if(!options.headers){
            props = {...props, headers: {"Content-Type": "application/json"}};
        }
        props = {...props, ...options};
    } else {
        props = {...props, credentials: 'include'};
    }
    if(params){
        props = {...props, body: JSON.stringify(params)};
    }
    return _fetch(url, props);
}