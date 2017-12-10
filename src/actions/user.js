import axios from 'axios';

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
                const interest1 = userRecord.fields['#1 Interest'][0] ? userRecord.fields['#1 Interest'][0] : [];
                const interest2 = userRecord.fields['#2 Interest'][0] ? userRecord.fields['#2 Interest'][0] : [];
                const interest3 = userRecord.fields['#3 Interest'][0] ? userRecord.fields['#3 Interest'][0] : [];
                const additionalInterests = userRecord.fields["Add'l Interests"] ? userRecord.fields["Add'l Interests"] : [];
                const allInterests = [interest1, interest2, interest3, ...additionalInterests];
                const user = {
                    recordId: userRecord.id,
                    firstName: userRecord.fields['First Name'],
                    lastName: userRecord.fields['Last Name'],
                    email,
                    postalCode: userRecord.fields['Postal Code'],
                    birthYear: userRecord.fields['Birth Year'],
                    interest1,
                    interest2,
                    interest3,
                    additionalInterests,
                    allInterests,
                    availability: userRecord.fields.Availability,
                    area: userRecord.fields.Area[0],
                    groups: userRecord.fields.Groups
                };
                //IF FIREBASE ID NOT PRESENT IN RECORD, ADD TO RECORD
                if(!response.data.records[0].fields['Firebase ID']) {
                    axios.patch(`${baseUrl}/Users/${user.recordId}?api_key=${apiKey}`, {"fields": {"Firebase ID": uid} } );
                }
                dispatch(setUser(user));
                return user;
            } else {
                const postResponse = await axios.post(`${baseUrl}/Users?api_key=${apiKey}`, {"fields": {"Email": email, "Firebase ID": uid}});
                const user = {
                    recordId: postResponse.data.id,
                    email
                };
                dispatch(setUser(user));
                return user;
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
        "Add'l Interests": user.additionalInterests,
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


// //UPDATE_USER_AREA  
// export const updateUserArea = (area) => ({
//     type: 'UPDATE_USER_AREA',
//     area
// });

// export const startUpdateUserArea = (user, placeDetails) => {
//     // const userRecordId = user.recordId;
//     // const userInterests = user.allInterests;
//     return (dispatch) => {
//         updateAirtable(user, placeDetails);
//         dispatch(updateUser(user));
//     };
//     // return async (dispatch) => {
//     //     try {
//     //         const areaRecordId = await geolocateUser(userRecordId, placeDetails);
//     //         const usersGroups = await addUserToGroups(userRecordId, userInterests, areaRecordId);
//     //         // for (let groupRecordId of usersGroups) {                                        //3. UPDATE GROUP AVAILABILITY
//     //         //     const group = await axios.get(`${baseUrl}/Groups/${groupRecordId}?api_key=${apiKey}`);
//     //         //     await updateGroupAvailability(group, userAvailability);                                 
//     //         // }
//     //         dispatch(updateUser({...user, area: areaRecordId, groups: usersGroups}));
//     //     } catch (e) {
//     //         throw new Error('Error at addUserToGroups within startUpdateUserArea');
//     //     }
//     // };
// };
