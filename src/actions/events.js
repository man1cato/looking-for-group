import axios from 'axios';
import _ from 'lodash';

const apiKey= 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

//GET_EVENTS
export const getEvents = (events) => ({
    type: 'GET_EVENTS',
    events
});

export const startGetEvents = (usersGroups, userAvailability, availabilities) => {
    return async (dispatch) => {
        try {
            let events = [];
            for (let group of usersGroups) {                                    //FOR EACH OF THE USER'S GROUPS...
                const groupRecordId = group.id; 
                for (let availability of userAvailability) {                    
                    const availabilityRecordId = availability.id;
                    const filter = `AND({Availability Record ID}="${availabilityRecordId}",{Group Record ID}="${groupRecordId}")`;
                    const eventResponse = await axios.get(`${baseUrl}/Events?filterByFormula=${filter}&api_key=${apiKey}`);    
                    const event = eventResponse.data.records[0];
                    
                    //fetch event availability
                    
                    events.push({
                        id: event.id, 
                        interest: group.interest,
                        area: group.area,
                        availability: 
                    });
                }
                
                
            }
            dispatch(getEvents((events)));
        } catch (e) {
            throw new Error('Failed to retrieve groups in startGetGroups');
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