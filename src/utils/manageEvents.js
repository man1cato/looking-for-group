import axios from 'axios';
import getStartDatetime from './getStartDatetime';
import createChatGroup from './createChatGroup';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


export default async (group, userId) => {
    const groupAvailabilityIds = group.availability;

    if (groupAvailabilityIds.length > 0) {
        const groupId = group.id;
        const timezoneId = group.timezoneId;
        let eventIds = group.events || [];
        
        for (let availabilityId of groupAvailabilityIds) {                      //FOR EACH GROUP AVAILABILITY...
        
            const filter = `AND({Group Record ID}="${groupId}",{Availability Record ID}="${availabilityId}")`;  //FIND THE MATCHING EVENT
            const eventResponse = await axios.get(`${baseUrl}/Events?filterByFormula=${filter}&api_key=${apiKey}`); 
            const event = eventResponse.data.records[0];
            const startDatetime = await getStartDatetime(availabilityId, timezoneId);

            if (event) {                                                        //IF EVENT EXISTS...
                axios.patch(`${baseUrl}/Events/${event.id}?api_key=${apiKey}`, {    //UPDATE EVENT START TIME
                    "fields": {
                        "Start Date & Time": startDatetime
                    }
                });
                console.log("Event exists:", event.fields.Name, startDatetime);
            } else {                                                            //IF EVENT DOESN'T EXIST...  
                const postResponse = await axios.post(`${baseUrl}/Events?api_key=${apiKey}`, {      //CREATE IT...   
                    "fields": {
                        "Group": [groupId],
                        "Start Date & Time": startDatetime,
                        "Availability": [availabilityId]
                    }
                });
                console.log('postResponse:',postResponse);
                const newEvent = postResponse.data;
                console.log("Event doesn't exist", newEvent);
                createChatGroup(newEvent, timezoneId);                                      //CREATE GROUPME CHAT GROUP...
                eventIds.push(newEvent.id);                                     //AND ADD EVENT TO ARRAY
            }
        }  
        
        axios.patch(`${baseUrl}/Groups/${groupId}?&api_key=${apiKey}`, {        //UPDATE EVENTS IN GROUP RECORD
            "fields": {
                "Events": eventIds
            }
        });
        
        return eventIds;
    }
};
