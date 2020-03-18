export const selectPoint = pointIndex => {
    return {
        type: 'POINT_SELECTED',
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
        type: 'UPDATE_POINT',
        payload: {
            index: index,
            val: val
        }
    }
};
