//*******WHEN A NEW USER REGISTERS, RUN THIS SCRIPT********//
import axios from 'axios';

import geolocateUser from './geolocateUser';
import addUserToGroups from './addUserToGroups';
import updateGroupAvailability from './updateGroupAvailability';
// import addVenues from './get-venues-new.js';
// import setEventTime from './create-events-new.js';
// import createGroupMe from './create-chat-new.js';

const apiKey = 'keyzG8AODPdzdkhjG';
const lfgBaseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


const newUser = async ({recordId, interests, postalCode}) => {
    try {
        const areaRecordId = await geolocateUser(recordId, postalCode);             //1. GEOLOCATE AND ASSIGN AREA
        await addUserToGroups(recordId, interests, areaRecordId);                   //2. ADD TO GROUPS BASED ON INTERESTS AND AREA
        
        const user = await axios.get(`${lfgBaseUrl}/Users/${recordId}?api_key=${apiKey}`);
        const usersGroups = user.data.fields.Groups;
        await updateGroupAvailability(usersGroups);                                 //3. UPDATE GROUP AVAILABILITY
        // await addVenues();                                                      //4. ADD VENUES TO NEW GROUPS
        // await setEventTime();                                                   //5. UPDATE/CREATE EVENTS BASED ON UPDATED/CREATED GROUPS
        // createGroupMe();                                                        //6. UPDATE/CREATE CHAT GROUPS BASED ON UPDATED/CREATED EVENTS
    } catch (e) {
        throw new Error('Update scripts failed');
    }
};

export default newUser;
