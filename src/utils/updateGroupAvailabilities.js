import axios from 'axios';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


export default async (group) => {
    const groupId = group.id;
    const groupUserIds = group.userIds;
    const groupAvailabilityIds = group.availability;
    
    let groupAvailability = {};                                                 //CREATE NEW GROUP AVAILABILITY OBJECT
    for (let userId of groupUserIds) {                                          //FOR EACH USER IN GROUP...
        const userResponse = await axios.get(`${baseUrl}/Users/${userId}?api_key=${apiKey}`);   
        const userAvailabilityIds = userResponse.data.fields.Availability;      //GET AVAILABILITIES...
        
        for (let availabilityId of userAvailabilityIds) {                       //FOR EACH AVAILABILITY...
            if (groupAvailability.hasOwnProperty(availabilityId) == false){     //IF GROUP DOES NOT HAVE MATCHING AVAILABILITY...
                groupAvailability[availabilityId] = 1;                          //ADD IT TO THE OBJECT AND SET COUNT TO 1
            } else {
                groupAvailability[availabilityId] += 1;                         //ELSE, INCREASE COUNT BY ONE
            }
        }
    }
    console.log('groupAvailability before:', groupAvailability);
    
    for (let availabilityId in groupAvailability){                              //FOR EACH KEY (AVAILABILITY) IN THE OBJECT...
        if (groupAvailability[availabilityId] < 4){                             //IF VALUE (COUNT) IS LESS THAN 4...
            delete groupAvailability[availabilityId];                           //REMOVE THE AVAILABILITY FROM THE OBJECT
        }
    }
    
    console.log('groupAvailability after:',groupAvailability);
    const newGroupAvailabilityIds = Object.keys(groupAvailability);             //CONVERT OBJECT BACK TO ARRAY
    
    if (newGroupAvailabilityIds !== groupAvailabilityIds) {                     //IF RESULTING ARRAY HAS BEEN MODIFIED...
        axios.patch(`${baseUrl}/Groups/${groupId}?api_key=${apiKey}`, {         //UPDATE GROUP RECORD
            "fields" : {
                "Group Availability": newGroupAvailabilityIds
            }
        });
    }
    
    return newGroupAvailabilityIds;
};