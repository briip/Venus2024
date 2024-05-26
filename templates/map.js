const apiKey = 'AIzaSyCREn6zRZ68S5xh7kMnUoM8M4o49qiIubY';
var locations = {};


function getEmbedUrl(lat, lon){
    var mapFrame = document.getElementById("mapiframe");
    var embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyCREn6zRZ68S5xh7kMnUoM8M4o49qiIubY&center=${lat},${lon}&zoom=15`;
    mapFrame.src = embedUrl;
    return embedUrl;
}
function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        getEmbedUrl(lat,lon);

      }, function(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

function getLocation() {
    var mapFrame = document.getElementById('mapiframe');
    var address = document.getElementById('location').value;
    var encodedAddress = encodeURIComponent(address);
    var src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;
    mapFrame.src = src;

    fetch(src)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "OK") {
                        const location = data.results[0].geometry.location;
                        console.log(location.lat, location.lng);
                    } else {
                        alert("Geocode was not successful for the following reason: " + data.status);
                    }
                })
                .catch(error => console.error('Error:', error));

}

function sendData(latitude, longitude){
  fetch('/',
  {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({latitude: latitude, longitude: longitude})
  })
  .then(response =>{
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log("Response from Flask: ", data);
    console.log(data);
  })
  .catch(error=>{
    console.error('There was a problem with your fetch operation: ', error);
  });
}