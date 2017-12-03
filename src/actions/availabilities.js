import axios from 'axios';

const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const apiKey = 'keyzG8AODPdzdkhjG';


//GET_AVAILABILITY
export const getAvailabilities = (availabilities) => ({
    type: 'GET_AVAILABILITIES',
    availabilities
});

export const startGetAvailabilities = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${baseUrl}/Availability?sort[0][field]=Order&sort[0][direction]=asc&api_key=${apiKey}`);
            const availabilities = response.data.records.map((record) => ({
                recordId: record.id,
                name: record.fields.Name,
                dayOfWeek: record.fields['Day of Week'],
                timeOfDay: record.fields['Time of Day']
            }));
            dispatch(getAvailabilities(availabilities));
        } catch (e) {
            throw new Error('Call to Airtable Availability table failed');
        }
    };
};