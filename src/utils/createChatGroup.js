import axios from 'axios';

const airtableAPI = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

const ACCESS_TOKEN = "vig9CESvrYoT1rLFhjsuAmggHX2NtwpmIfq0czNK";
const groupmeAPI = require('groupme').Stateless;
// const ImageService = require('groupme').ImageService;

export default async (event) => {
    const eventRecordId = event.id;
    const area = event.area;
    const interest = event.interest;
    const occurrence = event.occurrence;
    const name = event.name;
    const activities = event.activities;
    const venues = event.venues;
    const date = event.date;
    const startTime = event.startTime;
    
    // var iconDetailsObj = record.get('Icon Details');
    // var iconDetails = iconDetailsObj[0];   //extract string from object
    // var iconUrl = iconDetails.substring(iconDetails.search(" ")+2,iconDetails.length-1); //extract URL from string
    // console.log('Icon URL:',iconUrl);
    // ImageService.post.Q(iconUrl).then((res)=>{
    //     console.log(res);
    // }).catch((err)=>{
    //     console.log(err);
    // });
    
    const details = {                   //CREATE GROUPME OBJECT
        name,
        description: `${name} in the ${area} area`,
        // image_url: "",
        share: true
    };
    
    const groupMeResponse = await groupmeAPI.Groups.create.Q(ACCESS_TOKEN, details);      //CREATE GROUPME CHAT GROUP AND GET RESPONSE DATA
    const share_url = groupMeResponse.share_url;
    const groupId = groupMeResponse.group_id;
    
    axios.patch(`${baseUrl}/Events/${eventRecordId}?api_key=${airtableAPI}`, {      //ADD GROUPME INFO TO EVENT RECORD
        "fields": {
            "Chat Group": share_url,
            "GroupMe Group ID": groupId
        }
    });
    
    groupmeAPI.Members.add.Q(ACCESS_TOKEN, groupId, {members: [{nickname: 'Will', phone_number: '9144822288'}]});  //ADD WILL TO GROUP
    
    
    //Message 1
    var opts1 =  {
        message:{
            text: `Welcome to the ${name} chat group! I'm Andres, and along with my friend Will, we're the guys behind this project. This chat group consists of folks in the ${area} area who indicated an interest in ${interest} and are available on ${occurrence}s.`
        }
    };
    message(groupId,opts1);
    
    //Message 2
    var opts2 = {
        message:{
            text: `At this point, it's up to you all to decide what to do and where. Here's a list of possible activities: ${activities}.`
        }
    };
    setTimeout(()=>{message(groupId,opts2)},4000);
    
    //Message 3
    var opts3 = {
        message:{
            text: `Here's a list of possible venues: ${venues}.`
        }
    };
    setTimeout(()=>{message(groupId,opts3)},6000);
    
    //Message 4
    var opts4 = {
        message:{
            text: `The next event is set for ${date} at ${startTime}. The specific time can change, but based on availability, should happen on ${occurrence}. Once agreed to, anyone can create the event by selecting the message attachment button.`
        }
    };
    setTimeout(()=>{message(groupId,opts4)},8000);
};


//**********HELPER FUNCTION***********//

//SEND MESSAGE TO GROUP
const message = (groupId,opts) => {
    groupmeAPI.Messages.create(ACCESS_TOKEN,groupId,opts,(err, response)=>{
        if (err) {
            console.log('Message Error:',err);
        } else {
            console.log('Message sent');
        }
    });
};



//Sample Group Response:
    // { id: '35176546',
    //   group_id: '35176546',
    //   name: 'South Florida: Board Games',
    //   phone_number: '+1 4804281976',
    //   type: 'private',
    //   description: 'Board gamers in the SFL area',
    //   image_url: 'https://image.flaticon.com/icons/svg/103/103246.svg',
    //   creator_user_id: '3930736',
    //   created_at: 1507731808,
    //   updated_at: 1507731808,
    //   office_mode: false,
    //   share_url: 'https://app.groupme.com/join_group/35176546/i4nz9w',
    //   share_qr_code_url: 'https://image.groupme.com/qr/join_group/35176546/i4nz9w/preview',
    //   members: 
    //   [ { id: '283836130',
    //       user_id: '3930736',
    //       nickname: 'Andres Rodriguez',
    //       muted: false,
    //       image_url: 'https://i.groupme.com/652x652.jpeg.45935cd02eb14b38b25bbdd112e828f4',
    //       autokicked: false,
    //       roles: [Object] } ],
    //   max_memberships: 200,
    //   max_members: 200,
    //   messages: 
    //   { count: 0,
    //      last_message_id: null,
    //      last_message_created_at: null,
    //      preview: { nickname: null, text: null, image_url: null, attachments: [] } } }