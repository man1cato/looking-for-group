import axios from 'axios';

const apiKey= 'keyzG8AODPdzdkhjG';

//SET_USER
export const setUser = (user = {}) => ({
    type: 'SET_USER',
    user
});

export const startSetUser = ({uid, email}) => {
    const filterFormula = `{Email}="${email}"`;
    return async (dispatch) => {
        try {
            //SEARCH AIRTABLE FOR USER'S EMAIL
            const response = await axios.get(`https://api.airtable.com/v0/appOY7Pr6zpzhQs6l/Users?filterByFormula=${filterFormula}&api_key=${apiKey}`);
            //IF EMAIL FOUND, GATHER PROFILE INFO
            if (response.data.records.length > 0) {
                const user = {
                    recordId: response.data.records[0].id,
                    firstName: response.data.records[0].fields['First Name'],
                    lastName: response.data.records[0].fields['Last Name'],
                    email: response.data.records[0].fields.Email
                };
                //IF FIREBASE ID NOT PRESENT IN RECORD, ADD TO RECORD
                if(!response.data.records[0].fields['Firebase ID']) {
                    axios.patch(`https://api.airtable.com/v0/appOY7Pr6zpzhQs6l/Users/${user.recordId}?api_key=${apiKey}`, 
                        {"fields": {
                            "Firebase ID": uid
                        }}
                    );
                }
                dispatch(setUser(user));
            } else {
                dispatch(setUser());
            }
        } catch (e) {
            throw new Error('Call to airtable Users table failed');
        }
    };
};