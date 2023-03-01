
function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + "Location: " + feature.properties.place +
      "</h3><hr><p>" + "<b>Magnitude Scale:</b> " + feature.properties.mag + "<br/> <b>Depth:</b> " + feature.geometry.coordinates[2] + " Km <br/>"  
        + "<b>Time:</b> " + new Date(feature.properties.time) + "</p>");
  }

  function circleSize(feature){
    radius = feature.properties.mag
    return radius * 6;
  }

  function circleColor(feature){
    depth = feature.geometry.coordinates[2]

    if (depth < 5){
        color = 'red'
    } else if (depth <10){
        color = 'orange'
    } else {
        color = 'green'
    }

    return color;
  }
  
// Define streetmap map layer
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
});

// Define topographic map layer
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
});

// Define a baseMaps object to hold our base layers
let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
let myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [streetmap]     //default selected layer
});

streetmap.addTo(myMap);

let earthquakes = new L.LayerGroup();

let overlayMaps = {
    Earthquakes: earthquakes
  };

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  const queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Use D3 to pull all geojason earthquake data
  d3.json(queryUrl).then(function(data) {

    // Once we get a response, send the data.features object to the createFeatures function
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    L.geoJSON(data, {
      onEachFeature: popUpMsg,
      pointToLayer: function(feature, latlong){
        return new L.CircleMarker(latlong, {
            radius : circleSize(feature),
            fillOpacity: 0.7
        });
      },
      style:function(feature){
        return {color: circleColor(feature)}
      }
    }).addTo(earthquakes);
  
    // Here are some additional examples:  https://geospatialresponse.wordpress.com/2015/07/26/leaflet-geojson-pointtolayer/ 
  
    earthquakes.addTo(myMap);

// Create a legend to display information about our map.
var legend = L.control({
    position: "bottomright"
  });

// When the layer control is added, insert a div with the class of "legend".
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");

    // labels = ['<strong>Categories</strong>'],
    // categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];
    var colorChange = [0,5,10];
    var labels = [];

    div.innerHTML += '<h4> <strong> Depth Categories in Kilometers </strong> </h4>';

    // loop through colorChange and generate a label with a colored square for each interval
    for (var i = 0; i < colorChange.length; i++) {
        div.innerHTML +=
            '<i style="background:' + circleColor({geometry: {coordinates: [0, 0, colorChange[i]]}}) + '"></i> ' +
            colorChange[i] + (colorChange[i + 1] ? '&ndash;' + colorChange[i + 1] + ' km<br>' : '+ km');
    }

    div.innerHTML = '<div style="background-color: white; padding: 5px; border: 1px solid black;">' + div.innerHTML + '</div>';

    return div;
  };

// Add the info legend to the map.
legend.addTo(myMap);

// SAMPLE PSEUDOCODE BELOW NOT USED...

// legend.onAdd = function () {
//     var div = L.DomUtil.create('div', 'info legend');
//     var depthColors = [-10, 10, 30, 50, 70, 90];
//     var labels = [];



//     return div;
// };

// legend.onAdd = function(){
//     var div = L.DomUtil.create('div','info legend')
//     // define separations of colors (5,10,blue)
//     colorChange = [0,5,10]
//     // colors of the legend
//     color = ['red','orange','blue']
//     // for loop to use info and create boxes
//         // Just finish building the for loop
//         // for loop i, innn HTML
//     // there is a style.css, you'll have to add extra in there to make this work
// };
// legend.addTo(myMap);

// IN CSS file
// .legend i {
//     width: 15px;
//     height: 15px;
//     float: screenLeft;
//     margin-right: 5px;
// }

// Google leaflet how do I add a legend

  });