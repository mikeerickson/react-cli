"use strict";

import React, { PropTypes, Component } from 'react';
import { Panel, Label, Row, Col, Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import UserGrid from '../models/UserGrid';
import UserCardGrid from '../components/UserCardGrid';
import { SmartInput, SplitLine, WcTable } from 'jing_react_components';

import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import _ from 'underscore';

import * as Actions from '../actions/Searcher';

class UserSearcher extends Component {
    
    constructor(props, context) {
        super(props, context);
        this.state = {
            resolver: {
                string:[
                    {out: "name", format: /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$/},
                    {out: "uid", format: /^\d{6,10}$/}, 
                    {out: "id", format: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/}, 
                    {out: "phone", format: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/},
                    {out: "email", format: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}
                ]
            },
            header:{
                dataheader:[
                    {key:"name", title:"名称", width:100},
                    {key:"id", title:"身份证号", width:200},
                    {key:"uid", title:"UID", width:200, render: function(item, key, row){
                        return <Table striped bordered condensed hover style={{margin:0}}><tbody>{item.map(function(i, j){
                            return <tr><td>{j + 1}</td><td>{i}</td></tr>;
                        })}</tbody></Table>
                    }},
                    {key:"phone", title:"手机号",width:300, render: function(item, key, row){
                        return <Table striped bordered condensed hover style={{margin:0}}><tbody>{item.map(function(i, j){
                            return <tr><td>{j + 1}</td><td>{i}</td></tr>;
                        })}</tbody></Table>
                    }},
                    {key:"email", title:"邮箱",width:300, render: function(item, key, row){
                        return <Table striped bordered condensed hover style={{margin:0}}><tbody>{item.map(function(i, j){
                            return <tr><td>{j + 1}</td><td>{i}</td></tr>;
                        })}</tbody></Table>
                    }},
                    {key:"", title:"查看",width:100, render: function(item, key, row){
                        return <LinkContainer to="/userdata"><Button>查看</Button></LinkContainer>;
                    }}
                ]
            },
            users: []
        };
    }

    handleSearch(value){
        const { dispatch } = this.props;
        if(Object.keys(value).length === 0){
            dispatch(Actions.hideUsers());
        }else{
            dispatch(Actions.listUsersFromLocal(value));
        }
    }
    
    render(){
        const { user } = this.props;
        let userscard, panelStyle, inputwxs;
        if(user.items.length > 0){
            userscard = <UserCardGrid datas={UserGrid} column={5}/>;
            panelStyle = {};
            inputwxs = 11;
        }else{
            userscard = <div></div>;
            panelStyle = {margin: "240px auto"};
            inputwxs = 12;
        }
        return (
            <div className="container">
                <div style={panelStyle}>
                    <h1 className="logo"></h1>
                    <SmartInput wxs={inputwxs} resolver={this.state.resolver} onSearch={this.handleSearch.bind(this)}/>
                    {userscard}
                </div>
            </div>
        );
    }
}

export default connect(state => ({ user : state.root.searcher }))(UserSearcher)