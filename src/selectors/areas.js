import airtable from 'airtable';
import axios from 'axios';

const apiKey = 'keyzG8AODPdzdkhjG';
const base = 'appOY7Pr6zpzhQs6l';
const table = 'Areas';
const view = 'Alpha Test List';


const selectAreas = async () => {
    const requestUrl = `https://api.airtable.com/v0/${base}/${table}?view=${view}&api_key=${apiKey}`;
    const response = await axios.get(requestUrl);
    return response.data.records.map((record) => {
        return record.fields.Name;
    });
};


export default selectAreas;