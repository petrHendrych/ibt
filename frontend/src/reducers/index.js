/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Main reducer file to combine them
 */

import {BOUNDS_CLEAR, SELECT_POINT, UNSELECT_POINT} from "../actions/types";

import { combineReducers } from 'redux';
import auth from "./auth";
import errors from "./errors";
import files from "./files";
import tracks from "./tracks";
import partitions from "./partitions";

const selectedPointReducer = (state = null, action) => {
    if (action.type === SELECT_POINT) {
        if (state === action.payload) {
            return null;
        }
        return action.payload;
    }

    if (action.type === UNSELECT_POINT) {
        return null;
    }

    return state;
};

const getBoundsReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_POINT_LAT_LNG':
            if (state.length === 2) {
                return [action.payload];
            }
            return [...state, action.payload];
        case BOUNDS_CLEAR:
            return [];
        default:
            return state;
    }
};

export default combineReducers({
    selectedIndex: selectedPointReducer,
    bounds: getBoundsReducer,
    auth: auth,
    errors: errors,
    files: files,
    tracks: tracks,
    partition: partitions
});