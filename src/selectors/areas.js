import airtable from 'airtable';
import axios from 'axios';
import {connect} from 'react-redux';

const apiKey = 'keyzG8AODPdzdkhjG';
const base = 'appOY7Pr6zpzhQs6l';
const table = 'Areas';


const getAreas = (view) => {
    const url = `https://api.airtable.com/v0/${base}/${table}?view=${view}&api_key=${apiKey}`;
    const areas = [];
    return axios.get(url).then((res) => {
        res.data.records.forEach((record) => {
            areas.push(record.fields.Name);
        });
    });
};


export default getAreas();