const apiKey = 'keyzG8AODPdzdkhjG';
const axios = require('axios');

//COMPOSE THE URL
const composeAirtableUrl = (baseId, tableName, parameters) => {
    var url = `https://api.airtable.com/v0/${baseId}/${tableName}?`;
    if (parameters) {
        for(var key in parameters) {
            url = url.concat(`${key}=${parameters[key]}&`);
        }
    }
    url = url.concat(`api_key=${apiKey}`);
    return url;
};


//USE AXIOS TO PERFORM A GET REQUEST
const getRecordIds = async (requestUrl) => {
    const response = await axios.get(requestUrl);
    return response.data.records.map((user) => {
        return user.id;
    });
};

module.exports = {
    composeAirtableUrl,
    getRecordIds
};