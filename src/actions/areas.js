import axios from 'axios';

const apiKey= 'keyzG8AODPdzdkhjG';

//GET_AREAS
export const getAreas = (areas) => ({
    type: 'GET_AREAS',
    areas
});

export const startGetAreas = (view) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`https://api.airtable.com/v0/appOY7Pr6zpzhQs6l/Areas?view=${view}&api_key=${apiKey}`);
            const areas = response.data.records.map((record) => ({
                id: record.id, 
                name: record.fields.Name
            }));          
            dispatch(getAreas((areas)));
        } catch (e) {
            throw new Error('Failed to retrieve areas');
        }
    };
};