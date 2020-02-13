import React, { Component } from 'react';
import {BrowserRouter} from "react-router-dom";
import {Route} from "react-router";


import MapView from './views/MapView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import './stylesheets/style.css'

import { loadUser } from "./actions/auth";
import { store } from './index';

export default class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Route exact path="/" component={MapView} />
                <Route path="/login" component={LoginView}/>
                <Route path="/register" component={RegisterView}/>
            </BrowserRouter>
        );
    }
}