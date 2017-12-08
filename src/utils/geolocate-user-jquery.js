$(document).ready(function() {
    $("#profile-button").click(function() {
        const service = new google.maps.places.PlacesService($('#service-helper').get(0));
        service.textSearch({query: '33157'}, (response, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                const placeId = response.data.results[0].place_id;
                service.getDetails({placeid: placeId}, (response) => {
                    const placeDetails = response.data.result;
                    console.log('placeDetails:', placeDetails);
                });
            }
        });
    });
});

