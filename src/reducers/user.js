//USER REDUCER

const userReducerDefaultState = {                                                  //DEFINE USER OBJECT
    recordId: '',
    firstName: '',
    lastName: '',
    email: '',
    postalCode: '',
    birthYear: 1990,
    interest1: '',
    interest2: '',
    interest3: '',
    additionalInterests: [],
    allInterests: [],
    availability: [],
    area: '',
    groups: []
};

const userReducer = (state = userReducerDefaultState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.user;
        default:
            return state;
    }
};

export default userReducer;