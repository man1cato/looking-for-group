import axios from 'axios';

const apiKey= 'keyzG8AODPdzdkhjG';

//SET_USER
export const setUser = (user) => ({
    type: 'SET_USER',
    user
});

export const startSetUser = (uid) => {
    const filterFormula = `{Firebase ID}="${uid}"`;
    return async (dispatch) => {
        try {
            const response = await axios.get(`https://api.airtable.com/v0/appOY7Pr6zpzhQs6l/Users?filterByFormula=${filterFormula}&api_key=${apiKey}`);
            const user = {
                recordId: response.data.records[0].id,
                firstName: response.data.records[0].fields['First Name'],
                lastName: response.data.records[0].fields['Last Name'],
                email: response.data.records[0].fields.Email
            };
            console.log('from startSetUser:',user);
            dispatch(setUser(user));
        } catch (e) {
            throw new Error('Unable to find user');
        }
    };
};