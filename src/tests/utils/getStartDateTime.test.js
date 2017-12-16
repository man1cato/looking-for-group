import getStartDatetime from '../../utils/getStartDatetime';
import availabilities from '../fixtures/availabilities';
import group from '../fixtures/group';


test('should create event startDatetime based on location', () => {
    const availabilityId = availabilities[5].id;
    const timezoneId = group.timezoneId;
    const startDatetime = getStartDatetime(availabilityId,timezoneId);
    
    expect(startDatetime).toBeA('Object');
});
