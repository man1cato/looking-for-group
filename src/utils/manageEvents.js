import axios from 'axios';
import _ from 'lodash';
import getStartDatetime from './getStartDatetime';
import createChatGroup from './createChatGroup';

const apiKey = process.env.AIRTABLE_API_KEY;
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


export default async (group, userId) => {
    try {
        const groupAvailabilityIds = group.availabilityIds;
    
        if (groupAvailabilityIds.length > 0) {
            const groupId = group.id;
            const timezoneId = group.timezoneId;
            let eventIds = group.events || [];
            
            for (let availabilityId of groupAvailabilityIds) {                      //FOR EACH GROUP AVAILABILITY...
            
                const filter = `AND({Group Record ID}="${groupId}",{Availability Record ID}="${availabilityId}")`;  //FIND THE MATCHING EVENT
                const eventResponse = await axios.get(`${baseUrl}/Events?filterByFormula=${filter}&api_key=${apiKey}`); 
                
                if (_.isEmpty(eventResponse.data.records)) {                        //IF EVENT DOESN'T EXIST... 
                    const startDatetime = await getStartDatetime(availabilityId, timezoneId);
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
                    createChatGroup(newEvent, timezoneId);                          //CREATE GROUPME CHAT GROUP...
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
    } catch (e) {
        throw new Error('Error in manageEvents: ' + e);
    }
};
