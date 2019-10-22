export const selectPoint = pointIndex => {
    return {
        type: 'POINT_SELECTED',
        payload: pointIndex
    }
};