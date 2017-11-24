const axios = require('axios');

const apiKey = 'keyzG8AODPdzdkhjG';
const base = 'appOY7Pr6zpzhQs6l';
const table = 'Areas';
const view = 'Alpha Test List';


const mapAreas = (records) => {
    const areas = [];
    records.forEach((area) => {
        areas.push(area.fields.Name);
    });
    return areas;
};

const getAreas = async (view) => {
    const url = `https://api.airtable.com/v0/${base}/${table}?view=${view}&api_key=${apiKey}`;
    const response = await axios.get(url);
    return response.data.records;
};

console.log(getAreas(view));

