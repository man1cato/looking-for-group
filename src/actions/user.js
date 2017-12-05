import axios from 'axios';
import geolocateUser from '../utils/geolocate-user-v3';

const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const apiKey= 'keyzG8AODPdzdkhjG';


//SET_USER
export const setUser = (user = {}) => ({
    type: 'SET_USER',
    user
});

export const startSetUser = ({uid, email}) => {
    const filterFormula = `{Email}="${email}"`;
    return async (dispatch) => {
        try {
            //SEARCH AIRTABLE FOR USER'S EMAIL
            const response = await axios.get(`${baseUrl}/Users?filterByFormula=${filterFormula}&api_key=${apiKey}`);
            //IF EMAIL FOUND, GATHER PROFILE INFO
            if (response.data.records.length > 0) {
                const userRecord = response.data.records[0];
                const user = {
                    recordId: userRecord.id,
                    firstName: userRecord.fields['First Name'],
                    lastName: userRecord.fields['Last Name'],
                    email,
                    postalCode: userRecord.fields['Postal Code'],
                    birthYear: userRecord.fields['Birth Year'],
                    interest1: userRecord.fields['#1 Interest'][0],
                    interest2: userRecord.fields['#2 Interest'][0],
                    interest3: userRecord.fields['#3 Interest'][0],
                    availability: userRecord.fields.Availability,
                    area: userRecord.fields.Area,
                    groups: userRecord.fields.Groups
                };
                //IF FIREBASE ID NOT PRESENT IN RECORD, ADD TO RECORD
                if(!response.data.records[0].fields['Firebase ID']) {
                    axios.patch(`${baseUrl}/Users/${user.recordId}?api_key=${apiKey}`, {"fields": {"Firebase ID": uid} } );
                }
                dispatch(setUser(user));
            } else {
                const user = { uid, email };
                dispatch(setUser(user));
            }
        } catch (e) {
            throw new Error('Call to Airtable Users table failed');
        }
    };
};

//UPDATE_USER
export const updateUser = (user) => ({
    type: 'UPDATE_USER',
    user
});

export const startUpdateUser = (user) => {
    const fields = {
        "First Name": user.firstName,
        "Last Name": user.lastName,
        "Postal Code": user.postalCode,
        "Birth Year": Number(user.birthYear),
        "#1 Interest": [user.interest1],
        "#2 Interest": [user.interest2],
        "#3 Interest": [user.interest3],
        "Availability": user.availability
    };
    return (dispatch) => {
        if (user.recordId) {
            axios.patch(`${baseUrl}/Users/${user.recordId}?api_key=${apiKey}`, {"fields": fields});
        } else {
            axios.post(`${baseUrl}/Users?api_key=${apiKey}`, {"fields": {"Email": user.email, "Firebase ID": user.uid, ...fields}});
        }
        dispatch(updateUser(user));
    };
};

//UPDATE USER'S AREA
// export const updateUserLocation = (postalCode) => ({
//     type: 'UPDATE_USER_AREA',
//     postalCode
// });

// export const startUpdateUserLocation = ({recordId, postalCode}) => {
//     // return (dispatch) => {
//         geolocateUser(recordId, postalCode);
//     // };
// };