import React, { Component } from 'react';
import { Panel, Button, Input } from 'react-bootstrap';
import { connect } from 'react-redux';

import config from '../tools/config';
import * as Actions from '../actions/User';

class UserLogin extends Component {
    
    constructor(props, context) {
        super(props, context);
    }
    
    handleAlertDismiss(){
        this.setState({alertVisible: false});
    }
    
    handleLogin(e, logined){
        e.preventDefault();
        const { location: { query }, dispatch } = this.props;
        dispatch(Actions.login({user: "", password: ""}));
    }
    
    render(){
        const { user, style } = this.props;
        const { logined, loginmsg } = user;
        
        let loginButton;
        if(logined){
            loginButton = <Alert bsStyle="danger" onDismiss={() => this.handleAlertDismiss() } dismissAfter={3000}>{loginmsg}</Alert>;
        }else{
            loginButton = <div>
                <Button bsStyle='info' type='submit' block>登录</Button>
                <Button bsStyle='info' type='reset' block>取消</Button>
            </div>;
        }
        return <Panel header={<h3>用户登录</h3>} bsStyle='success' style={style}>
            <form onSubmit={(e) => this.handleLogin(e) }>
                <Input type='text' placeholder="账号" buttonBefore={<Button>账号</Button>}/>
                <Input type='password' placeholder="密码" buttonBefore={<Button>密码</Button>}/>
                {loginButton}
            </form>
        </Panel>
    }
}

UserLogin.propTypes = {
    style: React.PropTypes.object
};

UserLogin.defaultProps = {
    style: { width: 400, height: 250, margin: "200px auto" }
};

export default connect(state => ({ user : state.root.user }))(UserLogin);
