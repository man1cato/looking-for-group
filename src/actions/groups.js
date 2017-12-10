import axios from 'axios';
import _ from 'lodash';

const apiKey= 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';

//GET_GROUPS
export const getGroups = (groups) => ({
    type: 'GET_GROUPS',
    groups
});

export const startGetGroups = (usersGroups) => {
    return async (dispatch) => {
        try {
            let groups = [];
            for (let groupRecordId of usersGroups) {
                const group = await axios.get(`${baseUrl}/Groups/${groupRecordId}?api_key=${apiKey}`);
                groups.push({
                    id: group.data.id, 
                    area: group.data.fields["Area Text"],
                    interest: group.data.fields["Interest Name"]
                });
            }
            const sortedGroups = _.orderBy(groups, ['interest'], ['asc']);
            dispatch(getGroups((sortedGroups)));
        } catch (e) {
            throw new Error('Failed to retrieve groups in startGetGroups');
        }
    };
};