//AREAS REDUCER
const areasReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_AREAS':
            return action.areas;
        default: 
            return state;
    }
};

export default areasReducer;