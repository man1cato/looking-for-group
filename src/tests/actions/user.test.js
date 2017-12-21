import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import user from '../fixtures/user';
import {setUser, startSetUser, startUpdateUser} from '../../actions/user';

const uid = user.firebaseId;
const defaultAuthState = { auth: {uid} };
const createMockStore = configureMockStore([thunk]);


test('should setup set user action object with provided values', () => {
    const action = setUser(user);
    expect(action).toEqual({
        type: 'SET_USER',
        user
    });
});


// test('should retrieve user data from Airtable', () => {
//     const action = startSetUser({uid, email: user.email});
    
// });


// test('should create new user in Airtable when new user logs in', () => {
//     const action = startUpdateUser({uid: 'weatjnad', email: 'newuser@mail.com'});
    
// });