/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Reducers to catch error responses from server
 *
 * All code followed from online tutorial
 * @url https://www.youtube.com/playlist?list=PLXE2Bj4edhg5fnlk8C8e-aEONQNPPuqNp
 */

import {GET_ERRORS} from "../actions/types";

const initialState = {
    msg: {},
    status: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status
            };
        default:
            return state;
    }
}