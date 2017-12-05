import axios from 'axios';

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAF7euYoPETRn3zBzuk2bPTit2QS-R6ncc',
  Promise: Promise 
});
const googleKey = 'AIzaSyAF7euYoPETRn3zBzuk2bPTit2QS-R6ncc';
const mapsBaseUrl = 'https://maps.googleapis.com/maps/api';

const airtableKey = 'keyzG8AODPdzdkhjG';
const lfgBaseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const locationBaseUrl = 'https://api.airtable.com/v0/appRj3ISj9TSjRvot';


//UPDATE LOCATION FIELDS FOR USER
const geolocateUser = async (recordId, postalCode) => {
    const placesResponse = await googleMapsClient.places({query: postalCode});  
    // const placesResponse = await axios.get(`${mapsBaseUrl}/place/textsearch/json?query=${postalCode}&key=${googleKey}`);    //DO A PLACES SEARCH ON THE POSTAL CODE TO RETURN PLACEID
        console.log('placesResponse:', placesResponse);
    // const placeId = placesResponse.data.results[0].place_id;
    const placeId = placesResponse.json.results[0].place_id;
        console.log('placeId:', placeId);
    const placeResponse = await googleMapsClient.place({placeid: placeId});
    // const placeResponse = await axios.get(`${mapsBaseUrl}place/details/json?placeid=${placeId}&key=${googleKey}`);          //DO A PLACE DETAILS LOOKUP USING PLACEID TO RETURN OBJECT CONTAINING PLACE DETAILS
        console.log('placeResponse:', placeResponse);
    // const placeDetails = placeResponse.data.result;
    //     console.log('placeDetails:', placeDetails);
    // const addressComponents = placeDetails.address_components;
    
    // const lat = placeDetails.geometry.location.lat;
    // const lng = placeDetails.geometry.location.lng;
    
    // let city, county, state, country;
    
    // for(var i = 0; i < addressComponents.length + 1; i++){                                                      //ASSIGN EACH ADDRESS COMPONENT TO THE APPROPRIATE PROPERTY
    //     if (addressComponents[i].types[0] == 'country'){
    //         country = addressComponents[i].short_name;
    //     } else if (addressComponents[i].types[0] == 'administrative_area_level_2') {
    //         county = addressComponents[i].long_name; 
    //         if (county.substr(county.length-6)=="County"){  
    //             county = county.substr(0,county.length-7);                                  //STRIP "County" FROM STRING
    //         }
    //     } else if (addressComponents[i].types[0] == 'administrative_area_level_1') {
    //         state = addressComponents[i].short_name; 
    //     } else if (addressComponents[i].types[0] == 'locality'||addressComponents[i].types[0] == 'postal_town'){
    //         city = addressComponents[i].long_name;
    //     } else if (!county && city){
    //         county = city;
    //     }  
    // }
    
    // const locationFilter = `Location="${county.trim()}, ${state.trim()}"`;
    // const locationResponse = await axios.get(`${locationBaseUrl}/Counties?filterByFormula=${locationFilter}&api_key=${airtableKey}`);
    // const msaCode = locationResponse.data.records[0].MSA_text;
    // const msaFilter = `{MSA Code}="${msaCode}"`;
    // const areaResponse = await axios.get(`${lfgBaseUrl}/Areas?filterByFormula=${msaFilter}&api_key=${airtableKey}`);
    // const areaRecordId = areaResponse.data.records[0].id;
    
    // return axios.patch(`${lfgBaseUrl}/Users/${recordId}?api_key=${airtableKey}`, {"fields": {
    //     "County": county,
    //     "City": city,
    //     "State": state,
    //     "Country": country,
    //     "Latitude": lat,
    //     "Longitude": lng,
    //     "Area": [areaRecordId]
    // }});
};


export default geolocateUser;