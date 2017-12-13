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

export default async (availabilityRecordId, timezoneId) => {

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
        return startDatetime;
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
        return startDatetime;
    }
};