//AREAS REDUCER
const areasReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_AREAS':
            return action.areas;
        default: 
            return state;
    }
};

export default areasReducer;