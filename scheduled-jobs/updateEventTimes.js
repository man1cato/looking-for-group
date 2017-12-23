const axios = require('axios');
const moment = require('moment');
const Airtable = require('airtable');
const {getStartDatetime} = require('./getStartDatetime');

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const base = new Airtable({apiKey}).base('appOY7Pr6zpzhQs6l');
const groupmeBaseUrl = 'https://api.groupme.com/v3';
const ACCESS_TOKEN = '47ae92f0c4190135d3e50f90f2367d88';


base('Events').select({
    view: 'Update Datetime Feed'
}).eachPage(
    function page(records, fetchNextPage) {
        records.forEach((event) => {
            const timezoneId = event.fields['Timezone ID'][0];
            const availabilityId = event.fields.Availability[0];
            const groupId = event.fields['GroupMe Group ID'];
            const occurrence = event.fields.Occurrence;
            
            getStartDatetime(availabilityId, timezoneId).then((startDatetime) => {  //GET START DATETIME
                axios.patch(`${baseUrl}/Events/${event.id}?api_key=${apiKey}`, {    //UPDATE EVENT START DATETIME
                    "fields": {
                        "Start Date & Time": startDatetime
                    }
                });
                const date = moment(startDatetime).format('MMM Do');
                const startTime = moment(startDatetime).format('LT');
                axios.post(`${groupmeBaseUrl}/groups/${groupId}/messages?access_token=${ACCESS_TOKEN}`, {       //SEND NEW DATE & TIME MESSAGE TO GROUP CHAT
                    "message": {
                        "text": `The next event is set for ${date} at ${startTime}. The specific time can change, but based on availability, should happen on ${occurrence}.`
                    }
                    
                });
                console.log('Updated event:', event.fields.Name);
            }).catch((e) => {
                console.log('Failed at', event.fields.Name);
                console.log('timezoneId',timezoneId);
                console.log('availabilityId',availabilityId);
            });
        });
        
    fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    }
);
