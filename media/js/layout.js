if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};

var myApi = (function(options) {
	var shared = {},
		options = options || {}

	var myLatlng = new google.maps.LatLng(32.7574, -97.3332);
	var styles = 
		[{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#91A898"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#5691E0"},{"visibility":"on"}]}];
	var styledMap = new google.maps.StyledMapType(styles,
		{
			name: "Styled Map"
		});
	var mapOptions = {
		zoom: 3,
		center: myLatlng,
		mapTypeControlOptions: {
		mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		}
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var infowindow = new google.maps.InfoWindow({
		content: " "
	});
	var marker;		
	var geocoder;
	var newLat;
	var newLong;
	var newContent;
	var venueName;
	var venueCity;
	var venueRegion;
	var buyTickets;

	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');	

	function setupListeners() {
		setupMapSearch();
	}

	function setupMapSearch() {
		$('button').on('click', function(e) {
			e.preventDefault();
			var input = $('input').val();	

			//grab inputted city and convert to 
			//latittude and longitude values
            geocoder =  new google.maps.Geocoder();
   			geocoder.geocode( { 'address': input}, function(results) {
   				newLat = results[0].geometry.location.lat();	
   				newLong = results[0].geometry.location.lng();
   				placeMarker(newLat, newLong);
   				panToHere(newLat, newLong);
   				getBandsBasedOnLocation(newLat, newLong);
        	});

   			//place the marker on the map
        	function placeMarker(artistInfo) {
				marker = new google.maps.Marker({
		            position: new google.maps.LatLng(newLat, newLong),
		            map: map,
		            icon: 'media/img/pin.png',
		            info: '<h1>' + newContent + '</h1>' +
		            	  '<h2>Playing at:</h2>' +  
		            	  '<p>' + venueName + '</p>' +
		            	  '<h3>' + venueCity + ', ' + venueRegion + '</h3>' +
		            	  '<a href=' + buyTickets + '>' +'Buy Tickets</a>',
		            draggable: false,
		            animation: google.maps.Animation.DROP
		        });  
		        var content = '<div>'+marker.info+'</div>';
		        bindInfoWindow(marker, map, infowindow, content);
        	}

        	//bind infowindow to a certain set of coordinates
        	function bindInfoWindow(marker, map, infowindow, html) {
	        	google.maps.event.addListener(marker, 'click', function() {
	        		infowindow.setContent(html);
        			infowindow.open(map, this);
	        	})	        		
        	}

        	//make the location the center of the map
        	//pan in on this location
			function panToHere() {
			    var latLng = new google.maps.LatLng(newLat, newLong);
			    map.panTo(latLng); 
			    map.setZoom(12);
			}

			//JSON call to grab bands from that location
        	function getBandsBasedOnLocation() {
        		var bandsFromThisCity = 'http://api.bandsintown.com/events/search.json?api_version=2.0&location=' + newLat + ',' + newLong + '&page=1&app_id=PaigesApp&callback=?';
 				$.getJSON(bandsFromThisCity,  function(data) {
 					for(i=0; i < 20; i++) {
 						var artistInfo = [ 
 							data[i].venue.latitude,
 							data[i].venue.longitude,
 							data[i].artists[0].name,
 							data[i].venue.name,
 							data[i].venue.city,
 							data[i].venue.region, 							
 							data[i].venue.url
 						];

 						newLat = artistInfo[0];
 						newLong = artistInfo[1];
 						newContent = artistInfo[2];
 						venueName = artistInfo[3];
 						venueCity = artistInfo[4];
 						venueRegion = artistInfo[5];
 						buyTickets = artistInfo[6];

						if(artistInfo[i] !== 'undefined'){
							placeMarker(artistInfo);	
						}	
 					}
 					
 				});        		
        	}

		});
	}	


							
	var init = function() {
		setupListeners();
	};

	shared.init = init;

	return shared;
}());

myApi.init();



				
			
				

