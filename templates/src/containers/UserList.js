"use strict";

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import UserTable from '../components/UserTable';

class UserList extends Component {
    
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(Actions.list());
    }
    
    handleUserUpdate(e, data){
        const { dispatch } = this.props;
        dispatch(Actions.updateUser(data));
    }
    
    handleUserDelete(e, data){
        const { dispatch } = this.props;
        dispatch(Actions.deleteUser(data));
    }
    
    handleUserSearch(e){
        const { dispatch } = this.props;
        dispatch(Actions.filter(e.target.value));
    }
    
    filterUser(userList, filter){
        if(filter !== null && filter.trim().length > 0){
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
        const { user: { list, filter } } = this.props;
        const filterRes = this.filterUser(list, filter);
        return (
            <div className="container">
                <UserTable filter={filter} list={filterRes}
                    onSearch={(e) => this.handleUserSearch(e)}
                    onUpdate={(e, data) => this.handleUserUpdate(e, data)}
                    onDelete={(e, data) => this.handleUserDelete(e, data)}
                />
            </div>
        );
    }
    
}

export default connect(state => ({ user : state.root.user }))(UserList)