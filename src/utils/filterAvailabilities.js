export default (availabilities, timeOfDay) => {
    return availabilities.filter((availability) => availability.timeOfDay === timeOfDay );
};
