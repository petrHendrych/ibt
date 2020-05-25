/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Reducers for partition actions
 */

import {
    PARTITION_DELETE_POINT, PARTITION_DELETE_POINTS,
    TRACK_PARTITION_CLEAR,
    TRACK_PARTITION_LOADED,
    TRACK_PARTITION_LOADING
} from "../actions/types";

const initialState = {
    indexes: [],
    partitionIsLoading: false,
    loaded: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TRACK_PARTITION_LOADING:
            return {
                ...state,
                partitionIsLoading: true
            };
        case TRACK_PARTITION_LOADED:
            return {
                ...state,
                partitionIsLoading: false,
                loaded: true,
                indexes: action.payload.indexes,
            };
        case PARTITION_DELETE_POINT:
            let tmp = state.indexes;

            for (let i = tmp.length - 1; i >=0; i--) {
                if (tmp[i] === action.index) {
                    tmp.splice(i, 1);
                    break;
                }
                tmp[i] = tmp[i] - 1;
            }
            return {
                ...state,
                indexes: tmp
            };
        case PARTITION_DELETE_POINTS:
            let arr = state.indexes;

            for (let i = action.indexes.length - 1; i >= 0; i--) {
                for (let j = arr.length - 1; j >= 0; j--) {
                    if (arr[j] === action.indexes[i]) {
                        arr.splice(j, 1);
                        break;
                    }
                    arr[j] = arr[j] - 1;
                }
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