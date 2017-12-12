//AREA REDUCER
const areaReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_AREA':
            return action.area;
        default: 
            return state;
    }
};

export default areaReducer;