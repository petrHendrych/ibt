import React, { Component } from 'react';
import {BrowserRouter} from "react-router-dom";
import {Route} from "react-router";

import {Provider} from "react-alert";
import AlertTemplate from 'react-alert-template-basic';

import MapView from './views/MapView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import './stylesheets/style.css'

import { loadUser } from "./actions/auth";
import { store } from './index';

const alertConfig = {
    timeout: 3000,
    zindex: 9999,
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
                    <Route exact path="/" component={MapView} />
                    <Route path="/login" component={LoginView}/>
                    <Route path="/register" component={RegisterView}/>
                </BrowserRouter>
            </Provider>
        );
    }
}