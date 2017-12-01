import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import user from '../fixtures/user';
import {startSetUser} from '../../actions/user';

const uid = 'abc123';
const defaultAuthState = { auth: {uid} };
const createMockStore = configureMockStore([thunk]);


test('should retrieve correct datatypes', () => {
    const store = createMockStore(defaultAuthState);
    store.dispatch(startSetUser(user)).then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: 'UPDATE_USER',
            user
        });
        expect(typeof actions[0].user.birthYear).toBe('number');
    });
    
})