var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appOY7Pr6zpzhQs6l');
var locationBase = new Airtable({apiKey: 'keyzG8AODPdzdkhjG'}).base('appRj3ISj9TSjRvot');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAF7euYoPETRn3zBzuk2bPTit2QS-R6ncc',
  Promise: Promise 
});


exports.geolocate = function(userRecordId){
    //SELECT THE NEW USER
    return new Promise((resolve,reject)=>{
        base('Users').find(userRecordId, function(err, record) {
            if (err) { console.error('User not found', err); return; }
            else {
                console.log('step2');
                resolve({
                    'userRecordId': userRecordId, 
                    'userName': record.get('Full Name'), 
                    'userEmail': record.get('Email'), 
                    'postalCode': record.get('Postal Code')
                });
            }
        });
    })
    //DO A PLACES SEARCH ON THE ZIP CODE TO RETURN PLACEID
    .then((response)=>{
        return googleMapsClient.places({query: `${response.postalCode}`}).asPromise();
    })
    //DO A PLACE DETAILS LOOKUP USING PLACEID TO RETURN COUNTY
    .then((response)=>{
        return googleMapsClient.place({placeid: response.json.results[0].place_id}).asPromise();
    })
    //GET LOCATION INFO FROM PLACE DETAILS RESPONSE 
    .then((response)=>{
        return new Promise((resolve,reject)=>{
            
            var address_components = response.json.result.address_components;
            var locationResults = {
                'lat': response.json.result.geometry.location.lat,
                'lng': response.json.result.geometry.location.lng
            };
            
            for(var i = 0;i<address_components.length+1;i++){
                if (i==address_components.length){
                    console.log('Final locationResults:',locationResults);
                    resolve(locationResults);
                } else if (address_components[i].types[0] == 'country'){
                    locationResults.country = address_components[i].short_name;
                } else if (address_components[i].types[0] == 'administrative_area_level_2') {
                    var county = address_components[i].long_name; 
                    if (county.substr(county.length-6)=="County"){  
                        locationResults.county = county.substr(0,county.length-7); //STRIP "County" FROM STRING
                    }
                } else if (address_components[i].types[0] == 'administrative_area_level_1') {
                    locationResults.state = address_components[i].short_name; 
                } else if (address_components[i].types[0] == 'locality'||address_components[i].types[0] == 'postal_town'){
                    locationResults.city = address_components[i].long_name;
                } else if (address_components[i].types[0] == 'postal_code'||address_components[i].types[1] == 'postal_code'){
                    locationResults.postalCode = address_components[i].short_name;
                } else if (!locationResults.county && locationResults.city){
                    locationResults.county = locationResults.city;
                }  
            }
            
        });
    })
    //FIND COUNTY IN "LOCATION DATA" BASE AND RETURN MSA
    .then((response)=>{
        return new Promise((resolve,reject)=>{
            var county = response.county;
            var state = response.state;
            var locationFormula = `Location = "${county.trim()}, ${state.trim()}"`;
            console.log(locationFormula);
            
            locationBase('Counties').select({
                filterByFormula: locationFormula
            }).firstPage(function page(err, records) {
                if (err) { console.error(err); return; }
                records.forEach(function(record) {
                    response.msa = record.get('MSA_text');
                    resolve(response);
                });
            });
        });
    })
    //FIND MSA IN "LFG BASE" AND RETURN RECORD ID
    .then((response)=>{
        return new Promise((resolve,reject)=>{
            var areaFormula = `{MSA Code} = "${response.msa}"`;
            base('Areas').select({
                filterByFormula: areaFormula
            }).firstPage(function(err, records) {
                if (err) { console.error(err); return; }
                records.forEach(function(record) {
                    response.areaRecordId = record.getId();
                    console.log('Retrieved', record.get('Name'), response.areaRecordId);
                    resolve(response);
                });
            });
        });
    })
    //UPDATE LOCATION FIELDS FOR USER
    .then((response)=>{
        return new Promise((resolve,reject)=>{
            base('Users').update(userRecordId, {
                "County": response.county,
                "City": response.city,
                "State": response.state,
                "Country": response.country,
                "Postal Code": response.postalCode,
                "Latitude": response.lat,
                "Longitude": response.lng,
                "Area": [response.areaRecordId]
            }, function(err, record) {
                if (err) { console.error(err); return; }
                else {
                    resolve(userRecordId); 
                }
            });
        });
    })
    .catch((err)=>{
      console.log('ERROR AT GEOLOCATE USER:',err); 
    });
};