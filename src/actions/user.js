import axios from 'axios';
import _ from 'lodash';
import updateAirtable from '../utils/updateAirtable';

const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const apiKey= 'keyzG8AODPdzdkhjG';


//ACTION
export const setUser = (user = {}) => ({
    type: 'SET_USER',
    user
});


//SET_USER
export const startSetUser = ({uid, email}) => {
    const filterFormula = `{Email}="${email}"`;
    return async (dispatch) => {
        try {
            //SEARCH AIRTABLE FOR USER'S EMAIL
            const response = await axios.get(`${baseUrl}/Users?filterByFormula=${filterFormula}&api_key=${apiKey}`);
            //IF EMAIL FOUND, GATHER PROFILE INFO
            if (response.data.records.length > 0) {
                const userRecord = response.data.records[0];
                // console.log('userRecord:',userRecord);
                const interest1 = userRecord.fields['#1 Interest'][0] || '';
                const interest2 = userRecord.fields['#2 Interest'][0] || '';
                const interest3 = userRecord.fields['#3 Interest'][0] || '';
                const additionalInterests = userRecord.fields["Add'l Interests"] || [];
                const allInterests = [interest1, interest2, interest3, ...additionalInterests];
                
                const areaRecordId = userRecord.fields.Area;                    //RETRIEVE AREA DATA
                const areaResponse = await axios.get(`https://api.airtable.com/v0/appOY7Pr6zpzhQs6l/Areas/${areaRecordId}?api_key=${apiKey}`);
                const area = {
                    id: areaResponse.data.id, 
                    name: areaResponse.data.fields.Name,
                    timezoneId: areaResponse.data.fields["Timezone ID"]
                };   

                const usersGroups = userRecord.fields.Groups;                   //RETRIEVE GROUPS DATA
                let groups = [];
                for (let groupRecordId of usersGroups) {
                    const group = await axios.get(`${baseUrl}/Groups/${groupRecordId}?api_key=${apiKey}`);
                    groups.push({
                        id: group.data.id, 
                        area: group.data.fields["Area Text"],
                        interest: group.data.fields["Interest Name"],
                        availability: group.data.fields["Group Availability"]
                    });
                }
                const sortedGroups = _.orderBy(groups, ['interest'], ['asc']);

                const user = {                                                  //DEFINE USER OBJECT
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
                    area,
                    groups: sortedGroups
                };
                
                if(!response.data.records[0].fields['Firebase ID']) {           //IF FIREBASE ID NOT PRESENT IN RECORD, ADD TO RECORD
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
            throw new Error('Call to Airtable Users table failed in startSetUser');
        }
    };
};


//UPDATE_USER
export const startUpdateUser = (user, placeDetails) => {
    const fields = {
        "First Name": user.firstName,
        "Last Name": user.lastName,
        "Postal Code": user.postalCode,
        "Birth Year": Number(user.birthYear),
        "#1 Interest": user.interest1 === '' ? null : [user.interest1],
        "#2 Interest": user.interest2 === '' ? null : [user.interest2],
        "#3 Interest": user.interest3 === '' ? null : [user.interest3],
        "Add'l Interests": user.additionalInterests,
        "Availability": user.availability
    };

    return async (dispatch) => {
        if (user.recordId) {
            axios.patch(`${baseUrl}/Users/${user.recordId}?api_key=${apiKey}`, {"fields": fields});         //UPDATE PROFILE FIELDS
            await updateAirtable(user,placeDetails);
            
            //UPDATE USER'S GROUPS IN STORE
            const areaRecordId = user.area.id;
            const userInterests = user.allInterests;
            let groups = [];
            for (let interestRecordId of userInterests) {
                const filter = `AND({Interest Record ID}="${interestRecordId}",{Area Record ID}="${areaRecordId}")`;
                const response = await axios.get(`${baseUrl}/Groups?filterByFormula=${filter}&api_key=${apiKey}`);
                const group = response.data.records[0];
                groups.push({
                    id: group.id, 
                    area: group.fields["Area Text"],
                    interest: group.fields["Interest Name"],
                    availability: group.fields["Group Availability"]
                });
            }
            const sortedGroups = _.orderBy(groups, ['interest'], ['asc']);
            user.groups = sortedGroups;
            
        } else {
            axios.post(`${baseUrl}/Users?api_key=${apiKey}`, {"fields": {"Email": user.email, "Firebase ID": user.uid, ...fields}});
        }
        dispatch(setUser(user));
    };
};


// //UPDATE USER'S GROUPS
// export const startUpdateGroups = (user) => {
//     const areaRecordId = user.area.id;
//     const userInterests = user.allInterests;
//     return async (dispatch) => {
//         try {
//             let groups = [];
//             for (let interestRecordId of userInterests) {
//                 const filter = `AND({Interest Record ID}="${interestRecordId}",{Area Record ID}="${areaRecordId}")`;
//                 const response = await axios.get(`${baseUrl}/Groups?filterByFormula=${filter}&api_key=${apiKey}`);
//                 const group = response.data.records[0];
//                 groups.push({
//                     id: group.id, 
//                     area: group.fields["Area Text"],
//                     interest: group.fields["Interest Name"],
//                     availability: group.fields["Group Availability"]
//                 });
//             }
//             const sortedGroups = _.orderBy(groups, ['interest'], ['asc']);
//             console.log('from startUpdateGroups in user action:',sortedGroups);
//             user.groups = sortedGroups;
//             console.log(user);
//             dispatch(setUser(user));
//         } catch (e) {
//             throw new Error('Update groups failed at startUpdateGroups in user.js');
//         }
//     };
// };