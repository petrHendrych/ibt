/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Contains functions to handle user requests
 */

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
import {getFiles} from "./files";
import {getTracks} from "./tracks";

/**
 * Get information about logged user
 * If response return valid user then get his files and tracks
 * @returns {Function}
 */
export const loadUser = () => async (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING});

    try {
        let response = await axios.get("http://localhost:8000/auth/user", tokenConfig(getState));
        dispatch({type: USER_LOADED, payload: response.data});
        await dispatch(getFiles());
        dispatch(getTracks());
    } catch (err) {
        const errors = {
            msg: err.response.data,
            status: err.response.status
        };
        dispatch({type: GET_ERRORS, payload: errors});
        dispatch({type: AUTH_ERROR});
    }
};

/**
 * Function to send login request to server
 * If login is successful load user's files and tracks
 *
 * @param username
 * @param password
 * @returns {Function}
 */
export const loginUser = (username, password) => async dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Request Body
    const body = JSON.stringify({ username, password });

    try {
        let response = await axios.post("http://localhost:8000/auth/login", body, config);
        dispatch({type: LOGIN_SUCCESS, payload: response.data});
        await dispatch(getFiles());
        dispatch(getTracks());
    } catch (err) {
        const errors = {
            msg: err.response.data,
            status: err.response.status
        };
        dispatch({type: GET_ERRORS, payload: errors});
        dispatch({type: LOGIN_FAIL});
    }
};

/**
 * Function to send information about new user's registration
 *
 * @param username
 * @param email
 * @param password
 * @returns {Function}
 */
export const registerUser = ({username, email, password}) => async dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Request Body
    const body = JSON.stringify({ username, email, password });

    try {
        let response = await axios.post("http://localhost:8000/auth/register", body, config);
        dispatch({type: REGISTER_SUCCESS, payload: response.data});
    } catch (err) {
        const errors = {
            msg: err.response.data,
            status: err.response.status
        };
        dispatch({type: GET_ERRORS, payload: errors});
        dispatch({type: REGISTER_FAIL});
    }
};

/**
 * Function to send request to logout current user
 * @returns {Function}
 */
export const logoutUser = () => async (dispatch, getState) => {
    try {
        await axios.post("http://localhost:8000/auth/logout", null, tokenConfig(getState));
        dispatch({type: LOGOUT_SUCCESS,});
        dispatch({type: FILES_CLEAR,});
        dispatch({type: TRACKS_CLEAR,});
    } catch (err) {
        const errors = {
            msg: err.response.data,
            status: err.response.status
        };
        dispatch({type: GET_ERRORS, payload: errors});
    }
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
        msg: {pass: ["Password doesn't match"]},
        status: 400
    };
    dispatch({
        type: GET_ERRORS,
        payload: errors
    });
};