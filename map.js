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