//AREAS REDUCER
const areasReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_AREAS':
            return {
                areas: action.areas
            };
        default: 
            return state;
    }
};

export default areasReducer;