const apiKey = 'AIzaSyCREn6zRZ68S5xh7kMnUoM8M4o49qiIubY';
var locations = [{'name': "Women's And Children's Crisis Shelter", 'address': '13305 Penn St, NULL, Whittier, CA', 'hours': 'Administrative (562) 945-3937,  Service/Intake and Hotline (562) 945-3939', 'phone': 'NULL', 'email': 'NULL', 'description': 'The agency provides domestic violence services for low-income victims of intimate partner domestic violence and their children from all areas of Los Angeles County.', 'zipcode': '90602', 'latitude': 33.97583807, 'longitude': -118.0335874},
{'name': 'Homeless Shelter For Women And Children', 'address': '4513 E. Compton Blvd., NULL, Compton, CA', 'hours': 'NULL', 'phone': 'NULL', 'email': 'www.cwroshelter.org', 'description': 'The Agency Provides Shelter For Homeless Single Women And Women With Children Who Are In Los Angeles County.  The Shelter May Assist Women Who Have Mental/Emotional Problems; The Shelter Is Also Accessible For Women Who Use Wheelchairs.', 'zipcode': '90221', 'latitude': 33.89643599, 'longitude': -118.1927356}, {'name': 'Womenshelter Of Long Beach', 'address': '930 Pacific Ave., NULL, Long Beach, CA', 'hours': 'Service/Intake and Administration (562) 437-7233,  FAX (562) 436-4943, 562) HER HOME - 24 hrs. Service/Intake and Hotline (562) 437-4663', 'phone': 'NULL', 'email': 'www.womenshelterlb.com/', 'description': 'The agency provides shelter and domestic violence services for victims of domestic violence and their children as well as volunteer opportunities for individuals living in Los Angeles County.', 'zipcode': '90813', 'latitude': 33.778375, 'longitude': -118.1933}, {'name': 'Interval House', 'address': '6615 E. Pacific Coast Highway, Outreach Office| Suite 170, Long Beach, CA', 'hours': 'Administrative (562) 594-9492, L A County - 24 hours Service/Intake and Hotline (562) 594-4555', 'phone': 'NULL', 'email': 'www.intervalhouse.org', 'description': "This agency provides domestic violence services, a battered women's shelter for battered women and their children and welfare-to-work support services to battered women who receive CalWORKs and live primarily in the Long Beach and the surrounding areas.", 'zipcode': '90803', 'latitude': 33.755173, 'longitude': -118.108203},
{'name': 'Doors Of Hope', 'address': '529 Broad Ave, NULL, Wilmington, CA', 'hours': 'Service/Intake and Administration (310) 518-3667,  FAX (310) 513-6113', 'phone': 'NULL', 'email': 'www.doorsofhopewomensshelter.org', 'description': 'The agency provides shelter for single women in Los Angeles County.', 'zipcode': '90744', 'latitude': 33.7766381, 'longitude': -118.2610311}]

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
    return getShelterLocation(response.json());
  })
  .then(data => {
    console.log("Response from Flask: ", data);
    console.log(data);
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