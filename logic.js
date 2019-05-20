// Create a map object
var myMap = L.map("map", {
  center: [39.7392, -104.9903],
  zoom: 5
});

// Create simple map layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

function getColor(m) {
  return m > 5 ? '#e34a33' :
         m > 4 ? '#fdbb84' :
         m > 3 ? '#fee8c8' :
         m > 2 ? '#f7fcb9' :
         m > 1 ? '#addd8e' :
                 '#31a354';
}

// Earthquale in the past 7 days
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define how to display a geoJSON "Point"
function pointToLayer (feature, latlng) {
  
  var displayOpts = {
    radius: feature.properties.mag * 4,
    weight: 1,
    fillColor : getColor(feature.properties.mag),
    fillOpacity: 0.8
  };
  return L.circleMarker( latlng, displayOpts )
}

// Add popup
function onEachFeature (feature, layer) {

  layer.bindPopup(`<h3>${feature.properties.title}</h3>`)

}

d3.json(url, function(data) {

  L.geoJSON(data, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var labels = []
    for (var i = 0; i < grades.length; i++) {
      labels.push(`<i style="background:${getColor(grades[i]+1)}"></i>` + 
      grades[i] + (grades[i+1]? '-' + grades[i+1] + '<br>' : '+'));
    }
    div.innerHTML = labels.join("")
    console.log(div.innerHTML)
    return div;
  };

  legend.addTo(myMap);
});



