import {TRACK_PARTITION_CLEAR, TRACK_PARTITION_LOADED, TRACK_PARTITION_LOADING} from "../actions/types";

const initialState = {
    data: {},
    isLoading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TRACK_PARTITION_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case TRACK_PARTITION_LOADED:
            return {
                ...state,
                isLoading: false,
                data: action.payload
            };
        case TRACK_PARTITION_CLEAR:
            return initialState;
        default:
            return state;
    }
};