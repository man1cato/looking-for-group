const filterAvailabilities = (availabilities, timeOfDay) => {
    return availabilities.filter((availability) => availability.timeOfDay === timeOfDay );
};

export default filterAvailabilities;