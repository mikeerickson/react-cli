import React from 'react';import { render } from 'react-dom';import { Router, Route, IndexRoute } from 'react-router';import MainMenu from '../components/MainMenu';import Comptest from '../components/Comptest';import '../stylesheets/bootstrap.css';render(<Router>        <Route path="/" component={MainMenu}>            <IndexRoute component={Comptest}/>            <Route path="comptest" component={Comptest}/>        </Route>    </Router>,    document.getElementById("index_content"));