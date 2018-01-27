import axios from 'axios';
import _ from 'lodash';
import haversine from 'haversine';
import Airtable from 'airtable';

const apiKey = process.env.AIRTABLE_API_KEY;
const lfgBaseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const base = new Airtable({apiKey}).base('appOY7Pr6zpzhQs6l');

//UPDATE LOCATION FIELDS FOR USER
export default (userId, userLat, userLng) => {
    let areas = [];
    
    return new Promise((resolve,reject) => {
        base('Areas').select().eachPage(function page(records, fetchNextPage) {
            records.forEach((record) => {
                areas.push({
                    id: record.id,
                    distance: haversine({latitude: userLat, longitude: userLng},{latitude:record.fields.Latitude, longitude:record.fields.Longitude})
                });
            });
            
            fetchNextPage();
        }, function done(err) {
            if (err) { console.error(err); reject; }
            
            console.log('Areas:',areas);
            const distances = _.compact(areas.map((area) => area.distance));
            const minDistance = Math.min(...distances);
            const areaId = areas.find((area) => area.distance === minDistance && area.id).id;
            
            console.log('From newGeolocateUser - distances:',distances,'minDistance:',minDistance,'areaId:',areaId);
        
            axios.patch(`${lfgBaseUrl}/Users/${userId}?api_key=${apiKey}`, {
                "fields": {
                    "Latitude": userLat,
                    "Longitude": userLng,
                    "Area": [areaId]
                }
            });
            
            resolve(areaId);
        });
    });
};