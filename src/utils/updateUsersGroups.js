import axios from 'axios';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

export default async (userRecordId, userInterests, areaRecordId) => {
    try {
        let usersGroupIds = [];
        for (let interestRecordId of userInterests) {                                                                //FOR EACH INTEREST...
            const groupsFilter = `AND({Interest Record ID}="${interestRecordId}",{Area Record ID}="${areaRecordId}")`;
            const groupsResponse = await axios.get(`${baseUrl}/Groups?filterByFormula=${groupsFilter}&api_key=${apiKey}`);   //...FIND GROUP CORRESPONDING TO AREA AND INTEREST...
            const group = groupsResponse.data.records[0];
            if (!group) {                                                                                       //IF GROUP NOT FOUND... 
                const postResponse = await axios.post(`${baseUrl}/Groups?api_key=${apiKey}`,{                   //...CREATE NEW GROUP...
                    "fields": {
                        "Interest": [interestRecordId],
                        "Area": [areaRecordId]
                    }
                });
                console.log('Created group:', postResponse.data.fields.Name);
                usersGroupIds.push(postResponse.data.id);                                                  //...AND PUSH GROUP INTO GROUP ARRAY 
            } else {                                                            //ELSE IF GROUP FOUND...
                usersGroupIds.push(group.id);                                     //...PUSH GROUP INTO GROUP ARRAY 
            }
        }
        axios.patch(`${baseUrl}/Users/${userRecordId}?api_key=${apiKey}`,{      //FINALLY, UPDATE USER'S GROUPS
            "fields": {
                "Groups": usersGroupIds
            }
        });
        return usersGroupIds;
    } catch (e) {
        throw new Error('Error in updateUsersGroups: ' + e);
    }
};

