import axios from 'axios';
import moment from 'moment-timezone';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

const now = moment();

const weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

export default async (group) => {
    const groupRecordId = group.id;
    const groupAvailabilityRecordIds = group.fields['Group Availability'];  //array of availability record IDs
    const timezoneId = group.fields['Timezone ID'];
    
    for (let availabilityRecordId of groupAvailabilityRecordIds) {
        const response = await axios.get(`${baseUrl}/Availability/${availabilityRecordId}?api_key=${apiKey}`);
        const availability = response.data;
        const dayOfWeek = availability.fields['Day of Week'];
        const startTime = availability.fields['Start Time'];
        
        const localDatetime = moment.tz(now, timezoneId).valueOf(); 
        const localTime = moment(localDatetime).format('HH:mm:ss');
        const today = moment(localDatetime).format('dddd');
        
        let startDatetime;
        
        if (today === dayOfWeek && localTime < startTime){                   //IF DAY IS TODAY AND LOCAL TIME NOW IS BEFORE START TIME, SET STARTDATETIME = TODAY AT STARTTIME...
            console.log('Event is today');
            startDatetime = moment(localDatetime).toISOString().substr(0,11)+startTime; //Datetime format: YYYY-MM-DDThh:mm:ss.sTZD (eg 1997-07-16T19:20:30.45+01:00)
            console.log('Start Date & Time:',startDatetime);
            console.log(" ");
            updateEvent(groupRecordId,startDatetime, availabilityRecordId); //...CREATE OR UPDATE EVENT
            
        } else {                                                            //ELSE TAKE LOCALDATETIME...
            console.log('Event is after today');
            var todayIndex = weekday.indexOf(today);
            var availabilityIndex = weekday.indexOf(dayOfWeek);
            var daysToAdd = availabilityIndex-todayIndex;                   //...ADD DAYS...
            
            if (daysToAdd < 0) {                                            //...IF VALUE IS NEGATIVE, ADD 7...  
                daysToAdd += 7;
            }
            
            startDatetime = moment(localDatetime+86400000*daysToAdd).toISOString().substr(0,11)+startTime;    //...THEN SET STARTDATETIME = NEW DAY AT STARTTIME
            console.log('Start Date & Time:',startDatetime);
            console.log(" ");
            updateEvent(groupRecordId,startDatetime, availabilityRecordId); //CREATE OR UPDATE EVENT
        }
    }  
};


//*****HELPER FUNCTION*****//

const updateEvent = async (groupRecordId, startDatetime, availabilityRecordId) => {
    const filter = `AND({Group Record ID}="${groupRecordId}", {Availability Record ID}="${availabilityRecordId}")`;
    const eventResponse = await axios.get(`${baseUrl}/Events?filterByFormula=${filter}&api_key=${apiKey}`);
    const event = eventResponse.data.records[0];
    
    if (event) {                                                                //IF EVENT DOESN'T EXIST, CREATE IT
        console.log("Event doesn't exist");
        return axios.post(`${baseUrl}/Events?api_key=${apiKey}`, {
            "fields": {
                "Group": [groupRecordId],
                "Start Date & Time": startDatetime,
                "Availability": [availabilityRecordId]
            }
        });
    } else {                                                                    //IF EVENT EXISTS, UPDATE IT
        console.log("Event exists");
        console.log('Retrieved', event.fields.Name);
        const eventRecordId = event.id;
        return axios.patch(`${baseUrl}/Events/${eventRecordId}?api_key=${apiKey}`, {
            "fields": {
                "Start Date & Time": startDatetime
            }
        });
    }
};