function getPlaceDetails(recordId, postalCode) {
    let request = {query: postalCode};
    const service = new google.maps.places.PlacesService(document.getElementById('map'));
    service.textSearch(request, (response, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log('textSearch response:', response);
            const placeId = response[0].place_id;
            request = {placeId};
            service.getDetails(request, (placeDetails, status) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    console.log('getDetails response:', placeDetails);
                    
                    const element = document.createElement('div');
                    element.id = 'placeDetails';
                    element.style.visibility = 'hidden';
                    element.innerHTML = JSON.stringify(placeDetails);
                    return document.body.appendChild(element);
                }
            });
        }
    });
}
