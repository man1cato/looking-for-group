import axios from 'axios';
import Airtable from 'airtable';
import getStartDatetime from './src/utils/getStartDatetime';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

const base = new Airtable({apiKey}).base('appOY7Pr6zpzhQs6l');

base('Events').select().eachPage(
    function page(records, fetchNextPage) {
        records.forEach(async (event) => {
            const timezoneId = event.fields['Timezone ID'][0];
            const availabilityId = event.fields.Availability[0];
            const startDatetime = await getStartDatetime(availabilityId, timezoneId);
            
            axios.patch(`${baseUrl}/Events/${event.id}?api_key=${apiKey}`, {    //UPDATE EVENT START TIME
                "fields": {
                    "Start Date & Time": startDatetime
                }
            });
        });
        
    fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    }
);
