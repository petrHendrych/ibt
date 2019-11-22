export default (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_DATA':
            const arr = action.payload;
            arr.features[1].geometry.coordinates = arr.features[1].geometry.coordinates.map((item) =>
                [item[0], item[1], item[2]] = [item[1], item[0], item[2]]
            );
            return arr;
        default:
            return state;
    }
};