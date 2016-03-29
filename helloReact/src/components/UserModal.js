"use strict";

import React, { PropTypes, Component } from 'react';
import { Panel, Row, Col, Button, Modal } from 'react-bootstrap';
import ConfigForm from '../components/ConfigForm';
import _ from 'underscore';


export default class UserModal extends Component {
    
    constructor(props, context) {
        super(props, context);
        var age = 0;
        this.ageArray = [];
        while(age < 120){
            this.ageArray.push({
                value: ++age,
                label: age + "岁"
            });
        }
    }
    
    createForm(initState){
        return [
            {
                type: "text",
                label: "姓名",
                lxs: 2,
                wxs: 8,
                param: {
                    output: "name",
                    init: initState && initState.name
                }
            },
            {
                type: "password",
                label: "密码",
                lxs: 2,
                wxs: 8,
                param: {
                    output: "password",
                    init: initState && initState.password
                }
            },
            {
                type: "text",
                label: "花名",
                lxs: 2,
                wxs: 8,
                param: {
                    output: "usename",
                    init: initState && initState.usename
                }
            },
            {
                type: "email",
                label: "邮箱",
                lxs: 2,
                wxs: 8,
                param: {
                    output: "email",
                    init: initState && initState.email
                }
            },
            {
                type: "text",
                label: "手机",
                lxs: 2,
                wxs: 8,
                param: {
                    output: "mobile",
                    init: initState && initState.mobile
                }
            },
            {
                type: "radio",
                label: "性别",
                lxs: 2,
                wxs: 4,
                param: {
                    output: "sex",
                    datas: [{value: "男", label: "男"}, {value: "女", label: "女"}],
                    init: initState && initState.sex
                }
            },
            {
                type: "select",
                label: "年龄",
                lxs: 2,
                wxs: 8,
                param: {
                    output: "age",
                    datas: this.ageArray,
                    init: initState && initState.age
                }
            },
            {
                type: "textarea",
                label: "备注",
                lxs: 2,
                wxs: 8,
                param: {
                    output: "desc",
                    init: initState && initState.desc
                }
            },
            {
                type: "buttons",
                lxs: 2,
                wxs: 8,
                param: {
                    datas: [{type: "submit", label: "提交", wxs: 6 }, {type: "reset", label: "重置", wxs: 6}]
                }
            }
        ]
    }
    
    render(){
        const { title, show, state, onCreate, onHide } = this.props;
        return <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ConfigForm items={this.createForm(state)} col={1} onSubmit={onCreate}/>
            </Modal.Body>
        </Modal>;
    }
}
