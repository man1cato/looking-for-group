const axios = require('axios');
const moment = require('moment');
const Airtable = require('airtable');
// const {getStartDatetime} = require('./sched-getStartDatetime');

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


const weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

const getStartDatetime = async (availabilityId, timezoneId) => {
    const response = await axios.get(`${baseUrl}/Availability/${availabilityId}?api_key=${apiKey}`);
    const availability = response.data;
    const dayOfWeek = availability.fields['Day of Week'];
    const startTime = availability.fields['Start Time'];
    const localDatetime = moment().utc().tz(timezoneId).format();   //CURRENT LOCAL DATETIME
    const localTime = moment(localDatetime).utc().tz(timezoneId).format('HH:mm:ss');
    const today = moment(localDatetime).format('dddd');

    let startDatetime;
    if (today === dayOfWeek && localTime < startTime){                   //IF DAY IS TODAY AND LOCAL TIME NOW IS BEFORE START TIME, SET STARTDATETIME = TODAY AT STARTTIME...
        startDatetime = localDatetime.substr(0,11)+startTime; //Datetime format: YYYY-MM-DDThh:mm:ss.sTZD (eg 1997-07-16T19:20:30.45+01:00)
        return startDatetime;
    } else {                                                            //ELSE TAKE LOCALDATETIME...
        const todayIndex = weekday.indexOf(today);
        const availabilityIndex = weekday.indexOf(dayOfWeek);
        let daysToAdd = availabilityIndex-todayIndex;                   //...ADD DAYS...
        if (daysToAdd < 0) {                                            //...IF VALUE IS NEGATIVE, ADD 7...  
            daysToAdd += 7;
        }
        startDatetime = moment(localDatetime).add(daysToAdd, 'days').format().substr(0,11)+startTime; //...THEN SET STARTDATETIME = NEW DAY AT STARTTIME
        return startDatetime;
    }
};