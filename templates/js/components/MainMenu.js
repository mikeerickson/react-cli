import React, { Component } from 'react';import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';import { LinkContainer } from 'react-router-bootstrap';class MainMenu extends Component {        constructor(props, context) {        super(props, context);        this.state = {            aliasName: "guest"        };    }        handleLogout(){        location.href = "/index";    }        render() {        return(            <div>                <Navbar staticTop fixedTop>                    <Navbar.Header>                        <Navbar.Brand>                            <a href="#">测试</a>                        </Navbar.Brand>                        <Navbar.Toggle />                    </Navbar.Header>                    <Navbar.Collapse>                        <Nav>                            <LinkContainer to="/comptest"><NavItem eventKey={5}>组件测试</NavItem></LinkContainer>                        </Nav>                        <Nav pullRight>                            <NavDropdown eventKey={3} title={"你好, " + this.state.aliasName} id="user">                                <MenuItem eventKey={3.1}>主页</MenuItem>                                <MenuItem divider />                                <NavItem eventKey={3.2} onSelect={this.handleLogout}>退出</NavItem>                            </NavDropdown>                        </Nav>                    </Navbar.Collapse>                </Navbar>                <div style={{marginTop: 10}}>                    {this.props.children}                </div>            </div>        );    }}export default MainMenu;