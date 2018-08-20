import * as React from 'react';
import { Hello } from './components/Hello';
import { Test } from './components/Test';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export function getRoute() {
    // when the url matches `/tacos` this component renders
    // const Tacos = ({ match }) => (
    //     // here's a nested div
    //     <div>
    //         {/* here's a nested Route,
    //     match.url helps us make a relative path */}
    //         <Route
    //             path={match.url + '/carnitas'}
    //             component={Carnitas}
    //         />
    //     </div>
    // )

    return (
        <Router>
            <Route component={Hello} path="/" compiler="Typescript" framework="React" bundler="Webpack">
                <Route component={Test} path="/qw" compiler="Typescript" framework="React" bundler="Webpack"/>
            </Route>
        </Router>
    );
}