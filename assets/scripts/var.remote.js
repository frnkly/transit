/**
 * HTTP server communication variable
 * 
 * References:
 *		http://api.jquery.com/jQuery.ajax/
 *		http://api.jquery.com/jQuery.ajax/#jqXHR
 * 
 * @author Francis Amankrah <frank@frnk.ca>
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License
 */
var Remote	=
{
	xhr : null,
	
	init : function()
	{
		// Default AJAX settings
		$.ajaxSetup({
			dataType: 'json'
		});
	},
	
	// Finish an ajax request
	end : function(sys, msg) {
		Debug.log('XHR: '+ sys);
		App.close();
		if (msg && msg.length > 0) App.write(msg);
		this.xhr	= null;
	},
	
	// Retrieve list of agencies
	loadAgencies : function()
	{
		// Send request and log result
		this.xhr	= $.ajax({data:{r:'a'}}).always(function(a, status, b) {
			Remote.end('loadAgencies: '+ status);
		})
		
		// Parse data
		.done(function(r) {
			App.saveAgenciesList(r.data);
			Debug.log('There are '+ r.data.length +' agencies to choose from');
		})
		
		// Request failed
		.fail(function() {
			Remote.end('loadAgencies failed', 'Hmm... Seems we\'ve run into a wall :(');
		});
	},
	
	// Retrieve data for a single agency
	loadAgencyDetails : function(id)
	{
		// Send request and log result
		this.xhr	= $.ajax({data:{r:'b',a:id}}).always(function(a, status, b) {
			Remote.end('loadAgencyDetails: '+ status);
		})
		
		// Parse data
		.done(function(r) {
			App.saveAgencyDetails(r.data);
			Debug.log('Found information for agency "'+ r.data.agency.dataexchange_id +'"');
		})
		
		// Request failed
		.fail(function() {
			Remote.end('loadAgencyDetails failed', 'Hmm.. Seems we\'ve run into a wall...');
		});
	},
	
	loadAgencyDataFiles : function(id, url)
	{
		// Send request and log result
		this.xhr	= $.ajax({data:{r:'c',a:this.urlencode(url),i:id}}).always(function(a, status, b) {
			Remote.end('loadAgencyDataFiles: '+ status);
		})
		
		// Parse response
		.done(function(r) {
			App.setMode(1);
			Debug.log(r);
		})
		
		// Request failed
		.fail(function() {
			Remote.end('loadAgencyDataFiles failed', 'Hmm.. Seems we\'ve run into a wall...');
		});
	},
	
	urlencode : function(str)
	{
		return encodeURIComponent((str + '').toString())
		.replace(/!/g, '%21')
		.replace(/'/g, '%27')
		.replace(/\(/g, '%28')
		.replace(/\)/g, '%29')
		.replace(/\*/g, '%2A')
		.replace(/%20/g, '+');
	}
};


