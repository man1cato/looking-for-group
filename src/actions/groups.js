import axios from 'axios';
import _ from 'lodash';

const apiKey= process.env.AIRTABLE_API_KEY;
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
                    interest: group.data.fields["Interest Name"],
                    availability: group.data.fields["Group Availability"]
                });
            }
            const sortedGroups = _.orderBy(groups, ['interest'], ['asc']);
            dispatch(getGroups((sortedGroups)));
        } catch (e) {
            throw new Error('Failed to retrieve groups in startGetGroups');
        }
    };
};


//UPDATE_GROUPS
export const updateGroups = (groups) => ({
    type: 'UPDATE_GROUPS',
    groups
});

export const startUpdateGroups = (areaRecordId, userInterests) => {
    return async (dispatch) => {
        try {
            let groups = [];
            for (let interestRecordId of userInterests) {
                const filter = `AND({Interest Record ID}="${interestRecordId}",{Area Record ID}="${areaRecordId}")`;
                const response = await axios.get(`${baseUrl}/Groups?filterByFormula=${filter}&api_key=${apiKey}`);
                const group = response.data.records[0];
                groups.push({
                    id: group.id, 
                    area: group.fields["Area Text"],
                    interest: group.fields["Interest Name"],
                    availability: group.fields["Group Availability"]
                });
            }
            const sortedGroups = _.orderBy(groups, ['interest'], ['asc']);
            console.log('from startUpdateGroups:',sortedGroups);
            dispatch(updateGroups(sortedGroups));
        } catch (e) {
            throw new Error('Update groups failed at startUpdateGroups');
        }
        
    };
};