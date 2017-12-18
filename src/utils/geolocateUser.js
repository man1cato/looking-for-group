import axios from 'axios';

const apiKey = 'keyzG8AODPdzdkhjG';
const lfgBaseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


//UPDATE LOCATION FIELDS FOR USER
export default (recordId, placeDetails) => {
    console.log('placeDetails:',placeDetails);
    const addressComponents = placeDetails.address_components;

    const lat = placeDetails.geometry.location.lat;
    const lng = placeDetails.geometry.location.lng;
    const country = addressComponents.find((component) => component.types[0] === 'country').short_name;
    const state = addressComponents.find((component) => component.types[0] === 'administrative_area_level_1').short_name.trim();
    const city = addressComponents.find((component) => component.types[0] === 'locality' || component.types[0] === 'postal_town').long_name.trim();

    let county = addressComponents.find((component) => component.types[0] === 'administrative_area_level_2').long_name;
    if (county.substr(county.length-6) === "County") {  
        county = county.substr(0,county.length-7);                                  //STRIP "County" FROM STRING
    } else if (!county && city) {
        county = city;
    }
    county = county.trim();

    const locationFilter = `{Location}="${county}, ${state}"`;
    
    return axios.get(`https://api.airtable.com/v0/appRj3ISj9TSjRvot/Counties?filterByFormula=${locationFilter}&api_key=${apiKey}`).then((locationResponse) => {
        const msaCode = locationResponse.data.records[0].fields.MSA_text;
        const msaFilter = `{MSA Code}="${msaCode}"`;
        return axios.get(`${lfgBaseUrl}/Areas?filterByFormula=${msaFilter}&api_key=${apiKey}`);
    }).then((areaResponse) => {
        const areaId = areaResponse.data.records[0].id;
        axios.patch(`${lfgBaseUrl}/Users/${recordId}?api_key=${apiKey}`, {
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