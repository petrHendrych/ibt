import axios from 'axios';
import {FILES_LOADING, GET_FILES} from './types';
import {tokenConfig} from "./auth";
import {getTracks} from "./tracks";

// GET LIST OF USER'S FILES
export const getFiles = () => async (dispatch, getState) => {
    dispatch({ type: FILES_LOADING});

    let response = await axios.get("http://localhost:8000/api/files/", tokenConfig(getState));

    dispatch({ type: GET_FILES, payload: response.data });
};

// UPLOAD NEW FILE
export const uploadFile = (file, title) => (dispatch, getState) => {
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

    axios.post("http://localhost:8000/api/files/", data, config)
        .then(() => {
            dispatch(getFiles());
            dispatch(getTracks());
        })
        .catch((e) => {
            console.log(e);
        })
};