var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appOY7Pr6zpzhQs6l');

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAF7euYoPETRn3zBzuk2bPTit2QS-R6ncc',
  Promise: Promise 
});

exports.addVenues = function(){
    base('Groups').select({
        view: 'Get Venues Feed',
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        records.forEach(function(record) {
            console.log('Retrieved group:', record.get('Name'));
            var query = record.get('Venue Query');
            var groupRecordId = record.getId();
            
            googleMapsClient.places({query: query}).asPromise()                     //SEND QUERY TO GOOGLE AND TRIGGER FUNCTIONS TO RETURN VENUES
            .then((response)=>{
                return getPlaceIds(groupRecordId, response.json.results, []);
            }).catch((err)=>{
                console.log('ERROR',err);
            });
        });
    });
}




//*********FUNCTIONS*********//


function getPlaceIds(groupRecordId, queryResults, placeIds){
    if (queryResults.length>5) {                                                //IF > 5 RESULTS, CUT DOWN TO TOP 5 AND TRIGGER RECURSION
        var results = queryResults.slice(0,5);
        getPlaceIds(groupRecordId,results,placeIds);
    } else if(queryResults.length>0){                                           //ELSE BUILD PLACEIDS ARRAY THROUGH RECURSION
        var targetPlace = queryResults.shift();
        placeIds.push(targetPlace.place_id);
        getPlaceIds(groupRecordId,queryResults,placeIds);
    } else {
        placeIds.forEach(function(placeId){
            updateVenues(groupRecordId, placeId);                               //THEN DO A DETAILS LOOKUP OF EACH PLACEID AND UPDATE/CREATE VENUES
        });
    }
}


function updateVenues(groupRecordId, placeId) {
    googleMapsClient.place({placeid: placeId}, function(err, response){
        if (!err) {
            var name = response.json.result.name;
            var mapsUrl = response.json.result.url;
            var websiteUrl = response.json.result.website;
            var placeId = response.json.result.place_id;
            var filterFormula = `{Google Place ID} = "${placeId}"`;
            console.log('RESPONSE:',name, 'formula:',filterFormula);
            
            base('Venues').select({                                             //LOOK UP PLACEID IN VENUES TABLE
                filterByFormula: filterFormula
            }).firstPage(function(err, records) {
                if (err) { 
                    console.error(err); return; 
                } else if (records.length==0) {                                 //IF VENUE DOESN'T EXIST, CREATE IT
                    console.log(`Venue ${name} doesn't exist. Creating...`);
                    base('Venues').create({
                      "Name": name,
                      "Google Maps URL": mapsUrl,
                      "Google Place ID": placeId,
                      "Website": websiteUrl,
                      "Groups": [groupRecordId]
                    }, function(err, record) {
                        if (err) { console.error(err); return; }
                        console.log('Created new venue:',name);
                    });
                    
                } else {                                                        //ELSE IF VENUE EXISTS...
                    console.log(`Venue ${name} exists. Updating...`);
                    records.forEach(function(record) {
                        console.log('Retrieved venue:', record.get('Name'));
                        var venueRecordId = record.getId();
                        var groups = record.get('Groups');                      //...GRAB ARRAY OF EXISTING LINKED GROUPS...
                        groups.push(groupRecordId);                             //...PUSH NEW GROUP TO ARRAY...
                        console.log('Groups:',groups);
                        
                        base('Venues').update(venueRecordId, {                  //..THEN UPDATE GROUPS FOR VENUE 
                          "Groups": groups
                        }, function(err, record) {
                            if (err) { console.error(err); return; }
                            console.log('Updated record:',record.get('Name'));
                        });
                    });
                }
            });
          
        } else if (err === 'timeout') {
          // Handle timeout.
          console.log('TIMEOUT ERROR');
        } else if (err.json) {
          // Inspect err.status for more info.
          console.log('JSON ERROR:',err.status);
        } else {
          // Handle network error.
          console.log('NETWORK ERROR:', err);
        }
    });
}