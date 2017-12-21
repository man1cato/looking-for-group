import userReducer from '../../reducers/user';
import user from '../fixtures/user';


describe('The User Reducer', () => {
    test('should set the default state', () => {
        const state = userReducer(undefined, {type: '@@INIT'});
        expect(state).toEqual({
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
        });
    });
});
