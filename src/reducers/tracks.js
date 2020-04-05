import {
    TRACKS_LOADING,
    TRACKS_LOADED,
    TRACK_LOADED,
    TRACKS_CLEAR,
    TRACK_CLEAR,
    UPDATE_POINT,
    DELETE_TRACK,
    DELETE_POINT,
    DELETE_POINTS
} from "../actions/types";

const initialState = {
    isLoading: false,
    data: null,
    track: {}
};

export default function (state = initialState, action) {
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
            const cTrack = Object.assign({}, state.track);
            const copyPoints = [...state.track.geometry.coordinates[0]];
            cTrack.geometry.coordinates[0] = copyPoints;
            copyPoints[action.index] = [action.val.lat, action.val.lng];
            return {
                ...state,
                track: cTrack
            };
        case DELETE_POINT:
            const trk = {...state.track};
            const newPoints = [...state.track.geometry.coordinates[0]];
            trk.geometry.coordinates[0] = newPoints;
            newPoints.splice(action.index, 1);
            return {
                ...state,
                track: trk
            };
        case DELETE_POINTS:
            const copyTrack = Object.assign({}, state.track);
            const filterPoints = copyTrack.geometry.coordinates[0].filter((point, index) => index !== action.index);
            copyTrack.geometry.coordinates[0] = filterPoints;
            console.log(copyTrack);
            return {
                ...state,
            };
        default:
            return state;
    }
}