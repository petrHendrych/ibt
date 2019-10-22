import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import * as serviceWorker from './serviceWorker';

import App from './App';
import reducers from './reducers';

const loggerMiddleware = store => next => action => {
    console.group(action.type);
    console.info("Action", action);
    const result = next(action);
    console.log("Next state", store.getState());
    console.groupEnd();
    return result;
};

ReactDOM.render(
    <Provider store={createStore(reducers, applyMiddleware(loggerMiddleware))}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
