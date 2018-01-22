import axios from 'axios';

const apiKey= process.env.AIRTABLE_API_KEY;

//GET_AREAS
export const getArea = (area) => ({
    type: 'GET_AREA',
    area
});

export const startGetArea = (areaRecordId) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`https://api.airtable.com/v0/appOY7Pr6zpzhQs6l/Areas/${areaRecordId}?api_key=${apiKey}`);
            const area = {
                id: response.data.id, 
                name: response.data.fields.Name,
                timezoneId: response.data.fields["Timezone ID"]
            };          
            dispatch(getArea((area)));
        } catch (e) {
            throw new Error('Failed to retrieve areas');
        }
    };
};