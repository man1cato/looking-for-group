import axios from 'axios';
import _ from 'lodash';
import createGroupObject from './createGroupObject';
import manageEvents from './manageEvents';

const apiKey = process.env.AIRTABLE_API_KEY;
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

export default async (userId, userInterestIds, userAreaId, userAvailabilityIds) => {
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
                const groupAvailabilityIds = group.availabilities.map((availability) => availability.id);

                let groupAvailabilities = group.availabilities;

                for (let userAvailabilityId of userAvailabilityIds) {                                           //FOR EACH AVAILABILITY...
                    
                    const availability = groupAvailabilities.find((item) => item.id === userAvailabilityId);    //FIND MATCHING GROUP AVAILABILITY...
                    
                    if (availability) {                                                                         //IF AVAILABILITY FOUND...
                        const index = groupAvailabilities.map((item) => item.id).indexOf(availability.id);
                        groupAvailabilities[index].userCount += 1;                                              //INCREASE COUNT BY ONE
                    } else {
                        groupAvailabilities.push({                                                              //ELSE, ADD IT AND SET COUNT TO 1
                            id: userAvailabilityId,
                            userCount: 1
                        });
                    }
                }
                
                const newGroupAvailabilityIds = groupAvailabilities.filter((availability) => availability.userCount > 3).map((availability) => availability.id);

                if (!_.isEmpty(_.uniq(_.concat(newGroupAvailabilityIds, groupAvailabilityIds)))) {       //IF RESULTING ARRAY IS DIFFERENT FROM INITIAL ARRAY...
                    console.log('Group availability changed');
                    axios.patch(`${baseUrl}/Groups/${groupId}?api_key=${apiKey}`, {         //UPDATE GROUP RECORD
                        "fields" : {
                            "Group Availability": newGroupAvailabilityIds
                        }
                    });
                }
                
                group.availabilities = groupAvailabilities;
                
                /**UPDATE GROUP'S EVENTS**/
                
                const eventIds = await manageEvents(group); 
                group.events = eventIds;
                console.log('Updated group:', group);
                usersGroups.push(group);
            }
        }
        
        const usersGroupIds = usersGroups.map((group) => group.id );
        axios.patch(`${baseUrl}/Users/${userId}?api_key=${apiKey}`,{      //FINALLY, UPDATE USER'S GROUPS
            "fields": {
                "Groups": usersGroupIds
            }
        });
        
        const sortedUsersGroups = _.orderBy(usersGroups, ['interest'], ['asc']);    //SORT ARRAY ALPHABETICALLY
        console.log("User's groups:", sortedUsersGroups);
        
        return sortedUsersGroups;
       
        
    } catch (e) {
        throw new Error('Error in updateUsersGroups: ' + e);
    }
};

