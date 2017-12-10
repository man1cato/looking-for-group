//INTERESTS REDUCER
const interestsReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_INTERESTS':
            return action.interests;
        default:
            return state;
    }
};

export default interestsReducer;