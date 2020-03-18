import {
    TRACKS_LOADING, TRACKS_LOADED, TRACK_LOADED, TRACKS_CLEAR, TRACK_CLEAR
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
        case TRACKS_CLEAR:
            return {
                ...state,
                isLoading: false,
                data: null,
                track: {}
            };
        default:
            return state;
    }
}