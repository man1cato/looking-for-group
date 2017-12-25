function getPlaceDetails(recordId, postalCode) {
    const service = new google.maps.places.PlacesService(document.getElementById('map'));
    service.textSearch({query: postalCode}, function (response, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            const placeId = response[0].place_id;
            service.getDetails({placeId}, function (placeDetails, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    console.log('Place details:', placeDetails);
                    const element = document.createElement('div');
                    element.id = 'placeDetails';
                    element.style.visibility = 'hidden';
                    element.innerHTML = JSON.stringify(placeDetails);
                    return document.getElementById('scriptBlock').appendChild(element);
                }
            });
        }
    });
}
