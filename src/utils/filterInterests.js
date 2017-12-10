import _ from 'lodash';

export default (interests, filteringInterests) => {        //array of objects, array
    const filterArray = filteringInterests.map((interestId) => _.find(interests, ['id', interestId]) );
    const filteredInterests = _.difference(interests, filterArray);
    return filteredInterests;
};