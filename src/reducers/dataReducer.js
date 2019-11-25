export default (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_DATA':
            const arr = action.payload;
            arr.features[1].geometry.coordinates = arr.features[1].geometry.coordinates.map((item) => {
                    [item[0], item[1]] = [item[1], item[0]];
                    return item;
                }
            );
            return arr;
        default:
            return state;
    }
};