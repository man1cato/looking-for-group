import axios from 'axios';
import moment from 'moment-timezone';
import _ from 'lodash';


const apiKey = process.env.AIRTABLE_API_KEY;
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
                const groupId = group.id; 
                
                for (let availabilityId of userAvailabilityIds) {               //AND EACH OF THEIR AVAILABILITIES...     
                    const filter = `AND({Group Record ID}="${groupId}",{Availability Record ID}="${availabilityId}")`; //FIND THE CORRESPONDING EVENT
                    const eventResponse = await axios.get(`${baseUrl}/Events?filterByFormula=${filter}&api_key=${apiKey}`); 
                    
                    if (!_.isEmpty(eventResponse.data.records)) {               //IF EVENT EXISTS...
                        const event = eventResponse.data.records[0];
                        const startDatetime = event.fields['Start Date & Time'];
                        events.push({                                           //ADD THE EVENT TO THE EVENTS ARRAY
                            id: event.id, 
                            order: event.fields.Order[0],
                            interest: group.interest,
                            area: group.area,
                            availability: event.fields.Availability[0],
                            timeRange: event.fields['Time Range'],
                            occurrence: event.fields.Occurrence,
                            startDatetime,
                            date: moment(startDatetime).format('MMM Do'),
                            startTime: moment(startDatetime).format('LT'),
                            chatGroupUrl: event.fields['Chat Group'],
                            memberIds: event.fields.Members,
                            memberCount: event.fields["Member Count"],
                            groupId
                        });
                    }
                }
            }
            const sortedEvents = _.orderBy(events, ['order'], ['asc']);     //SORT BY DAY/TIME
            console.log("User's events:", sortedEvents);
            dispatch(getEvents((sortedEvents)));                                    //DISPATCH TO STORE
        } catch (e) {
            throw new Error('Failed to retrieve groups in startGetEvents' + e);
        }
    };
};
