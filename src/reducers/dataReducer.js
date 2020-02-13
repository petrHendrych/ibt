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
        case 'UPDATE_POINT':
            let pom =  [...state.features[1].geometry.coordinates];
            pom[action.payload.index][0] = action.payload.val.lat;
            pom[action.payload.index][1] = action.payload.val.lng;
            state.features[1].geometry.coordinates = pom;
            return {...state};
        default:
            return state;
    }
};