//USER REDUCER
const userReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.user;
        case 'UPDATE_USER':
            return action.user;
        case 'UPDATE_USER_AREA':
            return action.area;   
        case 'UPDATE_USERS_GROUPS':
            return action.groups;
        default:
            return state;
    }
};

export default userReducer;