import { combineReducers } from 'redux';
import {pointsReducer} from './pointsReducer';
import dataReducer from './dataReducer';

const selectedPointReducer = (selectedPoint = null, action) => {
    if (action.type === 'POINT_SELECTED') {
        if (selectedPoint === action.payload) {
            return null;
        }
        return action.payload;
    }
    return selectedPoint;
};


export default combineReducers({
    points: pointsReducer,
    selectedIndex: selectedPointReducer,
    data: dataReducer
});