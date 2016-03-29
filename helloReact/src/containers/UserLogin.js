import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Panel, Button, Input, Alert } from 'react-bootstrap';

import config from '../tools/config';
import fetch from '../tools/fetch';
import * as urls from '../constants/RemoteUrls';
import '../stylesheets/bootstrap.css';

class UserLogin extends Component {
    
    constructor(props, context) {
        super(props, context);
        this.state = {
            alertVisible: false,
            errorAlertMsg: "",
            errorAlertExtMsg: "",
            name: "",
            password: ""
        }
    }
    
    handleAlertDismiss(){
        this.setState({
            alertVisible: false
        });
    }
    
    handleLogin(e){
        e.preventDefault();
        const { name, password } = this.state;
        if(name ===  "" || password ===  ""){
            this.setState({
                alertVisible: true,
                errorAlertMsg: "用户名和密码不能为空！"
            });
        }else{
            fetch(urls.user.login, {
                username: name,
                password: password
            }, {method: "post"})
            .then(response => response.json())
            .then(res => {
                if(res.ok){
                    location.href = "/";
                }else{
                    this.setState({
                        alertVisible: true,
                        errorAlertMsg: res.msg || "",
                        errorAlertExtMsg: res.extmsg || ""
                    });
                }
            })
            .catch(err => {
                this.setState({
                    alertVisible: true,
                    errorAlertMsg: err.msg || ""
                });
            });
        }
    }
    
    handleValueChanger(e, type){
        let state = this.state;
        state[type] = e.target.value;
        this.setState(state);
    }
    
    render(){
        const { style, bsStyle, btnStyle } = this.props;
        const { alertVisible, errorAlertMsg, user, password } = this.state;
        let loginButton;
        if(alertVisible){
            loginButton = <Alert bsStyle="danger" onDismiss={() => this.handleAlertDismiss() } dismissAfter={3000}>
                {errorAlertMsg}
            </Alert>;
        }else{
            loginButton = <div>
                <Button bsStyle={btnStyle} type='submit' block>登录</Button>
                <Button bsStyle={btnStyle} type='reset' block>取消</Button>
            </div>;
        }
        return <Panel header={<h3>用户登录</h3>} bsStyle={bsStyle} style={style}>
            <form onSubmit={(e) => this.handleLogin(e) }>
                <Input type='text' placeholder="账号" value={user} onChange={(e) => this.handleValueChanger(e, "name")} buttonBefore={<Button>账号</Button>}/>
                <Input type='password' placeholder="密码" password={password} onChange={(e) => this.handleValueChanger(e, "password")} buttonBefore={<Button>密码</Button>}/>
                {loginButton}
            </form>
        </Panel>
    }
}

UserLogin.propTypes = {
    style: React.PropTypes.object,
    bsStyle: React.PropTypes.string,
    btnStyle: React.PropTypes.string
};

UserLogin.defaultProps = {
    style: { width: 400, height: 250, margin: "200px auto" },
    bsStyle: "success",
    btnStyle: "info"
};

ReactDOM.render(
    <UserLogin />,
    document.getElementById('login_content')
);