import React from 'react';
import { Route, IndexRoute } from 'react-router';

import MainMenu from './MainMenu';
import UserLogin from './UserLogin';
import UserList from './UserList';

const routes = (
    <Route path="/" component={MainMenu}>
        <IndexRoute component={UserList}/>
        <Route path="userlist" component={UserList}/>
        <Route path="*" component={UserList}/>
    </Route>
);

export default routes;