//EVENTS REDUCER
const eventsReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_EVENTS':
            return action.events;
        case 'UPDATE_EVENTS':
            return action.events;
        default: 
            return state;
    }
};

export default eventsReducer;