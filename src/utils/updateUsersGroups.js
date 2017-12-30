import axios from 'axios';
import _ from 'lodash';
import createGroupObject from './createGroupObject';
import manageEvents from './manageEvents';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

export default async (userId, userInterestIds, userAreaId) => {
    try {
        let usersGroups = [];
        for (let interestId of userInterestIds) {                                                                //FOR EACH INTEREST...
            const groupsFilter = `AND({Interest Record ID}="${interestId}",{Area Record ID}="${userAreaId}")`;
            const groupsResponse = await axios.get(`${baseUrl}/Groups?filterByFormula=${groupsFilter}&api_key=${apiKey}`);   //...FIND GROUP CORRESPONDING TO AREA AND INTEREST...
            
            if (_.isEmpty(groupsResponse.data.records)) {                                                                                       //IF GROUP NOT FOUND... 
                const postResponse = await axios.post(`${baseUrl}/Groups?api_key=${apiKey}`,{                   //...CREATE NEW GROUP...
                    "fields": {
                        "Interest": [interestId],
                        "Area": [userAreaId]
                    }
                });
                console.log('Created group:', postResponse.data.fields.Name);
                const group = await createGroupObject(postResponse.data);
                usersGroups.push(group);                                                  //...AND PUSH GROUP INTO GROUP ARRAY 
            } else {                                                            //ELSE IF GROUP FOUND...
            
                /**UPDATE GROUP AVAILABILITIES**/
                const group = await createGroupObject(groupsResponse.data.records[0]);     //CREATE GROUP OBJECT FOR STORE
                
                const groupId = group.id;
                const groupUserIds = group.userIds;
                const groupAvailabilityIds = group.availabilityIds;
                console.log('Initial group availability:', groupAvailabilityIds);
                let groupAvailability = {};                                                 //CREATE NEW GROUP AVAILABILITY OBJECT
                for (let userId of groupUserIds) {                                          //FOR EACH USER IN GROUP...
                    const userResponse = await axios.get(`${baseUrl}/Users/${userId}?api_key=${apiKey}`);   
                    const userAvailabilityIds = userResponse.data.fields.Availability;      //GET THEIR AVAILABILITIES...
                    
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
                console.log('newGroupAvailability:',newGroupAvailabilityIds);
                
                if (!_.isEmpty(_.uniq(_.concat(newGroupAvailabilityIds,groupAvailabilityIds)))) {       //IF RESULTING ARRAY IS DIFFERENT FROM INITIAL ARRAY...
                    console.log('Group availability changed');
                    axios.patch(`${baseUrl}/Groups/${groupId}?api_key=${apiKey}`, {         //UPDATE GROUP RECORD
                        "fields" : {
                            "Group Availability": newGroupAvailabilityIds
                        }
                    });
                }
                
                group.availabilityIds = newGroupAvailabilityIds;
                
                /**UPDATE GROUP'S EVENTS**/
                
                const eventIds = await manageEvents(group); 
                group.events = eventIds;
                console.log('Updated group:', group);
                usersGroups.push(group);
            }
        }
        console.log("User's groups:", usersGroups);
        const usersGroupIds = usersGroups.map((group) => group.id );
        axios.patch(`${baseUrl}/Users/${userId}?api_key=${apiKey}`,{      //FINALLY, UPDATE USER'S GROUPS
            "fields": {
                "Groups": usersGroupIds
            }
        });
        
        const sortedUsersGroups = _.orderBy(usersGroups, ['interest'], ['asc']);    //SORT ARRAY ALPHABETICALLY
        
        return sortedUsersGroups;
       
        
    } catch (e) {
        throw new Error('Error in updateUsersGroups: ' + e);
    }
};

