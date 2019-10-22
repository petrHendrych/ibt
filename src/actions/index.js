export const selectPoint = point => {
    return {
        type: 'POINT_SELECTED',
        payload: point
    }
};