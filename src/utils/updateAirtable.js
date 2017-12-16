//*******WHEN A NEW USER REGISTERS, RUN THIS SCRIPT********//
import axios from 'axios';
import createGroupObject from '../utils/createGroupObject';
import geolocateUser from './geolocateUser';
import addUserToGroups from './addUserToGroups';
import updateGroupAvailabilities from './updateGroupAvailabilities';
import manageEvents from './manageEvents';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


const updateAirtable = async (user, placeDetails) => {
    const userId = user.recordId;
    const allInterests = user.allInterests;
    
    let areaRecordId = user.area.id;
    
    if (placeDetails) {
        areaRecordId = await geolocateUser(userId, placeDetails);                 //1. GEOLOCATE AND ASSIGN AREA
    } 
    const usersGroups = await addUserToGroups(userId, allInterests, areaRecordId);   //2. ADD TO GROUPS BASED ON INTERESTS AND AREA
        
    for (let groupId of usersGroups) {                                        //3. FOR EACH GROUP...
        const groupResponse = await axios.get(`${baseUrl}/Groups/${groupId}?api_key=${apiKey}`);
        const group = createGroupObject(groupResponse.data);

        const groupAvailabilities = await updateGroupAvailabilities(group);     //...UPDATE GROUP AVAILABILITY...
        group.availability = groupAvailabilities;
        
        manageEvents(group);                //...AND UPDATE/CREATE EVENTS AND CHAT GROUPS
        console.log('Updated group:', group);
    }
};

export default updateAirtable;
