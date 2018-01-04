import axios from 'axios';

const apiKey = 'keyzG8AODPdzdkhjG';
const lfgBaseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


//UPDATE LOCATION FIELDS FOR USER
export default (userId, placeDetails) => {
    console.log('placeDetails:',placeDetails);
    const addressComponents = placeDetails.address_components;

    const lat = placeDetails.geometry.location.lat;
    const lng = placeDetails.geometry.location.lng;
    const country = addressComponents.find((component) => component.types[0] === 'country').short_name;     //Two-letter identifier
    
    let state = addressComponents.find((component) => component.types[0] === 'administrative_area_level_1');
    state = state && state.short_name.trim();    //Two-letter identifier
    
    let city = addressComponents.find((component) => component.types[0] === 'locality' || component.types[0] === 'postal_town');     
    city = city && city.long_name.trim();   //Full name
    
    let county = addressComponents.find((component) => component.types[0] === 'administrative_area_level_2');     
    if (county) {  
        county = county.long_name;
        if (county.substr(county.length-6) === "County") {              //IF "County" FOUND IN NAME...
            county = county.substr(0,county.length-7);                  //STRIP "County" FROM STRING
        }
    } else if (!county && city) {                                       //IF COUNTY NOT FOUND...
        county = city;                                                  //SET EQUAL TO CITY
    }
    county = county.trim();

    const locationFilter = `{Location}="${county}, ${state}"`;
    console.log('locationFilter from geolocateUser:', locationFilter);    
    return axios.get(`https://api.airtable.com/v0/appRj3ISj9TSjRvot/Counties?filterByFormula=${locationFilter}&api_key=${apiKey}`).then((locationResponse) => {
        const msaCode = locationResponse.data.records[0].fields.MSA_text;
        const msaFilter = `{MSA Code}="${msaCode}"`;
        return axios.get(`${lfgBaseUrl}/Areas?filterByFormula=${msaFilter}&api_key=${apiKey}`);
    }).then((areaResponse) => {
        const areaId = areaResponse.data.records[0].id;
        axios.patch(`${lfgBaseUrl}/Users/${userId}?api_key=${apiKey}`, {
            "fields": {
                "County": county,
                "City": city,
                "State": state,
                "Country": country,
                "Latitude": lat,
                "Longitude": lng,
                "Area": [areaId]
            }
        });
        return areaId;
    }).catch((e) => {
        console.log('Error at geolocateUser:', e);
    });
};