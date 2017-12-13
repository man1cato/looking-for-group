import axios from 'axios';
import getStartDatetime from './getStartDatetime';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


export default async (group, userAvailabilities, timezoneId) => {
    const groupRecordId = group.id;
    let events = group.fields.Events || [];
    for (let availabilityRecordId of userAvailabilities) {                              //FOR EACH USER AVAILABILITY...
        
        const filter = `AND({Group Record ID}="${groupRecordId}",{Availability Record ID}="${availabilityRecordId}")`;  //FIND THE MATCHING EVENT
        const eventResponse = await axios.get(`${baseUrl}/Events?filterByFormula=${filter}&api_key=${apiKey}`); 
        const event = eventResponse.data.records[0];

        if (event) {                                                            
            console.log("Event exists:", event);
        } else {                                                                //IF EVENT DOESN'T EXIST, CREATE IT ADD EVENT TO ARRAY
            console.log("Event doesn't exist");
            const startDatetime = await getStartDatetime(availabilityRecordId, timezoneId);
            console.log('startDatetime:',startDatetime);
            const postResponse = await axios.post(`${baseUrl}/Events?api_key=${apiKey}`, {
                "fields": {
                    "Group": [groupRecordId],
                    "Start Date & Time": startDatetime,
                    "Availability": [availabilityRecordId]
                }
            });
            console.log('postResponse:',postResponse);
            const eventRecordId = postResponse.data.id;
            events.push(eventRecordId);
        }
    }  
    axios.patch(`${baseUrl}/Groups/${groupRecordId}?&api_key=${apiKey}`, {
        "fields": {
            "Events": events
        }
    });
};
