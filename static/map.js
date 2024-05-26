const apiKey = 'AIzaSyCREn6zRZ68S5xh7kMnUoM8M4o49qiIubY';
var locations = [{'name': '1736 Family Crisis Center', 
'address': '2116 Arlington Ave, Suite 200, Los Angeles, CA', 
'hours': '24 Hrs-Crisis Hotline Service/Intake and Hotline (213) 222-1237, 24 Hrs-Youth Crisis/Shelter Hotline Service/Intake and Hotline (310) 379-3620, 24 Hrs-DV Shelter Hotline Service/Intake and Hotline (310) 370-5902, Community Service Center Service/Intake an', 
'phone': 'NULL', 
'email': 'www.1736fcc.org', 
'description': 'The agency provides case management, counseling services, domestic violence services, family support services for low income families, runaway services, emergency and transitional shelter for battered women and their children, shelter for runaway/homeless youth, and welfare-to-work support services. \xa0Services are provided at two community service center locations in South Los Angeles and Torrance, an emergency youth shelter in Hermosa Beach, and four confidentially located domestic violence shelters.', 'zipcode': '90018', 'latitude': 34.03745995, 'longitude': -118.3175215},
{'name': '1736 Family Crisis Center', 'address': '2116 Arlington Ave, Suite 200, Los Angeles, CA', 
'hours': '24 Hrs-Crisis Hotline Service/Intake and Hotline (213) 222-1237, 24 Hrs-Youth Crisis/Shelter Hotline Service/Intake and Hotline (310) 379-3620, 24 Hrs-DV Shelter Hotline Service/Intake and Hotline (310) 370-5902, Community Service Center Service/Intake an', 
'phone': 'NULL', 'email': 'www.1736fcc.org', 'description': 'The agency provides case management, counseling services, domestic violence services, family support services for low income families, runaway services, emergency and transitional shelter for battered women and their children, shelter for runaway/homeless youth, and welfare-to-work support services. \xa0Services are provided at two community service center locations in South Los Angeles and Torrance, an emergency youth shelter in Hermosa Beach, and four confidentially located domestic violence shelters.', 
'zipcode': '90018', 'latitude': 34.03745995, 'longitude': -118.3175215},
{'name': '1736 Family Crisis Center', 'address': '2116 Arlington Ave, Suite 200, Los Angeles, CA', 'hours': '24 Hrs-Crisis Hotline Service/Intake and Hotline (213) 222-1237, 24 Hrs-Youth Crisis/Shelter Hotline Service/Intake and Hotline (310) 379-3620, 24 Hrs-DV Shelter Hotline Service/Intake and Hotline (310) 370-5902, Community Service Center Service/Intake an', 'phone': 'NULL', 'email': 'www.1736fcc.org', 'description': 'The agency provides case management, counseling services, domestic violence services, family support services for low income families, runaway services, emergency and transitional shelter for battered women and their children, shelter for runaway/homeless youth, and welfare-to-work support services. \xa0Services are provided at two community service center locations in South Los Angeles and Torrance, an emergency youth shelter in Hermosa Beach, and four confidentially located domestic violence shelters.', 'zipcode': '90018', 'latitude': 34.03745995, 'longitude': -118.3175215}]

function generateResult(data=locations){
  for(let i=0; i<data.length; i++){
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

function getLocation() {
    var mapFrame = document.getElementById('mapiframe');
    var address = document.getElementById('location').value;
    var encodedAddress = encodeURIComponent(address);
    var src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;
    mapFrame.src = src;
    var filter = document.getElementById("filter").value;
    var response = sendData(address, filter);
    if(response){
      generateResult(response);
    }
    else{
      generateResult();
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

function sendData(zipcode=null, filter=null){
  fetch('/',
  {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({'zipcode': zipcode, 'filter': filter})
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