//AVAILABILITY REDUCER
const availabilitiesReducer = (state = [], action) => {
    switch(action.type) {
        case 'GET_AVAILABILITIES':
            return action.availabilities;
        default:
            return state;    
    }
};

export default availabilitiesReducer;