function getPlaceDetails(recordId, postalCode) {
    const service = new google.maps.places.PlacesService(document.getElementById('map'));
    service.textSearch({query: postalCode}, (response, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            const placeId = response[0].place_id;
            service.getDetails({placeId}, (placeDetails, status) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
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