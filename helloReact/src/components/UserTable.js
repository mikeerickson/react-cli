'use strict';

import React from 'react';
import { Panel, Row, Col, Button, Input, ListGroupItem } from 'react-bootstrap';

class UserTableRow extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    
    render() {
        const { index, data, onUpdate, onDelete } = this.props;
        return <ListGroupItem style={{padding: "5px 15px"}}><Row>
            <Col xs={1}>{index}</Col>
            <Col xs={1}>{data.usename}</Col>
            <Col xs={2}>{data.mobile}</Col>
            <Col xs={2}>{data.email}</Col>
            <Col xs={1}>{data.sex}</Col>
            <Col xs={1}>{data.age}</Col>
            <Col xs={2}>{data.desc}</Col>
            <Col xs={2}>
                <Button onClick={(e) => onUpdate(e, data)} bsSize="small">编辑</Button>
                <Button onClick={(e) => onDelete(e, data)} bsSize="small">删除</Button>
            </Col>
        </Row></ListGroupItem>;
    }
}

class UserTableTitle extends React.Component {
    
    render() {
        return <ListGroupItem bsStyle="success"><Row>
            <Col xs={1}>编号</Col>
            <Col xs={1}>花名</Col>
            <Col xs={2}>手机</Col>
            <Col xs={2}>邮箱</Col>
            <Col xs={1}>性别</Col>
            <Col xs={1}>年龄</Col>
            <Col xs={2}>描述</Col>
            <Col xs={2}>操作</Col>
        </Row></ListGroupItem>;
    }
}

class UserTableSearcher extends React.Component {
    
    render() {
        const { onSearch, filter } = this.props;
        return <Input addonBefore="搜索" type="text" value={filter} onChange={(e) => onSearch(e) }/>;
    }
}

class UserPanelHeader extends React.Component {
    
    render() {
        const { onCreate, iconStyle, iconColStyle, title, glyphIcon } = this.props;
        return <Row>
            <Col xs={2}>{title}</Col>
            <Col xsOffset={9} xs={1} style={iconColStyle}>
                <span className={glyphIcon} aria-hidden="true" onClick={onCreate} style={iconStyle}></span>
            </Col>
        </Row>;
    }
}

UserPanelHeader.defaultProps = {
    title: "用户列表",
    iconColStyle: {textAlign: "right", },
    glyphIcon: "glyphicon glyphicon-plus",
    iconStyle: {cursor: "pointer"}
}

export default class UserTable extends React.Component {
    
    render() {
        const { onCreate, onSearch, onUpdate, onDelete, filter, datas } = this.props;
        return <Panel header={<UserPanelHeader onCreate={onCreate}/>} bsStyle='success' >
            <UserTableSearcher filter={filter} onSearch={onSearch} />
            <UserTableTitle />
            {datas.map((item, index) => <UserTableRow index={index} key={index} data={item} onUpdate={onUpdate} onDelete={onDelete} />)}
        </Panel>
    }
}