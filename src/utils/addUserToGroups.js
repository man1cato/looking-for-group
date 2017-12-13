import axios from 'axios';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

export default async (userRecordId, userInterests, areaRecordId) => {
    let usersGroups = [];
    for (let interestRecordId of userInterests) {                                                                //FOR EACH INTEREST...
        const groupsFilter = `AND({Interest Record ID}="${interestRecordId}",{Area Record ID}="${areaRecordId}")`;
        const groupsResponse = await axios.get(`${baseUrl}/Groups?filterByFormula=${groupsFilter}&api_key=${apiKey}`);   //...FIND GROUP CORRESPONDING TO AREA AND INTEREST...
        const group = groupsResponse.data.records[0];
        // console.log('addUserToGroups group:', group);
        if (!group) {                                                                                       //IF GROUP NOT FOUND... 
            const postResponse = await axios.post(`${baseUrl}/Groups?api_key=${apiKey}`,{                   //...CREATE NEW GROUP...
                "fields": {
                    "Interest": [interestRecordId],
                    "Area": [areaRecordId]
                }
            });
            usersGroups.push(postResponse.data.id);                                                  //...AND PUSH GROUP INTO GROUP ARRAY 
        } else {                                                            //ELSE IF GROUP FOUND...
            usersGroups.push(group.id);                                     //...PUSH GROUP INTO GROUP ARRAY 
        }
    }
    axios.patch(`${baseUrl}/Users/${userRecordId}?api_key=${apiKey}`,{      //FINALLY, UPDATE USER'S GROUPS
        "fields": {
            "Groups": usersGroups
        }
    });
    return usersGroups;
};

