/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Reducers for track actions (deleting points, tracks, loading etc.)
 */

import {
    TRACKS_LOADING,
    TRACKS_LOADED,
    TRACK_LOADED,
    TRACKS_CLEAR,
    TRACK_CLEAR,
    UPDATE_POINT,
    DELETE_TRACK,
    DELETE_POINT,
    DELETE_POINTS, INSERT_POINT, TRACK_LOADING, EDIT_TRACK_NAME
} from "../actions/types";

const initialState = {
    trackListIsLoading: false,
    trackIsLoading: false,
    data: null,
    track: {}
};

export default function (state = initialState, action) {
    const copTr = JSON.parse(JSON.stringify(state.track));

    switch (action.type) {
        case TRACKS_LOADING:
            return {
                ...state,
                trackListIsLoading: true
            };
        case TRACK_LOADING:
            return {
                ...state,
                trackIsLoading: true
            };
        case TRACKS_LOADED:
            return {
                ...state,
                trackListIsLoading: false,
                data: action.payload
            };
        case TRACKS_CLEAR:
            return initialState;
        case TRACK_LOADED:
            return {
                ...state,
                trackIsLoading: false,
                track: action.payload
            };
        case TRACK_CLEAR:
            return {
                ...state,
                track: {}
            };
        case DELETE_TRACK:
            return {
                ...state,
                data: state.data.filter(track => track.id !== action.payload)
            };
        case UPDATE_POINT:
            copTr.geometry.coordinates[action.index] = [action.val.lat, action.val.lng];
            return {
                ...state,
                track: copTr
            };
        case INSERT_POINT:
            const startDate = copTr.properties.times[action.index];
            const endDate = copTr.properties.times[action.index-1];

            copTr.geometry.coordinates.splice(action.index, 0, action.val);
            if (!checkEmptyElevation(copTr.properties.elevations)) {
                copTr.properties.elevations.splice(action.index, 0, copTr.properties.elevations[action.index]);
            }
            if (!checkEmptyTime(copTr.properties.times)) {
                copTr.properties.times.splice(action.index, 0, getMiddleTime(startDate,endDate));
            }
            return {
                ...state,
                track: copTr
            };
        case DELETE_POINT:
            copTr.geometry.coordinates.splice(action.index, 1);
            copTr.properties.elevations.splice(action.index, 1);
            copTr.properties.times.splice(action.index, 1);
            return {
                ...state,
                track: copTr
            };
        case DELETE_POINTS:
            for (let i = action.indexes.length - 1; i >= 0; i--) {
                copTr.geometry.coordinates.splice(action.indexes[i], 1);
                copTr.properties.elevations.splice(action.indexes[i], 1);
                copTr.properties.times.splice(action.indexes[i], 1);
            }
            return {
                ...state,
                track: copTr
            };
        case EDIT_TRACK_NAME:
            copTr.properties.name = action.name;
            return {
                ...state,
                track: copTr
            };
        default:
            return state;
    }
}

function checkEmptyElevation(ele) {
    return !(ele && ele.length > 0);
}

function checkEmptyTime(time) {
    return !(time && time.length > 0);
}

function getMiddleTime(startTime, endTime) {
    const a = new Date(startTime);
    const b = new Date(endTime);

    return new Date((a.getTime() + b.getTime()) / 2).toISOString();

}