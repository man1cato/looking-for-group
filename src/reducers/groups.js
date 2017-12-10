//GROUPS REDUCER
const groupsReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_GROUPS':
            return action.groups;
        default: 
            return state;
    }
};

export default groupsReducer;