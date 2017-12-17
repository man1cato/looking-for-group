// export default (availabilities, timeOfDay) => {
//     return availabilities.filter((availability) => availability.timeOfDay === timeOfDay );
// };

export default (availabilities, dayOfWeek) => {
    return availabilities.filter((availability) => availability.dayOfWeek === dayOfWeek );
};
