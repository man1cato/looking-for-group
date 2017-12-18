import axios from 'axios';
import _ from 'lodash';
// import updateAirtable from '../utils/updateAirtable';
import createGroupObject from '../utils/createGroupObject';
import geolocateUser from '../utils/geolocateUser';
import updateUsersGroups from '../utils/updateUsersGroups';
import updateGroupAvailabilities from '../utils/updateGroupAvailabilities';
import manageEvents from '../utils/manageEvents';
import {startGetEvents} from './events';

const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const apiKey= 'keyzG8AODPdzdkhjG';


//ACTION
export const setUser = (user = {}) => ({
    type: 'SET_USER',
    user
});


//SET_USER
export const startSetUser = ({uid, email}) => {
    return async (dispatch) => {
        //SEARCH AIRTABLE FOR USER'S EMAIL
        const filterFormula = `{Email}="${email}"`;
        const response = await axios.get(`${baseUrl}/Users?filterByFormula=${filterFormula}&api_key=${apiKey}`);
        //IF EMAIL FOUND, GATHER PROFILE INFO
        if (response.data.records.length > 0) {
            const userRecord = response.data.records[0];
            const interest1 = !!userRecord.fields['#1 Interest'] && userRecord.fields['#1 Interest'][0];
            const interest2 = !!userRecord.fields['#2 Interest'] && userRecord.fields['#2 Interest'][0];
            const interest3 = !!userRecord.fields['#3 Interest'] && userRecord.fields['#3 Interest'][0];
            const additionalInterests = userRecord.fields["Add'l Interests"] || [];
            const allInterests = _.compact([interest1, interest2, interest3, ...additionalInterests]);
            const userAvailabilityIds = userRecord.fields.Availability;
            let area = {};  
            let sortedGroups = [];
            
            if (userRecord.fields.Area) {                         //RETRIEVE AREA DATA
                const areaRecordId = userRecord.fields.Area[0];
                const areaResponse = await axios.get(`https://api.airtable.com/v0/appOY7Pr6zpzhQs6l/Areas/${areaRecordId}?api_key=${apiKey}`);
                area = {
                    id: areaResponse.data.id, 
                    name: areaResponse.data.fields.Name,
                    timezoneId: areaResponse.data.fields["Timezone ID"]
                };  
            }
            
            if (userRecord.fields.Groups) {                            //RETRIEVE GROUPS DATA
                const groupIds = userRecord.fields.Groups;
                let groups = [];
                for (let groupId of groupIds) {
                    const groupResponse = await axios.get(`${baseUrl}/Groups/${groupId}?api_key=${apiKey}`);
                    const group = createGroupObject(groupResponse.data);
                    
                    groups.push(group);
                }
                sortedGroups = _.orderBy(groups, ['interest'], ['asc']);
            }
            
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
                availability: userAvailabilityIds,
                area,
                groups: sortedGroups
            };
            
            if(!response.data.records[0].fields['Firebase ID']) {           //IF FIREBASE ID NOT PRESENT IN RECORD, ADD TO RECORD
                axios.patch(`${baseUrl}/Users/${user.recordId}?api_key=${apiKey}`, {"fields": {"Firebase ID": uid} } );
            }
            dispatch(setUser(user));
            return user;
        } else {                //IF EMAIL NOT FOUND, CREATE RECORD
            console.log('User not found');
            const postResponse = await axios.post(`${baseUrl}/Users?api_key=${apiKey}`, {"fields": {"Email": email, "Firebase ID": uid}});
            const user = {
                recordId: postResponse.data.id,
                email
            };
            dispatch(setUser(user));
            return user;
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
            // await updateAirtable(user,placeDetails);
            
            /***UPDATE AIRTABLE***/
            const userId = user.recordId;
            const userInterests = user.allInterests;
            let areaId = !!user.area ? user.area.id : '';
            if (placeDetails) {
                areaId = await geolocateUser(userId, placeDetails);                 //1. GEOLOCATE AND ASSIGN AREA
            } 
            
            const usersGroupIds = await updateUsersGroups(userId, userInterests, areaId);   //2. ADD TO GROUPS BASED ON INTERESTS AND AREA
            let usersGroups = [];
            for (let groupId of usersGroupIds) {                                        //3. FOR EACH GROUP...
                const groupResponse = await axios.get(`${baseUrl}/Groups/${groupId}?api_key=${apiKey}`);
                let group = await createGroupObject(groupResponse.data);
                const groupAvailabilities = await updateGroupAvailabilities(group);     //...UPDATE GROUP AVAILABILITY...
                group.availability = groupAvailabilities;
                const eventIds = await manageEvents(group);                                            //...AND UPDATE/CREATE EVENTS AND CHAT GROUPS
                
                group.events = eventIds;
                console.log('Updated group:', group);
                usersGroups.push(group);
            }
            
            /***UPDATE USER'S GROUPS IN STORE***/
            const sortedUsersGroups = _.orderBy(usersGroups, ['interest'], ['asc']);
            user.groups = sortedUsersGroups;
            dispatch(startGetEvents(sortedUsersGroups, user.availability));
        } else {
            axios.post(`${baseUrl}/Users?api_key=${apiKey}`, {"fields": {"Email": user.email, "Firebase ID": user.uid, ...fields}});
        }
        console.log('DISPATCHED UPDATED USER:', user);
        dispatch(setUser(user));
    };
};
