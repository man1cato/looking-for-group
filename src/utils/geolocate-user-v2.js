import Airtable from 'airtable';
const base = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appOY7Pr6zpzhQs6l');
const locationBase = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appRj3ISj9TSjRvot');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAF7euYoPETRn3zBzuk2bPTit2QS-R6ncc',
  Promise: Promise 
});


//**PRIMARY FUNCTION**//

//UPDATE LOCATION FIELDS FOR USER
const updateUserLocationFields = async (userRecordId) => {
    const postalCode = await getPostalCode(userRecordId); 
    const locationDetails = await getLocationDetails(postalCode); 
    const msaCode = await getMSACode(locationDetails);
    const areaRecordId = await getAreaRecordId(msaCode);
    
    base('Users').update(userRecordId, {
        "County": locationDetails.county,
        "City": locationDetails.city,
        "State": locationDetails.state,
        "Country": locationDetails.country,
        "Postal Code": locationDetails.postalCode,
        "Latitude": locationDetails.lat,
        "Longitude": locationDetails.lng,
        "Area": [areaRecordId]
    }, function(err, record) {
        if (err) { console.error(err); return; }
        console.log(`${record.get('Name')} was updated`);
    });
};


//**HELPER FUNCTIONS**//

//FIND SELECTED USER AND RETURN POSTAL CODE
const getPostalCode = (userRecordId) => {
    return new Promise((resolve,reject) => {
        base('Users').find(userRecordId, function(err, record) {
            if (err) { console.error('User not found', err); return; }
            
            console.log('Retrieved:', record.get('Full Name'));
            resolve(record.get('Postal Code'));
        });
    });
};

    
//GET LOCATION INFO FROM POSTAL CODE 
const getLocationDetails = async (postalCode) => {
    const placesResponse = await googleMapsClient.places({query: `${postalCode}`});                             //DO A PLACES SEARCH ON THE POSTAL CODE TO RETURN PLACEID
    const placeResponse = await googleMapsClient.place({placeid: placesResponse.json.results[0].place_id});     //DO A PLACE DETAILS LOOKUP USING PLACEID TO RETURN OBJECT CONTAINING PLACE DETAILS
    
    var placeDetails = placeResponse.json.result;
    var locationDetails = {
        'lat': placeDetails.geometry.location.lat,
        'lng': placeDetails.geometry.location.lng
    };
    var addressComponents = placeDetails.address_components;
    
    return new Promise((resolve, reject) => {
        for(var i = 0;i<addressComponents.length+1;i++){                                                        //ASSIGN EACH ADDRESS COMPONENT TO THE APPROPRIATE PROPERTY
            if (i==addressComponents.length){
                console.log('Final locationDetails:',locationDetails);
                resolve(locationDetails);
            } else if (addressComponents[i].types[0] == 'country'){
                locationDetails.country = addressComponents[i].short_name;
            } else if (addressComponents[i].types[0] == 'administrative_area_level_2') {
                var county = addressComponents[i].long_name; 
                if (county.substr(county.length-6)=="County"){  
                    locationDetails.county = county.substr(0,county.length-7);                                  //STRIP "County" FROM STRING
                }
            } else if (addressComponents[i].types[0] == 'administrative_area_level_1') {
                locationDetails.state = addressComponents[i].short_name; 
            } else if (addressComponents[i].types[0] == 'locality'||addressComponents[i].types[0] == 'postal_town'){
                locationDetails.city = addressComponents[i].long_name;
            } else if (addressComponents[i].types[0] == 'postal_code'||addressComponents[i].types[1] == 'postal_code'){
                locationDetails.postalCode = addressComponents[i].short_name;
            } else if (!locationDetails.county && locationDetails.city){
                locationDetails.county = locationDetails.city;
            }  
        }
    });
};

//FIND COUNTY IN "LOCATION DATA" BASE AND RETURN MSA
const getMSACode = (locationDetails) => {
    var county = locationDetails.county;
    var state = locationDetails.state;
    var locationFormula = `Location = "${county.trim()}, ${state.trim()}"`;
    
    return new Promise((resolve,reject) => {
        locationBase('Counties').select({
            filterByFormula: locationFormula
        }).firstPage(function page(err, records) {
            if (err) { console.error(err); return; }
            
            resolve(records[0].get('MSA_text'));
        });
    });
};

//FIND MSA IN "LFG BASE" AND RETURN PROMISE WITH RECORD ID
const getAreaRecordId = (msaCode) => {
    var filterFormula = `{MSA Code} = "${msaCode}"`;
    
    return new Promise((resolve,reject)=> {
        base('Areas').select({
            filterByFormula: filterFormula
        }).firstPage(function(err, records) {
            if (err) { console.error(err); return; }
            
            resolve(records[0].getId());
        });
    });
};


module.exports = {
    updateUserLocationFields,
    getPostalCode,
    getLocationDetails,
    getMSACode,
    getAreaRecordId
};