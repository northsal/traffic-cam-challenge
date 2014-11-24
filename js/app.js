// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };

    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    var infoWindow = new google.maps.InfoWindow();

    var stations;
    var markers = [];

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            stations = data;

            data.forEach(function(station, itemIndex) {
                var marker = new google.maps.Marker( {
                    position: {
                        lat: Number(station.location.latitude),
                        lng: Number(station.location.longitude)
                    },
                    map: map,
                    index: itemIndex
                });
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
                    var html = '<h2>' + station.cameralabel + '</h2>';
                    html += '<img src="' +station.imageurl.url + '"></img';
                    /*var position = marker.getPostion();
                    map.panTo(position);*/

                    var position = marker.getPosition();
                    map.panTo(position);


                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                });
            });
        })
        .fail(function(error) {})
        .always(function() {});
    
    $('#search').bind('search keyup', function() {
        var key = $('#search').val().toLowerCase();
        console.log(key);
        markers.forEach(function(marker) {
            var stat = stations[marker.index];
            var search = stat.cameralabel.toLowerCase();
            if(search.indexOf(key) !== -1 ) {
                marker.setMap(map);
            } else {
                marker.setMap(null);
            }
        });
    });

});
