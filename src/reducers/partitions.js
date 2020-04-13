import {
    PARTITION_DELETE_POINT, PARTITION_DELETE_POINTS,
    TRACK_PARTITION_CLEAR,
    TRACK_PARTITION_LOADED,
    TRACK_PARTITION_LOADING
} from "../actions/types";

const initialState = {
    indexes: [],
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
                indexes: action.payload.indexes,
            };
        case PARTITION_DELETE_POINT:
            return {
                ...state,
                indexes: state.indexes.filter(val => val !== action.index)
            };
        case PARTITION_DELETE_POINTS:
            let arr = state.indexes;
            for (let i = action.indexes.length - 1; i >= 0; i--) {
                const idx = arr.indexOf(action.indexes[i]);
                arr.splice(idx, 1);
            }
            return {
                ...state,
                indexes: arr
            };
        case TRACK_PARTITION_CLEAR:
            return initialState;
        default:
            return state;
    }
};