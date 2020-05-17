import axios from 'axios';
import {FILE_DELETE, FILES_LOADING, GET_ERRORS, GET_FILES} from './types';
import {tokenConfig} from "./auth";
import {getTracks} from "./tracks";

// GET LIST OF USER'S FILES
export const getFiles = () => async (dispatch, getState) => {
    dispatch({ type: FILES_LOADING});

    try {
        let response = await axios.get("http://localhost:8000/api/files/", tokenConfig(getState));
        dispatch({ type: GET_FILES, payload: response.data });
    } catch (e) {
        console.log(e);
    }

};

// UPLOAD NEW FILE
export const uploadFile = (file, title) => async (dispatch, getState) => {
    //Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    };

    // If token, add to headers config
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
    const data = new FormData();
    data.append('gpx_file', file);
    data.append('title', title);

    try {
        await axios.post("http://localhost:8000/api/files/", data, config);
        dispatch(getTracks());
    } catch (err) {
        const errors = {
            msg: err.response.data,
            status: err.response.status
        };
        dispatch({
            type: GET_ERRORS,
            payload: errors
        });
    }
    dispatch(getFiles());
};

// DELETE FILE
export const deleteFile = (id) => async (dispatch, getState) => {
    try {
        await axios.delete(`http://localhost:8000/api/files/${id}`, tokenConfig(getState));
        dispatch({type: FILE_DELETE, payload: id});
        dispatch(getTracks());
    } catch (err) {
        console.log(err);
    }
};