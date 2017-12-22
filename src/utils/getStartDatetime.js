import axios from 'axios';
import moment from 'moment-timezone';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

export default async (availabilityId, timezoneId) => {

    const response = await axios.get(`${baseUrl}/Availability/${availabilityId}?api_key=${apiKey}`);
    const availability = response.data;
    // console.log('');
    const dayOfWeek = availability.fields['Day of Week'];
    // console.log('dayOfWeek:',dayOfWeek);

    const startTime = availability.fields['Start Time'];
    // console.log('startTime:',startTime);
    
    const localDatetime = moment().utc().tz(timezoneId).format();   //CURRENT LOCAL DATETIME
    // console.log('localDatetime:',localDatetime);
    
    const localTime = moment(localDatetime).utc().tz(timezoneId).format('HH:mm:ss');
    // console.log('localTime:',localTime);
    const today = moment(localDatetime).format('dddd');

    let startDatetime;
            
    if (today === dayOfWeek && localTime < startTime){                   //IF DAY IS TODAY AND LOCAL TIME NOW IS BEFORE START TIME, SET STARTDATETIME = TODAY AT STARTTIME...
        // console.log('Event is today');
        startDatetime = localDatetime.substr(0,11)+startTime; //Datetime format: YYYY-MM-DDThh:mm:ss.sTZD (eg 1997-07-16T19:20:30.45+01:00)
        // console.log('startDatetime:',startDatetime);
        return startDatetime;
    } else {                                                            //ELSE TAKE LOCALDATETIME...
        // console.log('Event is after today');
        const todayIndex = weekday.indexOf(today);
        const availabilityIndex = weekday.indexOf(dayOfWeek);
        let daysToAdd = availabilityIndex-todayIndex;                   //...ADD DAYS...
        
        if (daysToAdd < 0) {                                            //...IF VALUE IS NEGATIVE, ADD 7...  
            daysToAdd += 7;
        }
        startDatetime = moment(localDatetime).add(daysToAdd, 'days').format().substr(0,11)+startTime; //...THEN SET STARTDATETIME = NEW DAY AT STARTTIME
        // console.log('startDatetime:',startDatetime);
        return startDatetime;
    }
};