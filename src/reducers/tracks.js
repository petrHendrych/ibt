import {
    TRACKS_LOADING, TRACKS_LOADED, TRACK_LOADED, TRACKS_CLEAR
} from "../actions/types";

const initialState = {
    isLoading: false,
    data: null,
    track: null
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
        case TRACK_LOADED:
            return {
                ...state,
                isLoading: false,
                track: action.payload
            };
        case TRACKS_CLEAR:
            return {
                ...state,
                isLoading: false,
                data: null,
                track: null
            };
        default:
            return state;
    }
}