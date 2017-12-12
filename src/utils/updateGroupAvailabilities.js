import axios from 'axios';
import _ from 'lodash';
const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


export default async (group, userAvailabilities) => {
    const groupRecordId = group.id;
    const groupAvailabilities = group.fields['Group Availability'];
    const newGroupAvailabilities = _.union(groupAvailabilities, userAvailabilities);
    
    if (newGroupAvailabilities !== groupAvailabilities) {
        axios.patch(`${baseUrl}/Groups/${groupRecordId}?api_key=${apiKey}`, {
            "fields" : {
                "Group Availability": newGroupAvailabilities
            }
        });
    }
    
    return newGroupAvailabilities;
};


