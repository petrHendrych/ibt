import axios from 'axios';

export const selectPoint = pointIndex => {
    return {
        type: 'POINT_SELECTED',
        payload: pointIndex
    }
};

export const fetchData = () => async dispatch => {
    let response = await axios.get('https://api.myjson.com/bins/ukcwk');

    dispatch({ type: 'FETCH_DATA', payload: response.data });
};

// export const getPointLatLng = (e) => {
//     return {
//         type: 'GET_POINT_LAT_LNG',
//         payload: e.latlng
//     }
// };
