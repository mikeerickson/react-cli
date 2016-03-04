'use strict';

import React from 'react'; 
import { Tabs, Tab, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import * as Actions from '../actions/Base';
import SlidingMenu from './SlidingMenu';
import hostconfig from '../tools/host';

class DetailPanel extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        this.state = {
            tabs: [
                {value: "bank",label: "银行"},
                {value: "ecommerce",label: "电商"},
                {value: "operator",label: "运营商"},
                {value: "housingfund",label: "公积金"},
                {value: "contact",label: "通讯录"}
            ]
        }
    }
    
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(Actions.getMenu());
    }
    
    handleSelect(key){
        const { dispatch, query } = this.props;
        dispatch(pushState(null, hostconfig.local_host + '/' + key + '?' + Object.keys(query).map(key => key + "=" + query[key]).join("&")));
    }
    
    handleOpen(){
        const { dispatch } = this.props;
        dispatch(Actions.open());
    }
    
    render() {
        const { tab, personal, base: { collapse, menu, errormsg } } = this.props;
        if(menu.length === 0){
            return <Alert bsStyle="danger">您没有权限查询当前数据</Alert>;
        }
        const tabPanel = menu.map((item, index) => {
            if(item.value == tab.key){
                return <Tab key={index} eventKey={item.value} title={item.label} tabClassName="">{tab.content}</Tab>
            }
            return <Tab key={index} eventKey={item.value} title={item.label} tabClassName="jingtab"></Tab>
        })
        if(personal){
            return <SlidingMenu items={menu} tab={tab} error={errormsg} onSelect={this.handleSelect.bind(this)} collapse={collapse} onOpen={this.handleOpen.bind(this)}/>
        }else{
            return <Tabs defaultActiveKey={tab.key} onSelect={this.handleSelect.bind(this)}  position="left" tabWidth={1}>{tabPanel}</Tabs>
        }
    }
}

export default connect(state => ({ base: state.root.base }))(DetailPanel);