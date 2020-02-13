import axios from 'axios';
import {
    USER_LOADING, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS
} from './types';

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING});

    //Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // If token, add to headers config
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    axios.get("http://localhost:8000/api/auth/user", config)
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        }).catch(err => {
            dispatch({
                type: AUTH_ERROR
            });
    });
};

// LOGIN USER
export const loginUser = (username, password) => (dispatch) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Request Body
    const body = JSON.stringify({ username, password });

    axios.post("http://localhost:8000/api/auth/login", body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
        }).catch(err => {
        dispatch({
            type: LOGIN_FAIL
        });
    });
};

// LOGOUT USER
export const logoutUser = () => (dispatch, getState) => {
    //Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // If token, add to headers config
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    axios.post("http://localhost:8000/api/auth/logout", null, config)
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        }).catch(err => {
            console.log("logout");
    });
};