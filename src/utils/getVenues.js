import axios from 'axios';

const apiKey = 'keyzG8AODPdzdkhjG';
const lfgBaseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appOY7Pr6zpzhQs6l');

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAF7euYoPETRn3zBzuk2bPTit2QS-R6ncc',
  Promise: Promise 
});

export const addVenues = (group) => {
    const query = group.fields['Venue Query'];
    const groupRecordId = group.id;
    
    googleMapsClient.places({query: query}).asPromise().then((response) => {                     //SEND QUERY TO GOOGLE AND TRIGGER FUNCTIONS TO RETURN VENUES
        return getPlaceIds(groupRecordId, response.json.results, []);
    }).catch((err)=>{
        console.log('ERROR',err);
    });
};




//*********FUNCTIONS*********//


function getPlaceIds(groupRecordId, queryResults, placeIds){
    if (queryResults.length>5) {                                                //IF > 5 RESULTS, CUT DOWN TO TOP 5 AND TRIGGER RECURSION
        const results = queryResults.slice(0,5);
        getPlaceIds(groupRecordId, results, placeIds);
    } else if(queryResults.length>0){                                           //ELSE BUILD PLACEIDS ARRAY THROUGH RECURSION
        const targetPlace = queryResults.shift();
        placeIds.push(targetPlace.place_id);
        getPlaceIds(groupRecordId, queryResults, placeIds);
    } else {
        placeIds.forEach(function(placeId){
            updateVenues(groupRecordId, placeId);                               //THEN DO A DETAILS LOOKUP OF EACH PLACEID AND UPDATE/CREATE VENUES
        });
    }
}


function updateVenues(groupRecordId, placeId) {
    googleMapsClient.place({placeid: placeId}, (err, response) => {
        if (!err) {
            var name = response.json.result.name;
            var mapsUrl = response.json.result.url;
            var websiteUrl = response.json.result.website;
            var placeId = response.json.result.place_id;
            var filterFormula = `{Google Place ID}="${placeId}"`;
            console.log('RESPONSE:',name, 'formula:',filterFormula);
            
            axios.get(`${lfgBaseUrl}/Venues?filterByFormula=${filterFormula}&api_key=${apiKey}`).then((response) => {
                
                if (response.data.records.length==0) {                                 //IF VENUE DOESN'T EXIST, CREATE IT
                    console.log(`Venue ${name} doesn't exist. Creating...`);
                    axios.post(`${lfgBaseUrl}/Venues?api_key=${apiKey}`, {
                        "fields": {
                            "Name": name,
                            "Google Maps URL": mapsUrl,
                            "Google Place ID": placeId,
                            "Website": websiteUrl,
                            "Groups": [groupRecordId]
                        }
                    });
                } else {                                                        //ELSE IF VENUE EXISTS...
                    console.log(`Venue ${name} exists. Updating...`);
                    const venueRecordId = response.data.records[0].id;
                    const groups = response.data.records[0].fields.Groups;                      //...GRAB ARRAY OF EXISTING LINKED GROUPS...
                    groups.push(groupRecordId);                             //...PUSH NEW GROUP TO ARRAY...

                    axios.patch(`${lfgBaseUrl}/Venues/${venueRecordId}?api_key=${apiKey}`, {
                        "fields": {
                            "Groups": groups
                        }
                    });
                }    
            });
        }
    });
}