import {UPDATE_POINT} from "../actions/types";

const initialState = {
    index: null,
    val: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_POINT:
            return {
                ...state,
                index: action.payload.index,
                val: action.payload.val
            };
        default:
            return state;
    }
}