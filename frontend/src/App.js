import React, { Component } from 'react';
import {BrowserRouter} from "react-router-dom";
import {Route, Switch} from "react-router";

import {Provider} from "react-alert";
import AlertTemplate from 'react-alert-template-basic';

import MainView from './views/MainView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import ErrorView from './views/ErrorView';
import './stylesheets/style.css'

import { loadUser } from "./actions/auth";
import { store } from './index';

const alertConfig = {
    timeout: 3000,
    containerStyle: {
        zIndex: 99999,
        width: '150px'
    },
    transition: 'scale',
    position: 'top center'
};

export default class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider template={AlertTemplate} {...alertConfig}>
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Switch>
                        <Route exact path="/" component={MainView} />
                        <Route exact path="/login" component={LoginView}/>
                        <Route exact path="/register" component={RegisterView}/>
                        <Route path="*" component={ErrorView}/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}