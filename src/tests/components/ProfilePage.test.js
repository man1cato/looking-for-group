import React from 'react';
import {shallow} from 'enzyme';
import {ProfilePage} from '../../components/ProfilePage';
import user from '../fixtures/user';

let startUpdateUser, history, wrapper;

beforeEach(() => {
    startUpdateUser = jest.fn();
    history = { push: jest.fn() };
    wrapper = shallow(
        <ProfilePage
            startUpdateUser={startUpdateUser}
            user={user}
        />
    );
});

test('should render ProfilePage correctly', () => {
    expect(wrapper).toMatchSnapshot();
});

test('should handle startUpdateUser', () => {
    wrapper.find('ProfilePage').prop('onSubmit')(user);
    expect(history.push).toHaveBeenLastCalledWith('/');
    expect(startUpdateUser).toHaveBeenLastCalledWith(user);
});

// test('Enter userRecordId and return postal code', async () => {
//     var userRecordId = 'recxN6MeBrh2lRCfW';
//     var postalCode = '24015';
    
//     const response = await getPostalCode(userRecordId);
//     expect(response).toBe(postalCode);
   
// });


// test('Enter postal code and return location details', () => {
//     var postalCode = '24015';
//     var country = 'US';
//     var state = 'VA';
//     var county = 'Roanoke';
//     var city = 'Roanoke';
//     var lat = 37.2508019;
//     var lng = -79.9808143;
    
//     getLocationDetails(postalCode).then((locationDetails) => {
//         expect(locationDetails).toMatchObject({
//             postalCode,
//             country,
//             state,
//             county,
//             city,
//             lat,
//             lng
//         });
//     });
// });

// test('Enter location details and return MSA Code', () => {
//     var locationDetails = {
//         postalCode : '24015',
//         country : 'US',
//         state : 'VA',
//         county : 'Roanoke',
//         city : 'Roanoke',
//         lat : 37.2508019,
//         lng : -79.9808143
//     };
    
//     getMSACode(locationDetails).then((msaCode)=>{
//         expect(msaCode).toBe('40220');
//     });
// });

// test('Enter MSA code and return area record ID', () => {
//     var msaCode = '40220';
    
//     getAreaRecordId(msaCode).then((areaRecordId)=>{
//         expect(areaRecordId).toBe('rec9sdndkH9ZaQBqh');
//     });
// })