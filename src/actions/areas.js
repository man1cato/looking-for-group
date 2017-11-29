import axios from 'axios';

const apiKey= 'keyzG8AODPdzdkhjG';

//SET_AREAS
export const setAreas = (areas) => ({
    type: 'SET_AREAS',
    areas
});

export const startSetAreas = (view) => {
    return (dispatch) => {
        return axios.get(`https://api.airtable.com/v0/appOY7Pr6zpzhQs6l/Areas?view=${view}&api_key=${apiKey}`).then((response) => {
            const areas = response.data.records.map((record) => ({
                id: record.id, 
                name: record.fields.Name
            }));          
            dispatch(setAreas((areas)));
        });
    };
};