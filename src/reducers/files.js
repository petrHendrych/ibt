import {FILES_LOADING, GET_FILES, FILES_CLEAR} from "../actions/types";

const initialState = {
    isLoading: false,
    data: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case FILES_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case GET_FILES:
            return {
                ...state,
                isLoading: false,
                data: action.payload
            };
        case FILES_CLEAR:
            return {
                ...state,
                isLoading: false,
                data: null
            };
        default:
            return state;
    }
};