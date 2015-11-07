if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};

var myApi = (function(options) {
	var shared = {},
		options = options || {}

	var myLatlng = new google.maps.LatLng(32.7574, -97.3332);
	var styles = 
		[{"featureType": "landscape", "elementType": "all", "stylers": [{"hue": "#F1FF00"}, {"saturation": -27.4 }, {"lightness": 9.4 }, {"gamma": 1 } ] }, {"featureType": "poi", "elementType": "all", "stylers": [{"hue": "#9FFF00"}, {"gamma": 1 } ] }, {"featureType": "road.highway", "elementType": "all", "stylers": [{"hue": "#0099FF"}, {"saturation": -20 }, {"lightness": 36.4 }, {"gamma": 1 } ] }, {"featureType": "road.arterial", "elementType": "all", "stylers": [{"hue": "#00FF4F"}, {"gamma": 1 } ] }, {"featureType": "road.local", "elementType": "all", "stylers": [{"hue": "#FFB300"}, {"saturation": -38 }, {"lightness": 11.2 }, {"gamma": 1 } ] }, {"featureType": "water", "elementType": "all", "stylers": [{"hue": "#00B6FF"}, {"saturation": 4.2 }, {"lightness": -63.4 }, {"gamma": 1 } ] } ];
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
			$('.band-info ul').empty();
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
		            info: newContent,
		            draggable: false,
		            animation: google.maps.Animation.DROP
		        });  
		        
				//bind pin and list
		        bindInfoWindow(marker, map);
		        map.setCenter(marker.getPosition());

				marker.addListener('click', function() {
					var currentPin = $(this)[0].info;
					

					$('.band-info ul li h3').each(function() {
						var parent    = $(this).parent('.band-info li');
						var listItems = parent.index();
						var that      = $(this).text();

						if (that == currentPin) {
							$('.highlighted').removeClass('highlighted');
							var listItemHeight = $('.band-info ul li').height();
							var scrollToHere   = listItemHeight * listItems;

							$('.band-info ul').scrollTop(scrollToHere);
							$(this).parent('.band-info li').addClass('highlighted');
						}
					});
				});
        	}



        	function setList(artistInfo) {
        		$('.band-info ul').append('<li><h3>'  +
        								  newContent  +
        								  '</h3><p>'  +
        								  venueName   +
        								  '</p><p>'   +
        								  venueCity   +
        								  ', ' 		  +
        								  venueRegion +
        								  '<a href='  +
        								  buyTickets  +
        								  ' target=\'blank\'>Tickets</a></li>'
        		);
        	}

        	//bind infowindow to a certain set of coordinates
        	function bindInfoWindow(marker, map, infowindow, html) {
	        	google.maps.event.addListener(marker, 'click', function() {
        			$('.band-info').html(html, this);
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
							setList(artistInfo)	
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



				
			
				

