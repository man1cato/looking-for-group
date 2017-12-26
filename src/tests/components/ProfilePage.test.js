import React from 'react';
import {shallow} from 'enzyme';
import {ProfilePage} from '../../components/ProfilePage';
import user from '../fixtures/user';
import interests from '../fixtures/interests';



test('should render ProfilePage correctly', () => {
    const startUpdateUser = jest.fn();
    const wrapper = shallow(
        <ProfilePage
            startUpdateUser={startUpdateUser}
            user={user}
            interests={interests}
        />);
    expect(wrapper).toMatchSnapshot();
});

test('should call all utils for valid form submission', () => {
    const getPlaceDetails = jest.fn();
    const geolocateUser = jest.fn();
    const wrapper = shallow(<ProfilePage user={user} onSubmit={onSubmitSpy} />);
    wrapper.find('form').simulate('submit', {
        preventDefault: () => {}
    });
    expect(getPlaceDetails).toHaveBeenCalledWith(user.recordId, user.postalCode);
    expect(geolocateUser).toHaveBeenCalledWith();
});



// test('should handle startUpdateUser', () => {
//     wrapper.find('ProfilePage').prop('onSubmit')(user);
//     expect(history.push).toHaveBeenLastCalledWith('/');
//     expect(startUpdateUser).toHaveBeenLastCalledWith(user);
// });

