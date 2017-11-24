const ACCESS_TOKEN = "vig9CESvrYoT1rLFhjsuAmggHX2NtwpmIfq0czNK";
var API = require('groupme').Stateless;
var ImageService = require('groupme').ImageService;
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appOY7Pr6zpzhQs6l');

function createGroupMe(){
    base('Events').select({
        maxRecords: 1,
        view: "Create Chat Feed"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            console.log('Retrieved', record.get('Name'));
            var eventRecordId = record.getId();
            var area = record.get('Area');
            var interest = record.get('Interest').toString();
            var occurrence = record.get('Occurrence');
            var name = record.get('Name');
            var activities = record.get('Activities');
            var venues = record.get('Venue Suggestions').toString();
            var startDatetime = new Date(record.get('Start Date & Time')).toDateString();
    
            // var iconDetailsObj = record.get('Icon Details');
            // var iconDetails = iconDetailsObj[0];   //extract string from object
            // var iconUrl = iconDetails.substring(iconDetails.search(" ")+2,iconDetails.length-1); //extract URL from string
            // console.log('Icon URL:',iconUrl);
            // ImageService.post.Q(iconUrl).then((res)=>{
            //     console.log(res);
            // }).catch((err)=>{
            //     console.log(err);
            // });
                
            createGroupDetails(name, area).then((response)=>{
                return API.Groups.create.Q(ACCESS_TOKEN, response);
            }).then((response)=>{
                console.log('New group:',response.name);
                var share_url = response.share_url;
                var groupId = response.group_id;
                
                addShareUrl(eventRecordId, share_url, groupId);
                API.Members.add.Q(ACCESS_TOKEN, groupId, {members: [{nickname: 'Will', phone_number: '9144822288'}]});  //ADD WILL
                
                return groupId;
                
            }).then((groupId)=>{                                                    //SEND INTRO MESSAGES FROM US
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
                        text: `The next event is set for ${startDatetime}. The specific time can change, but based on availability, should happen on ${occurrence}. Once agreed to, anyone can create the event by selecting the message attachment button.`
                    }
                };
                
                setTimeout(()=>{message(groupId,opts4)},8000);
                
                return;
                
            }).catch((err)=>{
                console.log(err);
            });
            
        });
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}


//**********FUNCTIONS***********//

//CREATE THE OPTS OBJECT FOR THE CREATE GROUP CALL
function createGroupDetails(name, area){
    // console.log('Triggered createGroupDetails');
    return new Promise((resolve,reject)=>{
        var details = {
            name: name,
            description: `${name} in the ${area} area`,
            // image_url: "",
            share: true
        };
        console.log('Group details:', details);
        resolve(details);
    });
}

//ADD GROUPME URL TO AIRTABLE EVENT RECORD
function addShareUrl(eventRecordId,share_url,groupId){
    console.log('Triggered addshareUrl');
    base('Events').update(eventRecordId, {
      "Chat Group": share_url,
      "GroupMe Group ID": groupId
    }, function(err, record) {
        if (err) { console.error(err); return; }
        console.log(record.get('Name'));
    });
}


//SEND MESSAGE TO GROUP
function message(groupId,opts){
    API.Messages.create(ACCESS_TOKEN,groupId,opts,(err, response)=>{
        if (err) {
            console.log('Message Error:',err);
        } else {
            console.log('Message sent');
        }
    });
}

//EXPORTS
module.exports = {
    createGroupMe: createGroupMe,
    createGroupDetails: createGroupDetails,
    message: message
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