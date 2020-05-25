/**
 * @author Petr Hendrych <xhendr03@stud.fit.vutbr.cz>
 * @file Contains functions to handle various requests about point changes
 */

import {
    DELETE_POINT,
    DELETE_POINTS, GET_ERRORS,
    INSERT_POINT,
    PARTITION_DELETE_POINT,
    PARTITION_DELETE_POINTS,
    SELECT_POINT,
    UPDATE_POINT
} from "./types";

export const selectPoint = pointIndex => {
    return {
        type: SELECT_POINT,
        payload: pointIndex
    }
};
export const getPointLatLng = point => {
    return {
        type: 'GET_POINT_LAT_LNG',
        payload: point
    }
};

export const updatePointLatLng = (index, val) => {
    return {
        type: UPDATE_POINT,
        index: index,
        val: val
    }
};

export const deletePoint = index => {
    return {
        type: DELETE_POINT,
        index: index
    }
};

export const deletePartitionPoint = index => {
    return {
        type: PARTITION_DELETE_POINT,
        index: index
    }
};

export const deletePoints = indexes => {
    return {
        type: DELETE_POINTS,
        indexes: indexes.sort((a,b) => a - b)
    }
};

export const deletePartitionPoints = indexes => {
    return {
        type: PARTITION_DELETE_POINTS,
        indexes: indexes.sort((a,b) => a - b)
    }
};

export const insertPoint = (index, value) => {
    return {
        type: INSERT_POINT,
        index: index,
        val: value
    }
};

export const pointsError = () => dispatch => {
    const errors = {
        msg: {pointsError: ["Track must contains at least 2 points"]},
        status: 400
    };
    dispatch({
        type: GET_ERRORS,
        payload: errors
    });
};