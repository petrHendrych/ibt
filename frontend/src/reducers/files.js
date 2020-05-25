/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Reducers for files actions
 */

import {FILES_LOADING, FILES_LOADED, FILES_CLEAR, FILE_DELETE} from "../actions/types";

const initialState = {
    filesIsLoading: false,
    data: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case FILES_LOADING:
            return {
                ...state,
                filesIsLoading: true
            };
        case FILES_LOADED:
            return {
                ...state,
                filesIsLoading: false,
                data: action.payload
            };
        case FILE_DELETE:
            return {
                ...state,
                data: state.data.filter(file => file.id !== action.payload)
            };
        case FILES_CLEAR:
            return {
                ...state,
                filesIsLoading: false,
                data: null
            };
        default:
            return state;
    }
};