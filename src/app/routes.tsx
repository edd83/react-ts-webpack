import React from 'react';
import { Route } from 'react-router';
import { App } from './containers/App';
import { Home } from './containers/Home';

export default (store: any, path: string) => {
    return (
        <Route path=":lang">
            <Route path="/" component={App} siteUrl={path}>
                {/* Home (main) route */}
                <Route exact path="/" component={Home} siteUrl={path} />

                {/* Routes */}
                <Route path="/404" component={Home} status={404} siteUrl={path} />
                <Route path="/:unknow" component={Home} status={404} siteUrl={path} />
            </Route>
        </Route>
    );
};