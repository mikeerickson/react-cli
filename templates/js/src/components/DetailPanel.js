'use strict';

import React from 'react'; 
import { Tabs, Tab } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import SlidingMenu from './LeftMenuTab';

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
    
    handleSelect(key){
        const { dispatch, query } = this.props;
        dispatch(pushState(null, '/' + key + '?key=' + query));
    }
    
    render() {
        const { tab, personal } = this.props;
        const { tabs } = this.state;
        const tabPanel = tabs.map(item => {
            if(item.value == tab.key){
                return <Tab eventKey={item.value} title={item.label}>{tab.content}</Tab>
            }
            return <Tab eventKey={item.value} title={item.label}></Tab>
        })
        if(personal){
            return <SlidingMenu items={tabs} tab={tab} onSelect={this.handleSelect.bind(this)}/>
        }else{
            return <Tabs defaultActiveKey={tab.key} onSelect={this.handleSelect.bind(this)}  position="left" tabWidth={2}>
                {tabPanel}
            </Tabs>
        }
    }
}

export default connect(state => ({ base: state.root.base }))(DetailPanel);