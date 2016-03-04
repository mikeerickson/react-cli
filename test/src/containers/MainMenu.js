import React, { Component } from 'react';import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Collapse } from 'react-bootstrap';import { LinkContainer } from 'react-router-bootstrap';import ReactCSSTransitionGroup from 'react-addons-css-transition-group';import { connect } from 'react-redux';import { pushState } from 'redux-router';import config from '../tools/host';import * as Actions from '../actions/Base';import { getCookie } from '../tools/auth';class MainMenu extends Component {        constructor(props, context) {        super(props, context);        this.state = {            aliasName: getCookie('user')        };    }        componentDidMount() {        const { dispatch } = this.props;        dispatch(Actions.getMainMenu());    }        handleLogout(){        location.href = config.host.local + "/logout";    }        render() {        const { base: { mmenu } } = this.props;        const navItems = mmenu.map((item, index) =>             <LinkContainer to={config.host.local + "/" + item.value} key={index}>                <NavItem eventKey={index}>{item.label}</NavItem>            </LinkContainer>        );        return(            <div>                <Navbar inverse staticTop fixedTop fluid>                    <Navbar.Header>                        <Navbar.Brand>                            <a href={hostconfig.local_host} style={{fontSize: 36, marginLeft: 30}}>React CLI</a>                        </Navbar.Brand>                        <Navbar.Toggle />                    </Navbar.Header>                    <Navbar.Collapse>                        <Nav pullRight role={1}>                            {navItems}                            <NavDropdown eventKey={2} title={"你好, " + this.state.aliasName} id="user">                                <MenuItem eventKey={2.1}>主页</MenuItem>                                <MenuItem divider />                                <NavItem eventKey={2.2} onSelect={this.handleLogout}>退出</NavItem>                            </NavDropdown>                        </Nav>                    </Navbar.Collapse>                </Navbar>                <div style={{marginTop: 60}}>                    {this.props.children}                </div>            </div>        );    }}export default connect(state => ({base: state.root.base}))(MainMenu)