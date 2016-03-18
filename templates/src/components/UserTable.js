'use strict';

import React from 'react'; 
import { Panel, Row, Col, Button, Input } from 'react-bootstrap';

class UserTableRow extends React.Component {
    
    render() {
        const { index, data, onUpdate, onDelete } = this.props;
        return <Row>
            <Col xs={1}>{index}</Col>
            <Col xs={2}>{data.name}</Col>
            <Col xs={2}>{data.sex}</Col>
            <Col xs={2}>{data.age}</Col>
            <Col xs={3}>{data.desc}</Col>
            <Col xs={2}>
                <Button onClick={(e) => onUpdate(e, data)}>编辑</Button>
                <Button onClick={(e) => onDelete(e, data)}>删除</Button>
            </Col>
        </Row>;
    }
}
export UserTableRow;

class UserTableTitle extends React.Component {
    
    render() {
        return <Row>
            <Col xs={1}>编号</Col>
            <Col xs={2}>姓名</Col>
            <Col xs={2}>性别</Col>
            <Col xs={2}>年龄</Col>
            <Col xs={3}>描述</Col>
            <Col xs={2}>操作</Col>
        </Row>;
    }
}
export UserTableTitle;

class UserTableSearcher extends React.Component {
    
    render() {
        const { onChange, filter } = this.props;
        return <Input addonBefore="搜索" type="text" value={filter} onChange={(e) => onSearch(e) }/>;
    }
}
export UserTableSearcher;

class UserTable extends React.Component {
    
    render() {
        const { onSearch, onUpdate, onDelete, filter, list } = this.props;
        return <Panel header = '用户列表' bsStyle='success' >
            <UserTableSearcher filter={filter} onSearch={onSearch} />
            <UserTableTitle />
            {list.map((index, item) => 
                <UserTableRow index={index} key={index} data={item} onUpdate={onUpdate} onDelete={onDelete} />
            )}
        </Panel>
    }
}

export default UserTable;