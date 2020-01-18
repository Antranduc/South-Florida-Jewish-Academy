import React from "react";
import './index.css';
import Admin from './Admin'
import App from "./App";
import {Auth0Provider} from "./components/react-auth0-spa";
import config from "./auth_config.json";
import Header from "./components/Header";
import history from "./utils/history";
import Form from './Form';
import * as serviceWorker from './serviceWorker';
import {Route, BrowserRouter as Router, Redirect} from 'react-router-dom';
import ReactDOM from 'react-dom';


// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
    history.push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};
const routing = (
    <Router>
        <div>
            <Route exact path="/">
                <Redirect to="/admin"/>
            </Route>
            <Route exact path="/admin" component={Admin}/>
            <Route path="/form/:key" component={Form}/>
            <Route exact path="/header" component={Header}/>
        </div>
    </Router>
);

ReactDOM.render(
    <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
    >
        <App/>
    </Auth0Provider>,
    document.getElementById("root")
);