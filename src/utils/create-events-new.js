var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appOY7Pr6zpzhQs6l');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAF7euYoPETRn3zBzuk2bPTit2QS-R6ncc',
  Promise: Promise 
});

var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

function setEventTime(){
    base('Groups').select({
        view: "Create Events Feed"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            console.log('Retrieved', record.get('Name'));
            var area = record.get('Area Text');
            var groupRecordId = record.getId();
            var groupAvailabilityRecordIds = record.get('Group Availability');  //array of availability record IDs
            // var areaTimezone = record.get('Timezone');
            
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
                
                return setStartDatetime(groupRecordId,groupAvailabilityRecordIds,localDatetime);     //TRIGGER SET START DATETIME FUNCTION
                
            }).catch((err) => {
                console.log(err);
            });
        });
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}


//*****FUNCTIONS*****//

function setStartDatetime(groupRecordId, groupAvailabilityRecordIds, localDatetime){
    groupAvailabilityRecordIds.forEach((availability)=>{                        //FOR EACH AVAILABILITY...
        base('Availability').find(availability, function(err, record) {         //...LOOK UP THE CORRESPONDING DAY & TIME
            if (err) { console.error(err); return; }
            
            var availabilityRecordId = record.getId();
            var localTime = new Date(localDatetime).toTimeString().substr(0,8);
            var dayOfWeek = record.get('Day of Week');
            var startTime = record.get('Start Time');
            var today = weekday[new Date(localDatetime).getDay()];  //returns name of today's weekday
            var startDatetime;
            
            if (today == dayOfWeek && localTime < startTime){                   //IF DAY IS TODAY AND LOCAL TIME NOW IS BEFORE START TIME, SET STARTDATETIME = TODAY AT STARTTIME...
                console.log('Event is today');
                startDatetime = new Date(localDatetime).toISOString().substr(0,11)+startTime; //Datetime format: YYYY-MM-DDThh:mm:ss.sTZD (eg 1997-07-16T19:20:30.45+01:00)
                console.log('Start Date & Time:',startDatetime);
                console.log(" ");
                createEvent(groupRecordId,startDatetime, availabilityRecordId); //...CREATE OR UPDATE EVENT
                
            } else {                                                            //ELSE TAKE LOCALDATETIME...
                console.log('Event is after today');
                var todayIndex = weekday.indexOf(today);
                var availabilityIndex = weekday.indexOf(dayOfWeek);
                var daysToAdd = availabilityIndex-todayIndex;                   //...ADD DAYS...
                
                if (daysToAdd < 0) {                                            //...IF VALUE IS NEGATIVE, ADD 7...  
                    daysToAdd += 7;
                }
                
                startDatetime = new Date(localDatetime+86400000*daysToAdd).toISOString().substr(0,11)+startTime;    //...THEN SET STARTDATETIME = NEW DAY AT STARTTIME
                console.log('Start Date & Time:',startDatetime);
                console.log(" ");
                createEvent(groupRecordId,startDatetime, availabilityRecordId); //CREATE OR UPDATE EVENT
            }
        });
    });
}
    

function createEvent(groupRecordId, startDatetime, availabilityRecordId){
    var filterFormula = `AND({Group Record ID} = "${groupRecordId}", {Availability Record ID} = "${availabilityRecordId}")`;
    
    base('Events').select({
        filterByFormula: filterFormula
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        
        if (records.length === 0) {                                             //IF EVENT DOESN'T EXIST, CREATE IT
            console.log("Event doesn't exist");
            base('Events').create({
              "Group": [groupRecordId],
              "Start Date & Time": startDatetime,
              "Availability": [availabilityRecordId]
            }, function(err, record) {
                if (err) { console.error(err); return; }
                console.log(record.get('Name'));
            });
            
        } else {                                                                //IF EVENT EXISTS, UPDATE IT
            console.log("Event exists");
            records.forEach(function(record) {
                var eventRecordId = record.getId();
                console.log('Retrieved', record.get('Name'));
                
                base('Events').update(eventRecordId, {
                  "Start Date & Time": startDatetime
                }, function(err, record) {
                    if (err) { console.error(err); return; }
                    console.log(record.get('Start Date & Time'));
                });
            });
        }
    });
}


//EXPORTS
module.exports = {
    setEventTime: setEventTime,
    setStartDatetime: setStartDatetime
};
