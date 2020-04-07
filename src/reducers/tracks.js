import {
    TRACKS_LOADING,
    TRACKS_LOADED,
    TRACK_LOADED,
    TRACKS_CLEAR,
    TRACK_CLEAR,
    UPDATE_POINT,
    DELETE_TRACK,
    DELETE_POINT,
    DELETE_POINTS, INSERT_POINT
} from "../actions/types";

const initialState = {
    isLoading: false,
    data: null,
    track: {}
};

export default function (state = initialState, action) {
    const copTr = JSON.parse(JSON.stringify(state.track));

    switch (action.type) {
        case TRACKS_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case TRACKS_LOADED:
            return {
                ...state,
                isLoading: false,
                data: action.payload
            };
        case TRACKS_CLEAR:
            return {
                ...state,
                isLoading: false,
                data: null,
                track: {}
            };
        case TRACK_LOADED:
            return {
                ...state,
                isLoading: false,
                track: action.payload
            };
        case TRACK_CLEAR:
            return {
                ...state,
                isLoading: false,
                track: {}
            };
        case DELETE_TRACK:
            return {
                ...state,
                data: state.data.filter(track => track.id !== action.payload)
            };
        case UPDATE_POINT:
            copTr.geometry.coordinates[0][action.index] = [action.val.lat, action.val.lng];
            return {
                ...state,
                track: copTr
            };
        case INSERT_POINT:
            const date = new Date();

            copTr.geometry.coordinates[0].splice(action.index, 0, action.val);
            copTr.properties.elevations.splice(action.index, 0, copTr.properties.elevations[action.index]);
            copTr.properties.times.splice(action.index, 0, date.toISOString());
            return {
                ...state,
                track: copTr
            };
        case DELETE_POINT:
            copTr.geometry.coordinates[0].splice(action.index, 1);
            copTr.properties.elevations.splice(action.index, 1);
            copTr.properties.times.splice(action.index, 1);
            return {
                ...state,
                track: copTr
            };
        case DELETE_POINTS:
            const copyTrack = Object.assign({}, state.track);
            const filterPoints = [...state.track.geometry.coordinates[0]];
            copyTrack.geometry.coordinates[0] = filterPoints;
            for (let i = action.indexes.length - 1; i >= 0; i--) {
                filterPoints.splice(action.indexes[i], 1);
            }
            return {
                ...state,
                track: copyTrack
            };
        default:
            return state;
    }
}