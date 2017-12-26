export default (groupData) => ({
    id: groupData.id, 
    area: groupData.fields["Area Text"],
    interest: groupData.fields["Interest Name"],
    availabilityIds: groupData.fields["Group Availability"],
    userIds: groupData.fields.Users,
    userCount: groupData.fields["User Count"],
    events: groupData.fields.Events,
    eventCount: groupData.fields["Event Count"],
    icons: groupData.fields.Icon[0].thumbnails,
    timezoneId: groupData.fields["Timezone ID"][0]
});