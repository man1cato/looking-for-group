function reverseGeocode(lat, lng) {
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({location: {lat,lng}}, function (response, status) {
        if (status === 'OK') {
          if (response[0]) {
            console.log('Geocoder response:', response[0]);
            const element = document.createElement('div');
            element.id = 'geocoder';
            element.style.visibility = 'hidden';
            element.innerHTML = JSON.stringify(response[0]);
            return document.getElementById('scriptBlock').appendChild(element);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
       
    });
}
