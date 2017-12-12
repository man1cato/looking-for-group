// import axios from 'axios';
// import moment from 'moment-timezone';
const axios = require('axios');
const moment = require('moment-timezone');

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

const googleMapsClient = require('@google/maps').createClient({key: 'AIzaSyAF7euYoPETRn3zBzuk2bPTit2QS-R6ncc', Promise: Promise});


const geolocateAreas = async () => {
    const areaResponse = await axios.get(`${baseUrl}/Areas?view=To+Geolocate&maxRecords=30&api_key=${apiKey}`);
    const areas = areaResponse.data.records;
    // console.log('areas:', areas);
    
    for (let area of areas) {
        const name = area.fields.Name;
        const areaRecordId = area.id;
        
        const placesResponse = await googleMapsClient.places({query: name}).asPromise();                  //LOOKUP COORDINATES OF AREA TO FEED TIMEZONE QUERY
        // console.log('placesResponse:',placesResponse.json.results[0]);
        const lat = placesResponse.json.results[0].geometry.location.lat;
        const lng = placesResponse.json.results[0].geometry.location.lng;
        const latLng = lat+','+lng;
        const timestamp = moment().unix();    //Timezone API call requires seconds
        
        const timezoneResponse = await googleMapsClient.timezone({location: latLng, timestamp: timestamp}).asPromise();     //GET LOCAL TIME FOR AREA
        // console.log('timezoneResponse:',timezoneResponse.json);
        const timezoneId = timezoneResponse.json.timeZoneId;
        const timezoneName = timezoneResponse.json.timeZoneName;
        
        axios.patch(`${baseUrl}/Areas/${areaRecordId}?api_key=${apiKey}`, {
            "fields": {
                "Latitude": lat,
                "Longitude": lng,
                "Timezone ID": timezoneId,
                "Timezone Name": timezoneName
            }
        });
        
        // const timezoneSec = timezoneResponse.json.rawOffset;
        // const dstSecOffset = timezoneResponse.json.dstOffset;
        // const localDatetime = (timezoneSec+dstSecOffset+timestamp)*1000;  //Convert to milliseconds
        
    }
};

geolocateAreas();
