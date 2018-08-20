import {
    createStore as _createStore,
    applyMiddleware,
    compose
} from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import {
    routerMiddleware
} from 'react-router-redux';
import {
    reduxSearch
} from 'redux-search';
import thunk from 'redux-thunk';

export default function createStore(history, client, data) {
    // Sync dispatched route actions to the history
    const reduxRouterMiddleware = routerMiddleware(history);

    const middleware = [createMiddleware(client), reduxRouterMiddleware, thunk];

    let finalCreateStore;
    if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
        const {
            persistState
        } = require('redux-devtools');
        const DevTools = require('../containers/DevTools/DevTools');
        finalCreateStore = compose(
            applyMiddleware(...middleware),
            window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        )(_createStore);
    } else {
        finalCreateStore = applyMiddleware(...middleware)(_createStore);
    }

    const reducer = require('./modules/reducer');

    const enhancer = compose(
        applyMiddleware(...middleware),
        reduxSearch({
            // Configure redux-search by telling it which resources to index for searching
            resourceIndexes: {
                // In this example Books will be searchable by :title and :author
                books: ['author', 'title']
            },
            // This selector is responsible for returning each collection of searchable resources
            resourceSelector: (resourceName) => {
                // In our example, all resources are stored in the state under a :resources Map
                // For example "books" are stored under state.resources.books
                //        return state.resources.get(resourceName);
                return resourceName;
            }
        })
    );

    const store = finalCreateStore(reducer, data, enhancer);


    if (__DEVELOPMENT__ && module.hot) {
        module.hot.accept('./modules/reducer', () => {
            store.replaceReducer(require('./modules/reducer'));
        });
    }

    return store;
}