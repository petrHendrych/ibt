import axios from 'axios';
import {
    DELETE_TRACK,
    TRACK_PARTITION_LOADED,
    TRACK_LOADED,
    TRACKS_CLEAR,
    TRACKS_LOADED,
    TRACKS_LOADING,
    TRACK_PARTITION_LOADING, TRACK_LOADING, GET_ERRORS
} from "./types";
import {tokenConfig} from "./auth";
import { saveAs } from 'file-saver';

// GET USER'S TRACKS
export const getTracks = () => async (dispatch, getState) => {
    dispatch({type: TRACKS_LOADING});

    try {
        let response = await axios.get("http://localhost:8000/api/tracks/", tokenConfig(getState));
        dispatch({ type: TRACKS_LOADED, payload: response.data});
    } catch (error) {
        dispatch({type: TRACKS_CLEAR});
    }

};

// GET USER'S TRACK
export const getTrack = (id) => async (dispatch, getState) => {
    dispatch({type: TRACK_LOADING});

    try {
        let response = await axios.get(`http://localhost:8000/api/tracks/${id}`, tokenConfig(getState));
        dispatch({ type: TRACK_LOADED, payload: response.data});
    } catch (error) {
        console.log(error);
    }

};

// GET USER'S TRACK'S PARTITION IN BOUNDS
export const getTrackPartition = (id, bounds) => async (dispatch, getState) => {
    const _bounds = {"bounds": bounds};

    dispatch({ type: TRACK_PARTITION_LOADING});

    try {
        let response = await axios.post(`http://localhost:8000/api/tracks/${id}/partition`, _bounds, tokenConfig(getState));
        dispatch({ type: TRACK_PARTITION_LOADED, payload: response.data });
    } catch (error) {
        console.log(error);
    }
};

// UPDATE TRACK POINTS
export const updateTrack = (id) => async (dispatch, getState) => {
    const trk = getState().tracks.track;
    dispatch({type: TRACK_LOADING});

    try {
        let response = await axios.put(`http://localhost:8000/api/tracks/${id}`, trk, tokenConfig(getState));
        dispatch({type: TRACK_LOADED, payload: response.data});
    } catch (e) {
        const errors = {
            msg: e.response.data,
            status: e.response.status
        };
        dispatch({
            type: GET_ERRORS,
            payload: errors
        });
        if (e.response.status === 400) {
            dispatch({
                type: TRACK_LOADED,
                payload: trk
            })
        }
    }
};

// DELETE TRACK
export const deleteTrack = (id) =>  async (dispatch, getState) => {

    try {
        await axios.delete(`http://localhost:8000/api/tracks/${id}`, tokenConfig(getState));
        dispatch({type: DELETE_TRACK, payload: id});
        dispatch(getTracks());
    } catch (err) {
        console.log(err);
    }
};

// DOWNLOAD TRACK
export const downloadTrack = () => async (dispatch, getState) => {
    const trk = getState().tracks.track;

    try {
        let response = await axios.post(`http://localhost:8000/download`, trk, tokenConfig(getState));
        let blob = new Blob([response.data], {type: "text/gpx+xml"});
        saveAs(blob, `${trk.properties.name}.gpx`);
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
};