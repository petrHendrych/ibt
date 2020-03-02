import axios from 'axios';
import {TRACK_LOADED, TRACKS_LOADED, TRACKS_LOADING} from "./types";
import {tokenConfig} from "./auth";

// GET USER'S TRACKS
export const getTracks = () => async (dispatch, getState) => {
    dispatch({type: TRACKS_LOADING});

    let response = await axios.get("http://localhost:8000/api/tracks/", tokenConfig(getState));

    dispatch({ type: TRACKS_LOADED, payload: response.data});
};

export const getTrack = (id) => async (dispatch, getState) => {
    dispatch({type: TRACKS_LOADING});

    let response = await axios.get(`http://localhost:8000/api/tracks/${id}`, tokenConfig(getState));

    dispatch({ type: TRACK_LOADED, payload: response.data});
};