"use strict";

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../actions/User';
import UserTable from '../components/UserTable';
import UserModal from '../components/UserModal';

class UserList extends Component {
    
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(Actions.list());
    }
    
    handleHide(e){
        const { dispatch } = this.props;
        dispatch(Actions.hide());
    }
    
    handleCreateShow(e){
        const { dispatch } = this.props;
        dispatch(Actions.create());
    }
    
    handleUpdateShow(e, data){
        const { dispatch } = this.props;
        dispatch(Actions.update(data));
    }
    
    handleUserUpdate(data, update){
        const { dispatch } = this.props;
        console.log(update);
        if(update){
            confirm("确定更新？") && dispatch(Actions.updateUser(data, {method: "post"}));
        }else{
            confirm("确定增加？") && dispatch(Actions.createUser(data, {method: "post"}));
        }
    }
    
    handleUserDelete(e, data){
        const { dispatch } = this.props;
        confirm("确定删除？") && dispatch(Actions.deleteUser(data, {method: "post"}));
    }
    
    handleUserSearch(e){
        const { dispatch } = this.props;
        dispatch(Actions.filter(e.target.value));
    }
    
    filterUser(userList, filter){
        if(filter !== null && filter.length > 0){
            return userList.filter(item => 
                (item.name !== "" && item.name.indexOf(filter) >= 0) ||
                (item.sex !== "" && item.sex == filter) ||
                (item.age !== "" && item.age == filter) ||
                (item.desc !== "" && item.desc.indexOf(filter) >= 0)
            );
        }
        return userList;
    }
    
    render(){
        const { user: { list, filter, show, updater }, base: {errormsg} } = this.props;
        if(errormsg){
            alert(errormsg);
        }
        const filterRes = this.filterUser(list, filter);
        return (
            <div className="container">
                <UserTable filter={filter} datas={filterRes}
                    onSearch={(e) => this.handleUserSearch(e)}
                    onCreate={(e, data) => this.handleCreateShow(e, data)}
                    onUpdate={(e, data) => this.handleUpdateShow(e, data)}
                    onDelete={(e, data) => this.handleUserDelete(e, data)}
                />
                <UserModal title="新增用户" show={show} state={updater} 
                    onHide={(e) => this.handleHide(e)}
                    onCreate={(data) => this.handleUserUpdate(data, updater !== null)}/>
            </div>
        );
    }
    
}

export default connect(state => ({ user : state.root.user, base: state.root.base }))(UserList)