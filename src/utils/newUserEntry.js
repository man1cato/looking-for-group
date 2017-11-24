//*******WHEN A NEW USER REGISTERS, RUN THIS SCRIPT********//
var {geolocate} = require('./geolocate-user-new.js');
const updateGroups = require('./update-groups-new.js');
const groupAvailability = require('./group-availability-new.js');
const getVenues = require('./get-venues-new.js');
const events = require('./create-events-new.js');
const chats = require('./create-chat-new.js');

var userRecordId = 'recxN6MeBrh2lRCfW';

//1. GEOLOCATE AND ASSIGN AREA
geolocate(userRecordId)
  
//2. ADD TO GROUPS BASED ON INTERESTS AND AREA
.then((userRecordId)=>{
    return updateGroups.addUserToGroups(userRecordId);                           //WILL RETURN AN AREA RECORD ID CORRESPONDING TO THE GROUPS
})

//3. UPDATE GROUP AVAILABILITY
.then((areaRecordId)=>{
    return groupAvailability.populateGroupAvailability(areaRecordId); 
})

// 4. ADD VENUES TO NEW GROUPS AND UPDATE/CREATE EVENTS BASED ON UPDATED/CREATED GROUPS
.then(()=>{
    console.log('ACHIEVED STEP 4');
    getVenues.addVenues();
    return events.setEventTime();
})

//5. UPDATE/CREATE CHAT GROUPS BASED ON UPDATED/CREATED EVENTS
.then(()=>{
    chats.createGroupMe();
})
.catch((err)=>{
  console.log('ERROR:',err); 
});
