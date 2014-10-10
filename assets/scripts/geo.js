/*
 * Geolocation class
 */
var Geo	=
{
	// Geolocation data
	time : null,
	latitude : null,
	longitude : null,
	altitude : null,
	accuracy : null,
	heading : null,
	speed : null,
	
	// User denied geolocation request?
	stop : false,
	
	init : function() {},
	
	locate : function(user)
	{
		// Performance check
		if (!('geolocation' in navigator) || this.stop)
		{
			// If user asked, explain
			if (user && !this.stop)
				App.write('Geolocation is not available on your device...');
			
			return false;
		}
		
		// Ask for location
		navigator.geolocation.getCurrentPosition(GeoLocateSuccess, GeoLocateError);
	},
	
	setLocation : function(pos)
	{
		// Performance check
		if (!pos || !pos.coords) return;
		
		// Save location data
		this.time		= pos.timestamp;
		this.latitude	= pos.coords.latitude;
		this.longitude	= pos.coords.longitude;
		this.altitude	= pos.coords.altitude;
		this.accuracy	= pos.coords.accuracy;
		this.heading	= pos.coords.heading;
		this.speed		= pos.coords.speed;
		
		$('#loc-name').text('Lat: '+ this.latitude +' / Long: '+ this.longitude);
	},
	
	// Shortcut to display "Geolocation" popup and locate user
	openDialog : function()
	{
		// Display alert box
		App.openDialog('locate');
		
		// Test
		$('#loc-name').text('Finding your location...');
		
		// Locate user
		this.locate(true);
	}
};

/*
 * Locate functions
 */
var GeoLocateSuccess	= function(pos) {
	Geo.setLocation(pos);
};

var GeoLocateError		= function(err)
{
	var msg	= 'Could not find your location';
	
	switch (err.code)
	{
		case err.PERMISSION_DENIED:
			msg	= msg +' (permission denied, make sure GPS is enabled on your device)';
			break;
		
		case err.POSITION_UNAVAILABLE:
			msg	= msg +' (information unavailable)';
			break;
		
		case err.TIMEOUT:
			msg	= msg +' (request timeout, try again)';
			break;
		
		case err.UNKNOWN_ERROR:
		default:
			break;
	}
	
	$('#loc-name').text(msg);
};



