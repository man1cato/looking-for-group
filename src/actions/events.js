import axios from 'axios';
import moment from 'moment-timezone';
import _ from 'lodash';
import getStartDatetime from '../utils/getStartDatetime';


const apiKey= 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

//GET_EVENTS
export const getEvents = (events) => ({
    type: 'GET_EVENTS',
    events
});

export const startGetEvents = (usersGroups, userAvailabilityIds) => {
    return async (dispatch) => {
        try {
            let events = [];
            for (let group of usersGroups) {                                    //FOR EACH OF THE USER'S GROUPS...
                const groupRecordId = group.id; 
                const timezoneId = group.timezoneId;
                
                for (let availabilityId of userAvailabilityIds) {               //AND EACH OF THEIR AVAILABILITIES...     
                    const filter = `AND({Group Record ID}="${groupRecordId}",{Availability Record ID}="${availabilityId}")`; //FIND THE CORRESPONDING EVENT
                    const eventResponse = await axios.get(`${baseUrl}/Events?filterByFormula=${filter}&api_key=${apiKey}`); 
                    const event = eventResponse.data.records[0];
                    
                    if (event) {                                                //IF EVENT EXISTS...
                        const startDatetime = await getStartDatetime(availabilityId, timezoneId);   //GET THE START DATE & TIME...
                        axios.patch(`${baseUrl}/Events/${event.id}?&api_key=${apiKey}`, {   //AND UPDATE THE EVENT RECORD
                            "fields": {
                                "Start Date & Time": startDatetime
                            }
                        });
                        events.push({                                           //ADD THE EVENT TO THE EVENTS ARRAY
                            id: event.id, 
                            interest: group.interest,
                            area: group.area,
                            availability: event.fields.Availability[0],
                            occurrence: event.fields.Occurrence,
                            startDatetime: startDatetime,
                            date: moment(startDatetime).format('MMM Do'),
                            startTime: moment(startDatetime).format('LT'),
                            chatGroupUrl: event.fields['Chat Group'],
                            memberIds: event.fields.Members,
                            memberCount: event.fields["Member Count"]
                        });
                    }
                }
            }
            console.log("User's events:", events);
            const sortedEvents = _.orderBy(events, ['startDatetime'], ['asc']);     //SORT ALPHABETICALLY
            dispatch(getEvents((sortedEvents)));                                    //DISPATCH TO STORE
        } catch (e) {
            throw new Error('Failed to retrieve groups in startGetEvents');
        }
    };
};


// //UPDATE_EVENTS
// export const updateEvents = (groups) => ({
//     type: 'UPDATE_GROUPS',
//     groups
// });

// export const startUpdateGroups = (areaRecordId, userInterests) => {
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
//                     availability: group.fields["Group Availibility"]
//                 });
//             }
//             const sortedGroups = _.orderBy(groups, ['interest'], ['asc']);
//             console.log('from startUpdateGroups:',sortedGroups);
//             dispatch(updateGroups(sortedGroups));
//         } catch (e) {
//             throw new Error('Update groups failed at startUpdateGroups');
//         }
        
//     };
// };