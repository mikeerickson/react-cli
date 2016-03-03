import hostconfig from '../tools/host';

const remote_host = hostconfig.remote_host;
const local_host = hostconfig.local_host;

// 用户配置相关
export const configger = {
    get : local_host + '/config/get/all',                                                //查询配置参数
    set : local_host + '/config/set',                                                    //设置配置参数
    del : local_host + '/config/del',                                                    //删除配置参数
    gettools : local_host + '/config/tools',                                             //获取工具条
    getmodel : local_host + '/config/model/get',                                         //获取分组显示模块
    delmodel : local_host + '/config/model/del',                                         //根据分组删除显示模块
    setmodel : local_host + '/config/model/set',                                         //根据分组配置显示模块
    delrole : local_host + '/config/role/del',                                           //根据用户删除权限
    setrole : local_host + '/config/role/set',                                           //根据用户设置权限
    getrole : local_host + '/config/role/get/{user}',                                    //获取某用户的权限
    menu: local_host + '/config/menu',                                                   //获取菜单列表
    mmenu: local_host + '/config/mmenu'                                                  //获取主菜单列表
};

// 用户搜索相关
export const user = {
    getAll : remote_host + '/apply/{idno}/{uid}',                                        //根据身份证，姓名，手机号查询用户
    getOne : remote_host + '/apply/{uid}'                                                //获取某一个用户的概要信息
};