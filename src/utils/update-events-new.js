const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appOY7Pr6zpzhQs6l');
const API = require('groupme').Stateless;
const googleMapsClient = require('@google/maps').createClient({key: 'AIzaSyAF7euYoPETRn3zBzuk2bPTit2QS-R6ncc', Promise: Promise});

const chats = require('./create-chat-new.js');

var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

updateEventTime();

function updateEventTime(){
    base('Events').select({
        view: "Update Datetime Feed",
        maxRecords: 5
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            console.log('Retrieved', record.get('Name'));
            var eventRecordId = record.getId();
            var eventDatetime = record.get('Start Date & Time');
            var eventStartTime = eventDatetime.split('T')[1];
            console.log('Event start time:', eventStartTime);
            var eventDayOfWeek = record.get('Day of Week')[0];   
            var area = record.get('Area')[0];
            
            googleMapsClient.places({query: area}).asPromise()                  //LOOKUP COORDINATES OF AREA TO FEED TIMEZONE QUERY
            .then((response)=>{
                var lat = response.json.results[0].geometry.location.lat;
                var lng = response.json.results[0].geometry.location.lng;
                var latLng = lat+','+lng;
                var timestamp = new Date().valueOf()/1000; //Convert to seconds for timezone API call
                
                return googleMapsClient.timezone({location: latLng, timestamp: timestamp}).asPromise();
                
            }).then((response)=>{                                               //GET LOCAL TIME FOR AREA
                var timestamp = new Date().valueOf()/1000;
                var timezoneSec = response.json.rawOffset;
                var dstSecOffset = response.json.dstOffset;
                var localDatetime = (timezoneSec+dstSecOffset+timestamp)*1000;  //Convert back to milliseconds
                
                var today = weekday[new Date(localDatetime).getDay()];  //returns name of today's weekday
                var todayIndex = weekday.indexOf(today);
                console.log('Day of week:', eventDayOfWeek);
                var eventDayIndex = weekday.indexOf(eventDayOfWeek);
                
                var daysToAdd = eventDayIndex-todayIndex;                       //...ADD DAYS...
                
                if (daysToAdd < 0) {                                            //...IF VALUE IS NEGATIVE, ADD 7...
                    daysToAdd += 7;
                }
                
                var newDatetime = new Date(localDatetime+86400000*daysToAdd).toISOString().substr(0,11)+eventStartTime;    //...THEN SET STARTDATETIME = NEW DAY AT STARTTIME
                return newDatetime;
                
            }).then((newDatetime)=>{
                base('Events').update(eventRecordId, {
                  "Start Date & Time": newDatetime
                }, function(err, record) {
                    if (err) { console.error(err); return; }
                    console.log('New datetime:',record.get('Start Date & Time'));
                });
                return newDatetime;
                
            }).then((newDatetime)=>{
                var groupId = record.get('GroupMe Group ID');
                var opts = {
                    message:{
                        text: `The next event is set for ${newDatetime}!`
                    }
                };
                chats.message(groupId,opts);                                    //CALL MESSAGE FUNCTION TO SEND MESSAGE TO GROUPME
                
            }).catch((err) => {
                console.log(err);
            });
            
        });
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}
