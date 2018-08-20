import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getRoute } from './route';
declare let module: any;

ReactDOM.render((
getRoute()
), document.getElementById('root'));

    // Authorize Typescript to use automatic reload from webpack (HotModuleReplacementPlugin)
    if (module.hot) {
        module.hot.accept();
    }