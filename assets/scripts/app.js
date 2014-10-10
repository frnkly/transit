/**
 * 
 * 
 * @author Francis Amankrah <frank@frnk.ca>
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License
 *
 * http://www.gtfs-data-exchange.com/api
 * https://developers.google.com/transit/gtfs/reference
 * http://thetransitapp.com/developers
 * http://www.whatwg.org/specs/web-apps/current-work/
 * http://api.availabs.org/gtfs/
 */
var App =
{
	// Search mode
	// 	1	Normal search
	//	2	Agency search
	mode : 1,
	
	init : function()
	{
		// Step 1: Welcome message
		if (!Data.check('landed')) {
			this.openDialog('landing');
			Data.setItem('landed', 1);
		}
		
		// Step 2: Initialize variables
		Data.init();
		Remote.init();
		
		// Step 3: Check that we have a list of transit agencies
		if (!Data.check('list.selectedAgencies')) return this.setMode(this.MODE_SEARCH_AGENCIES);
		
		// Step 4: Load active agency from last visit
		if (Data.check('activeAgencyID'))
		{
			// Set active agency
			var aa		= Data.getItem('activeAgencyID');
			this.setActiveAgency(aa, Data.getItem('activeAgencyName'));
			
			// Retrieve other saved agencies
			var list	= Data.getItem('sList', {});
			$.each(list, function(id, name) {
				if (id != aa) $('#param-agency').append('<option value="'+ id +'">'+ name +'</option>');
			});
		}
		
		// Todo: no active agencies... probably due to an error
		else {
		
		}
	},
	
	// ...
	go : function()
	{
		// Check that we have a list of all agencies
		if (!Data.check('list.agencies')) return this.getAgenciesList();
		
		switch (this.mode)
		{
			case 1:
				alert('ToDo: search for "'+ $('input[name="q"]').val() +'"');
				break;
			
			case 2:
				this.lookupAgency();
				
				break;
			
			default:
				Debug.log('App.go: invalid search mode');
				this.reset('Internal error :/');
		}
		
	},
	
	lookupAgency : function()
	{
		// Performance check
		$('#results').text('');
		var qi	= $('input[name="q"]');
		var q	= Data.clean(qi.val());
		if (q.length < 2) return qi.val('').focus();
		
		// Start search
		this.lookupAgencyOnKeyUp();
	},
	lookupAgencyOnKeyUp : function()
	{
		// Performance check
		var qi	= $('input[name="q"]');
		var q	= Data.clean(qi.val());
		if (q.length < 2) return;
		
		// Retrieve agencies list
		var aL	= Data.getItem('list.agencies');
		if (!aL) return this.getAgenciesList();
		
		// Loop through all agencies
		var qa		= q.toLowerCase().split(' ');
		var list	= $.grep(aL, function(a, index)
		{
			for (var i = 0; i < qa.length; i++)
			{
				// Performance check
				if (qa[i].length < 2) continue;
				
				// Check data fields
				if (a.id.toLowerCase().indexOf(qa[i]) > -1) return true;
				if (a.name.toLowerCase().indexOf(qa[i]) > -1) return true;
				if (a.area.toLowerCase().indexOf(qa[i]) > -1) return true;
				if (a.state.toLowerCase().indexOf(qa[i]) > -1) return true;
				if (a.country.toLowerCase().indexOf(qa[i]) > -1) return true;
				if (a.url.replace('http://', '').indexOf(qa[i]) > -1) return true;
			}
			
			return false;
		});
		
		// Display results
		$('#results').text('');
		this.write('Found '+ list.length +' results');
		if (list.length)
			$.grep(list, function(r, i) {
				$('#results').append('<li><a href="#" onclick="App.addAgencyToList(\''+ r.id +'\', \''+ r.name +'\')">'+ r.name +'</a></li>');
			});
	},
	
	setActiveAgency : function(id, name)
	{
		// Set from select option
		if (!id && !name) {
			id	= $('#param-agency').val();
			if (id) name = $('#param-agency > option[value="'+ id +'"]').text();
		}
		
		// Performance check
		if (!id || id.length < 1 || !name || name.length < 1)
			return Debug.log('App.setActiveAgency: invalid data');
		
		// Save in storage
		Data.setItem('activeAgencyID', id);
		Data.setItem('activeAgencyName', name);
		
		// Check if agency is already in settings list
		var included	= false;
		$('#param-agency > option').each(function() {
			if (this.value == id) included = true;
		});
		if (!included)
			$('#param-agency').append('<option value="'+ id +'">'+ name +'</option>');
		$('#param-agency').val(id);
		
		// Clear the way to start searching for bus stop times
		this.close();
		this.setMode(1);
		this.write(name);
		$('input[name="q"]').val('');
		$('#results').html('');
	},
	
	getAgenciesList : function()
	{
		// Close popups
		this.close();
		
		// Performance check
		if (Data.check('list.agencies')) return;
		
		// Alert user
		this.openLoading('Loading transit agencies');
		
		// Load data
		Remote.loadAgencies();
	},
	
	saveAgenciesList : function(data)
	{
		// Performance check
		if (!Data.storeAgenciesList(data)) return;
		
		// Lookup an agency
		if ($('input[name="q"]').val().length > 0) this.lookupAgency();
	},
	
	addAgencyToList : function(id, name)
	{
		// Performance check
		if (!id || id.length < 1)
			return Debug.log('App.addAgencyToList: invalid data');
		
		// Display loading message
		this.close();
		if (!name || name.length < 1) name = 'transit agency';
		this.openLoading('Loading '+ name);
		
		// Load data
		Remote.loadAgencyDetails(id);
	},
	
	saveAgencyDetails : function(raw)
	{
		if (!Data.storeAgencyDetails(raw))
			return;
		
		// Retrieve agency data
		this.getAgencyData();
	},
	
	getAgencyData : function()
	{
		// Agency id
		var id		= Data.getItem('activeAgencyID');
		if (!id || id.length < 1) return Debug.log('App.getAgencyData: id not found');
		
		// Agency details
		var details	= Data.getItem('agencyDetails.'+ id);
		if (!details || !details.id) return Debug.log('App.getAgencyData: details not found');
		if (details.id != id) return Debug.log('App.getAgencyData: id mismatch');
		
		// Alert user that we're doing stuff in the background
		this.openLoading('Crunching bus stop data for '+ details.name +', this could take a minute or two...');
		
		// Load data
		Remote.loadAgencyDataFiles(details.id, details.dataURI);
	},
	
	delay : function(func) {
		setTimeout(function() {
			func.apply(App);
		}, 200);
	},
	
	setMode : function(m)
	{
		switch (m)
		{
			case 2:
				this.mode	= 2;
				$('#results').text('');
				$('input[name="q"]').keyup(this.lookupAgencyOnKeyUp.bind(this));
				this.write('Step 1: find your transit agency');
				break;
			
			case 1:
			default:
				this.mode	= 1;
				$('input[name="q"]').keyup(null);
				break;
		}
	},
	
	// Write to status
	write : function(m) {
		if (typeof m == 'string')
			$('#status').text(m);
	},
	
	openDialog : function(id)
	{
		$('.dialog').hide();
		box	= '#'+ id +'-dialog';
		if ($(box).is(':hidden')) $(box).fadeIn(240);
		else $(box).fadeOut(240);
	},
	
	openNotice : function(msg)
	{
		this.close();
		$('#notice-msg').text(msg);
		this.openDialog('notice');
	},
	
	openLoading : function(msg)
	{
		// Loading message
		msg	= msg || '';
		
		// Loading popup
		$('#loading-msg').text(msg);
		this.openDialog('loading');
	},
	
	// Confirm an action
	confirm : function(notice, ok, cancel)
	{
		this.close();
		$('#confirm-msg').text(notice);
		this.openDialog('confirm');
		
		// Method to call when user clicks "ok"
		$('#confirm-ok').prop('onclick', null);
		$('#confirm-ok').click(function() {
			ok.apply(App);
		});
		
		// Method to call when user clicks "cancel"
		cancel	= cancel || App.close;
		$('#confirm-cancel').prop('onclick', null);
		$('#confirm-cancel').click(function() {
			cancel.apply(App);
		});
	},
	
	close : function() {
		$('.dialog').fadeOut(240);
	},
	
	/*
	 * Miscellaneous
	 */
	reset : function(m) {
		if (m) this.write(m);
		$('input[name="q"]').val('').focus();
		$('#results').html('');
	},
	
	clearData : function()
	{
		this.close();
		this.reset('');
		Data.clear();
		$('#param-agency').html('');
		this.delay(function() {
			this.openNotice('All your offline data is gone.');
			this.setMode(2);
		});
	},
	
	debug : function(id, r) {
		if (r) $(id).text('Yes');
		else $(id).text('No');
	},
	
	/*
	 * Constants
	 */
	
	MODE_SEARCH_AGENCIES : 2
};

// Initiate
$(document).ready(function()
{
	// Initialize app
	App.init();
	
	$('.close').click(function() {
		$('.dialog').fadeOut(240);
	});
});
