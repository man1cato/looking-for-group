import axios from 'axios';
import moment from 'moment-timezone';

const airtableBaseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const apiKey = 'keyzG8AODPdzdkhjG';
const groupmeBaseUrl = 'https://api.groupme.com/v3';
const ACCESS_TOKEN = 'bcd8d3c0e049013585f90c9514cbdeb5';

export default async (event, timezoneId) => {
    const eventId = event.id;
    const area = event.fields.Area[0];
    const interest = event.fields.Interest[0];
    const occurrence = event.fields.Occurrence;
    const name = event.fields.Name;
    const activities = event.fields.Activities;
    const venues = event.fields['Venue Suggestions'];
    
    const startDatetime = moment(event.fields['Start Date & Time']).utc();
    const localStartDatetime = moment.tz(startDatetime.format('YYYY-MM-DDTHH:mm:ss.SSS'), timezoneId);
    const date = moment(localStartDatetime).format('MMM Do');
    console.log('date',date);
    const startTime = moment(localStartDatetime).format('LT');
    console.log('startTime',startTime);
    
    const groupmeThumbnailUrl = event.fields["GroupMe Thumbnail URL"][0];
    
    const postResponse = await axios.post(`${groupmeBaseUrl}/groups?access_token=${ACCESS_TOKEN}`, {    //CREATE GROUP
        name,
        description: `${occurrence} ${interest} in the ${area} area`,
        image_url: groupmeThumbnailUrl,
        share: true
    });
    const group = postResponse.data.response;
    const shareUrl = group.share_url;
    const groupId = group.group_id;
    console.log('groupme id:', groupId, 'shareurl:', shareUrl);
    
    // axios.post(`${groupmeBaseUrl}/groups/${groupId}/members/add?access_token=${ACCESS_TOKEN}`,{     //ADD WILL   **CORS block**
    //     "members": [{"nickname": "Will", "phone_number": "9144822288"}]
    // });

    axios.patch(`${airtableBaseUrl}/Events/${eventId}?api_key=${apiKey}`, {      //ADD GROUPME INFO TO EVENT RECORD
        "fields": {
            "Chat Group": shareUrl,
            "GroupMe Group ID": groupId
        }
    });
        
    const messages = [
        `Welcome to the ${name} chat group! I'm Andres, and along with my friend Will, we're the guys behind this app.`,
        `This chat group consists of folks in the ${area} area who indicated an interest in ${interest} and are available on ${occurrence}s.`,
        `At this point, it's up to you all to decide what to do and where.`,
        // `Here's a list of possible activities: ${activities}.`,
        // `Here's a list of possible venues: ${venues}.`,
        `The next event is set for ${date} at ${startTime}. The specific time can change, but based on availability, should happen on ${occurrence}.`,
        `Once agreed to, anyone can create the event by selecting the message attachment button.`,
        `Please ping myself or Will with any questions or feedback.`
    ];
        
    for (let message of messages) {
        await axios.post(`${groupmeBaseUrl}/groups/${groupId}/messages?access_token=${ACCESS_TOKEN}`, {"message": {"text": message}});
    }
};