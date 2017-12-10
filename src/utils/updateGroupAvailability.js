import axios from 'axios';
import _ from 'lodash';
const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


export default (group, userAvailability) => {
    const groupRecordId = group.id;
    const groupAvailability = group.fields['Group Availability'];
    const newGroupAvailability = _.union(groupAvailability, userAvailability);
    
    if (newGroupAvailability !== groupAvailability) {
        axios.patch(`${baseUrl}/Groups/${groupRecordId}?api_key=${apiKey}`, {
            "fields" : {
                "Group Availability": newGroupAvailability
            }
        });
    }
};


