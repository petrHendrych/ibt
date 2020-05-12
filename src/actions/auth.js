import axios from 'axios';
import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    FILES_CLEAR, TRACKS_CLEAR, GET_ERRORS
} from './types';

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING});

    axios.get("http://localhost:8000/auth/user", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        }).catch(err => {
            const errors = {
                msg: err.response.data,
                status: err.response.status
            };
            dispatch({
                type: GET_ERRORS,
                payload: errors
            });
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

    axios.post("http://localhost:8000/auth/login", body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
        }).catch(err => {
            const errors = {
                msg: err.response.data,
                status: err.response.status
            };
            dispatch({
                type: GET_ERRORS,
                payload: errors
            });
            dispatch({
                type: LOGIN_FAIL
            });
        });
};

// REGISTER USER
export const registerUser = ({username, email, password}) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Request Body
    const body = JSON.stringify({ username, email, password });

    axios.post("http://localhost:8000/auth/register", body, config)
        .then(res => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        }).catch(err => {
            console.log(err);
        const errors = {
            msg: err.response.data,
            status: err.response.status
        };
        dispatch({
            type: GET_ERRORS,
            payload: errors
        });
        dispatch({
            type: REGISTER_FAIL
        });
    });
};

// LOGOUT USER
export const logoutUser = () => (dispatch, getState) => {
       axios.post("http://localhost:8000/auth/logout", null, tokenConfig(getState))
        .then(_ => {
            dispatch({
                type: LOGOUT_SUCCESS,
            });
            dispatch({
                type: FILES_CLEAR,
            });
            dispatch({
                type: TRACKS_CLEAR,
            });
        }).catch(err => {
            console.log(err);
    });
};

export const tokenConfig = (getState) => {
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

    return config;
};

export const invalidPasswords = () => dispatch =>{
    const errors = {
        msg: {pass: ["Passwords aren't same"]},
        status: 401
    };
    dispatch({
        type: GET_ERRORS,
        payload: errors
    });
};