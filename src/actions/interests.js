import axios from 'axios';

const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';
const apiKey = 'keyzG8AODPdzdkhjG';


//GET_INTERESTS
export const getInterests = (interests) => ({
    type: 'GET_INTERESTS',
    interests
});

export const startGetInterests = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${baseUrl}/Interests?sort[0][field]=Interest&sort[0][direction]=asc&api_key=${apiKey}`);
            const interests = response.data.records.map((record) => ({
                id: record.id,
                name: record.fields.Interest
            }));
            dispatch(getInterests(interests));
        } catch (e) {
            throw new Error('Call to Airtable Interests table failed');
        }
    };
};

