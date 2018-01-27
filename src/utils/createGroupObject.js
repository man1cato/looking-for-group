import axios from 'axios';

const apiKey = process.env.AIRTABLE_API_KEY;
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

export default (groupData) => {
    const groupUserIds = groupData.fields.Users;
    let groupAvailabilities = [];                                                                       //CREATE NEW GROUP AVAILABILITY OBJECT
    if (groupUserIds) {
        for (let userId of groupUserIds) {                                                                  //FOR EACH USER IN GROUP...
            axios.get(`${baseUrl}/Users/${userId}?api_key=${apiKey}`).then((res) => {
                const userAvailabilityIds = res.data.fields.Availability;                               //GET THEIR AVAILABILITIES...
                for (let userAvailabilityId of userAvailabilityIds) {                                           //FOR EACH AVAILABILITY...
                    const availability = groupAvailabilities.find((item) => item.id === userAvailabilityId);    //FIND MATCHING AVAILABILITY...
                    
                    if (availability) {                                                                         //IF AVAILABILITY FOUND...
                        const index = groupAvailabilities.map((item) => item.id).indexOf(availability.id);
                        groupAvailabilities[index].userCount += 1;                                              //INCREASE COUNT BY ONE
                    } else {                                                                                    //ELSE, ADD IT AND SET COUNT TO 1
                        groupAvailabilities.push({
                            id: userAvailabilityId,
                            userCount: 1
                        });
                    }
                }
            }).catch((e) => {
                console.log('Error at createGroupObject:', e);
            });
        }
    } 
    return {
        id: groupData.id, 
        area: groupData.fields["Area Text"],
        interest: groupData.fields["Interest Name"],
        availabilities: groupAvailabilities || [],
        userIds: groupUserIds || [],
        userCount: groupData.fields["User Count"],
        events: groupData.fields.Events || [],
        eventCount: groupData.fields["Event Count"],
        icons: groupData.fields.Icon[0].thumbnails,
        timezoneId: groupData.fields["Timezone ID"][0]
    };
};


