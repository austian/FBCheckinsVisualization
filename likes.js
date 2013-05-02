//Asynchonous retrieval of the FB query info off my web server and construction of the heatmap from the data
$.post("http://www.alexustian.com/likes.php",
  function(data)  {

    $("#status").text("Done!");

    var heatMapData = [];
    var length = data.length;

    for(var i = 0; i < length; i++)  {
      heatMapData[i] = {location: new google.maps.LatLng(data[i].latitude, data[i].longitude), weight: data[i].likes};
      
      if(data[i].likes > 10)  {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
          map: map,
          icon: {path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, scale: 2},
          title: data[i].name + ", Number of Likes: " + data[i].likes
        });
      }
    }

  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData, radius: 30, maxIntensity: 3000
  });

  heatmap.setMap(map);
  }, "json");

//Map options
var shortNorth = new google.maps.LatLng(39.977216,-83.003597);

var mapOptions = {
  center: shortNorth,
  zoom: 16,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};

//Map styling
var styles = [ { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [ { "color": "#808080" } ] },{ "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#737373" } ] },{ "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] },{ "elementType": "labels.text.fill", "stylers": [ { "color": "#ffffff" } ] },{ "featureType": "administrative.land_parcel", "elementType": "geometry.stroke", "stylers": [ { "color": "#808080" } ] },{ "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [ { "color": "#808080" }, { "gamma": 2 } ] },{ "featureType": "poi.park", "stylers": [ { "color": "#646464" } ] },{ "featureType": "transit", "stylers": [ { "visibility": "off" } ] },{ "featureType": "poi.business", "stylers": [ { "visibility": "off" } ] },{ "featureType": "poi.business", "elementType": "geometry", "stylers": [ { "visibility": "simplified" } ] },{ "featureType": "poi.park", "elementType": "labels.text", "stylers": [ { "color": "#ffffff" } ] },{ "featureType": "poi.school", "stylers": [ { "visibility": "off" } ] },{ "featureType": "poi.medical", "stylers": [ { "visibility": "off" } ] },{ "featureType": "poi.place_of_worship", "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ } ]

//On page load, construct the base map        
$(document).ready(function()  {
  map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
  map.setOptions({styles: styles});
});



