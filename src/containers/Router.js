import React from 'react';
import { Route, IndexRoute } from 'react-router';

import MainMenu from './MainMenu';
import Searcher from './UserSearcher';

const routes = (
    <Route path="/" component={MainMenu}>
        <IndexRoute component={Searcher}/>
        <Route path="searcher" component={Searcher}/>
        <Route path="*" component={Searcher}/>
    </Route>
);

export default routes;