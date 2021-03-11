//Load geoJSON 

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//Initialize Map, Street and Earthquakes Layers
//Adjust View to Show Californian Coastline
var mymap = L.map("map", {center: [37.73379, -122.44676], zoom: 6});

//Use CartoDB.Positron As Basemap
var lyrCDB = L.tileLayer.provider('CartoDB.Positron');
mymap.addLayer(lyrCDB);

var lyrEathquakes;

//Using AJAX to load queryURL and Call Function
lyrEathquakes = L.geoJSON.ajax(queryURL, {pointToLayer: eqkMarkers}).addTo(mymap);

//Show Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    var magRates = [0, 1, 2, 3, 4, 5];

    //Loop magRates 
    for (var i = 0; i < magRates.length; i++) {
        //Create Labels for Legends
        div.innerHTML +=
            '<i style="background-color:' + getColor(magRates[i]) + '"></i> ' +
            magRates[i] + (magRates[i + 1] ? '&ndash;' + magRates[i + 1] +"<br>" : '+');
    }
    return div;
};

legend.addTo(mymap);

//Set Colours
function getColor(d) {
    // use conditional operator (?:) to return suitable color scheme
    return d < 1 ? '#ecffb3' :
           d < 2 ? '#ffcc66' :
           d < 3 ? '#ff9900' :
           d < 4 ? '#e68a00' :
           d < 5 ? '#b36b00' :
           d > 5 ? '#ff0000' :
                    '#ff0000';
}

//Create Function to add Markers 
function eqkMarkers(json, latlng) {
    optColor = json.properties.mag;

    //Create a Circle Marker for Each Feature
    var myMarkers = L.circleMarker(latlng, {radius:optColor*6, color:'black',
                                fillColor:getColor(optColor),
                                weight: 0.3, fillOpacity:0.8});

    //Set Label to Popup on Click
    myMarkers.bindPopup("<h5>" + json.properties.place + "</h5><hr>"
                         + new Date(json.properties.time),{interactive:true});
    return myMarkers;
}