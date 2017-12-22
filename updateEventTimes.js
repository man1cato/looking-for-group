const axios = require('axios');
const Airtable = require('airtable');
const {getStartDatetime} = require('./src/utils/getStartDatetime');

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

const base = new Airtable({apiKey}).base('appOY7Pr6zpzhQs6l');

base('Events').select({
    view: 'Update Datetime Feed'
}).eachPage(
    function page(records, fetchNextPage) {
        records.forEach((event) => {
            const timezoneId = event.fields['Timezone ID'][0];
            const availabilityId = event.fields.Availability[0];
            getStartDatetime(availabilityId, timezoneId).then((startDatetime) => {  //GET START DATETIME
                axios.patch(`${baseUrl}/Events/${event.id}?api_key=${apiKey}`, {    //UPDATE EVENT START DATETIME
                    "fields": {
                        "Start Date & Time": startDatetime
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
