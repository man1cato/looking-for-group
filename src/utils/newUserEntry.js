//*******WHEN A NEW USER REGISTERS, RUN THIS SCRIPT********//
import geolocateUser from './geolocate-user-v3.js';
// import addUserToGroups from './update-groups-new.js';
// import updateGroupAvailability from './group-availability-new.js';
// import addVenues from './get-venues-new.js';
// import setEventTime from './create-events-new.js';
// import createGroupMe from './create-chat-new.js';


const newUser = async ({recordId, postalCode}) => {
    try {
        await geolocateUser(recordId, postalCode);                                        //1. GEOLOCATE AND ASSIGN AREA
        // const areaRecordId = await addUserToGroups(recordId);                   //2. ADD TO GROUPS BASED ON INTERESTS AND AREA - WILL RETURN AN AREA RECORD ID CORRESPONDING TO THE GROUPS
        // await updateGroupAvailability(areaRecordId);                            //3. UPDATE GROUP AVAILABILITY
        // await addVenues();                                                      //4. ADD VENUES TO NEW GROUPS
        // await setEventTime();                                                   //5. UPDATE/CREATE EVENTS BASED ON UPDATED/CREATED GROUPS
        // createGroupMe();                                                        //6. UPDATE/CREATE CHAT GROUPS BASED ON UPDATED/CREATED EVENTS
    } catch (e) {
        throw new Error('Update scripts failed');
    }
};

export default newUser;
