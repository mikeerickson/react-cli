import React from 'react';
import { Route, IndexRoute } from 'react-router';

import MainMenu from './MainMenu';
import UserList from './UserList';
import Test from './Test';
import Demo from './Demo';

const routes = (
    <Route path="/" component={MainMenu}>
        <IndexRoute component={UserList}/>
        <Route path="user" component={UserList}/>
        <Route path="test" component={Test}/>
        <Route path="demo" component={Demo}/>
        <Route path="*" component={UserList}/>
    </Route>
);

export default routes;