import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';

import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import getRoutes from './routes';

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
    target: targetUrl,
    ws: true
});

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'test.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static')));
app.use(i18nMiddleware.handle(i18n))

server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
    let json;
    if (error.code !== 'ECONNRESET') {
        console.error('proxy error', error);
    }
    if (!res.headersSent) {
        res.writeHead(500, {
            'content-type': 'application/json'
        });
    }

    json = {
        error: 'proxy_error',
        reason: error.message
    };
    res.end(JSON.stringify(json));
});

var virtualHosts = require('./vhosts.json');
virtualHosts.forEach(function (virtualHost) {
    const app2 = new Express();
    // app2.use(favicon(path.join(__dirname, virtualHost.path, '..', 'static', 'test.ico')));
    app2.get('/siteUrl', (req, res) => {
        res.json({
            siteUrl: virtualHost.path
        })
    });
    app2.use((req, res) => {
        if (__DEVELOPMENT__) {
            let compiler = webpack(webpackConfig);

            app.use(require('webpack-dev-middleware')(compiler, {
                noInfo: true,
                publicPath: webpackConfig.output.publicPath,
                stats: {
                    colors: true
                }
            }));

            app.use(require('webpack-hot-middleware')(compiler));
        }

    const client = new ApiClient(req);
    const memoryHistory = createHistory(req.originalUrl);
    const store = createStore(memoryHistory, client);
    const history = syncHistoryWithStore(memoryHistory, store);
    store.siteUrl = virtualHost.path;

    function hydrateOnClient() {
        res.send('<!doctype html>\n' + ReactDOM.renderToString( <Html store={store} serverRequest={req} />));
    }

    if (__DISABLE_SSR__) {
        hydrateOnClient();
        return;
    }

    match({
        history,
        routes: getRoutes(store, virtualHost.path),
        location: req.originalUrl
    }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
            res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            console.error('ROUTER ERROR:', pretty.render(error));
            res.status(500);
            hydrateOnClient();
        } else if (renderProps) {
            loadOnServer({
                ...renderProps,
                store,
                helpers: {
                    client
                }
            }).then(() => {
                const component = (
                    <Provider store = {store} key = "provider" >
                        <ReduxAsyncConnect { ...renderProps}/>
                    </Provider >
                );

                res.status(200);

                global.navigator = {
                    userAgent: req.headers['user-agent']
                };

                res.send('<!doctype html>\n' + ReactDOM.renderToString( <Html component={component} serverRequest={req} store={store}/>));
                });
            } else {
                res.status(404).send('Not found');
            }
        });
    });
    app.use(vhost(virtualHost.domain, app2));
});

if (config.port) {
    server.listen(config.port, (err) => {
        if (err) {
            console.error(err);
        }
        console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
        console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
    });
} else {
    console.error('==>     ERROR: No PORT environment variable has been specified');
}