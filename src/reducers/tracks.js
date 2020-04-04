import {
    TRACKS_LOADING, TRACKS_LOADED, TRACK_LOADED, TRACKS_CLEAR, TRACK_CLEAR, UPDATE_POINT, DELETE_TRACK
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
            const copyTrack = [...state.track.geometry.coordinates[0]];
            cTrack.geometry.coordinates[0] = copyTrack;
            copyTrack[action.index] = [action.val.lat, action.val.lng];
            return {
                ...state,
                track: cTrack
            };
        default:
            return state;
    }
}