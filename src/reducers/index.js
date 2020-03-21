import {SELECT_POINT, UNSELECT_POINT} from "../actions/types";

import { combineReducers } from 'redux';
import auth from "./auth";
import errors from "./errors";
import files from "./files";
import tracks from "./tracks";

const selectedPointReducer = (selectedPoint = null, action) => {
    if (action.type === SELECT_POINT) {
        if (selectedPoint === action.payload) {
            return null;
        }
        return action.payload;
    }

    if (action.type === UNSELECT_POINT) {
        return null;
    }

    return selectedPoint;
};

const getBoundsReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_POINT_LAT_LNG':
            if (state.length === 2) {
                return [action.payload];
            }
            return [...state, action.payload];
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
    tracks: tracks
});