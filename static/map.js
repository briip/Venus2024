const apiKey = 'AIzaSyDqxeiEnKm-D4k2aHBWsPHfZ454_OMnXow';

var default_locations = [{'name': "Default Women's And Children's Crisis Shelter", 'address': '13305 Penn St, NULL, Whittier, CA', 'hours': 'Administrative (562) 945-3937,  Service/Intake and Hotline (562) 945-3939', 'phone': 'NULL', 'email': 'NULL', 'description': 'The agency provides domestic violence services for low-income victims of intimate partner domestic violence and their children from all areas of Los Angeles County.', 'zipcode': '90602', 'latitude': 33.97583807, 'longitude': -118.0335874}]
var locations_from_zip= [];

function generateResult(data=default_locations){
    var max_cards =5;
  for(let i=0; i<max_cards; i++){
    var shelter_name = document.getElementById(`shelter_name${i+1}`);
    console.log(shelter_name);
    var shelter_info = document.getElementById(`shelter_info${i+1}`);
    if(! shelter_name || !shelter_info){
      break
    }
    shelter_name.textContent = data[i]['name'];
    shelter_info.innerHTML = `Address: ${data[i]['address']}<br>` +
                                 `${data[i]['phone'] != 'NULL'? `Phone: ${data[i]['phone']}<br>` : ' '}`
                                 + `Information: ${data[i]['hours']}`;
    console.log(data[i]);
    var map = getEmbedUrl(data[i]['latitude'],data[i]['longitude'],`result${i+1}mapframe`);
  }

}
function getEmbedUrl(lat, lon, frame="mapiframe"){
    var mapFrame = document.getElementById(frame);
    var embedUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyCREn6zRZ68S5xh7kMnUoM8M4o49qiIubY&center=${lat},${lon}&zoom=15`;
    mapFrame.src = embedUrl;
    return embedUrl;
}

//When the "Use my location" button is clicked
function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        getEmbedUrl(lat,lon);
        var filter = document.getElementById("filter").value;

        var response = sendData(null,filter);
        if(response){
          generateResult(response);
        }
        else{
          generateResult();
        }
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

//When the zip code is entered
function getLocation() {
    var mapFrame = document.getElementById('mapiframe');
    var address = document.getElementById('location').value;
    var encodedAddress = encodeURIComponent(address);
    var src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;
    mapFrame.src = src;
    var filter = document.getElementById("filter").value;
    sendData(address, filter);

    if(locations_from_zip){
      generateResult(locations_from_zip);
    }
    else{
      generateResult();
      //generateResult(locations_from_zip);
    }

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

//send data from website to python/flask
function sendData(zipcode=null, filter=null){

    const zipcode_object = { zipcode: zipcode };

  fetch('/', {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},

      // Convert the data object to a JSON string and send as the request body
    body: JSON.stringify(zipcode_object)
  })
 .then(response => response.json())
  .then(locations_from_py => {

      locations_from_zip = locations_from_py;

    })
  .catch(error=>{
    console.error('There was a problem with your fetch operation: ', error);
  });
}

function getShelterLocation(data){
  let location_list = [];
  for(let i=0; i<data.length; i++){
    var current_data = data[i];
    location_list.push(current_data);

  }
  return location_list;
}
