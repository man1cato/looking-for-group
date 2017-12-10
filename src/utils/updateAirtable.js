//*******WHEN A NEW USER REGISTERS, RUN THIS SCRIPT********//
import axios from 'axios';

import geolocateUser from './geolocateUser';
import addUserToGroups from './addUserToGroups';
import updateGroupAvailability from './updateGroupAvailability';
// import addVenues from './get-venues-new.js';
// import setEventTime from './create-events-new.js';
// import createGroupMe from './create-chat-new.js';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


const updateAirtable = async ({recordId, allInterests, availability}, placeDetails) => {
    try {
        const areaRecordId = await geolocateUser(recordId, placeDetails);                 //1. GEOLOCATE AND ASSIGN AREA
        const usersGroups = await addUserToGroups(recordId, allInterests, areaRecordId);   //2. ADD TO GROUPS BASED ON INTERESTS AND AREA
        
        for (let groupRecordId of usersGroups) {                                        //3. UPDATE GROUP AVAILABILITY
            const groupResponse = await axios.get(`${baseUrl}/Groups/${groupRecordId}?api_key=${apiKey}`);
            const group = groupResponse.data;
            updateGroupAvailability(group, availability);                                 
        }
        
        // await addVenues();                                                      //4. ADD VENUES TO NEW GROUPS
        // await setEventTime();                                                   //5. UPDATE/CREATE EVENTS BASED ON UPDATED/CREATED GROUPS
        // createGroupMe();                                                        //6. UPDATE/CREATE CHAT GROUPS BASED ON UPDATED/CREATED EVENTS
    } catch (e) {
        throw new Error('Update scripts failed');
    }
};

export default updateAirtable;
