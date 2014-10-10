/**
 * Data storage and handling
 * 
 * @author Francis Amankrah <frank@frnk.ca>
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License
 */
var Data	=
{
	_isStorageEnabled : null,
	
	// Data storage
	store :
	{
		// Full list of agencies
		aList : null,
		
		// List of selected agencies
		sList : null
	},
	
	init : function()
	{
		// Retrieve agencies list
		if (!this.store.aList)
			this.store.aList	= this.getItem('aList', null);
		
		// Retrieve selected agencies list
		if (!this.store.sList)
			this.store.sList	= this.getItem('sList', null);
	},
	
	storeAgenciesList : function(data)
	{
		// Performance check
		if (!data) return Debug.log('Data.storeAgenciesList: invalid data');
		
		// Create list
		var list	= [];
		for (var i = 0; i < data.length; i++)
		{
			list.push({
				id : data[i].dataexchange_id,
				name : data[i].name,
				area : data[i].area,
				state : data[i].state,
				country : data[i].country,
				url : data[i].url
			});
		}
		
		// Store
		this.setItem('list.agencies', list);
		
		return true;
	},
	
	storeAgencyDetails : function(raw)
	{
		// Performance check
		if (!raw || !raw.agency || !raw.agency.dataexchange_id)
			return Debug.log('Data.storeAgencyDetails: invalid data');
		var agency	= new Agency(raw.agency.dataexchange_id);
		if (!agency.id)
			return Debug.log('Data.storeAgencyDetails: could not load agency');
		
		// Update agencies list
		var list	= Data.getItem('list.selectedAgencies', {});
		if (!list[agency.id])
			list[agency.id]	= raw.agency.name;
		
		// Save agency data
		agency.loadDetails(raw.agency);
		agency.setDataURI(raw.datafiles);
		
		// Store everything and set current agency
		this.setItem('list.selectedAgencies', list);
		this.setItem('agencyDetails.'+ agency.id, agency);
		App.setActiveAgency(agency.id, agency.name);
		
		return true;
	},
	
	setItem : function(key, val)
	{
		switch (key)
		{
			case 'list.agencies':
			case 'list.selectedAgencies':
				// ...
				break;
				
			default:
				this.store[key]	= val;
				break;
		}
		
		// Offline storage
		if (this.isStorageEnabled())
			window.localStorage.setItem(key, JSON.stringify(val));
	},
	
	getItem : function(key, def)
	{
		// Check live storage
		if (this.check(key)) return this.store[key];
		
		// Check local storage
		if (this.isStorageEnabled())
		{
			var data	= window.localStorage.getItem(key);
			
			// Save in live storage
			if (data !== null)
			{
				data	= JSON.parse(data);
				if (data) {
					this.store[key]	= data;
					return this.store[key];
				}
			}
		}
		
		// Value not found
		return def;
	},
	
	check : function(key, context)
	{
		// Check given context, or live storage if there's no local storage
		if (context) return (key in context && context[key] !== null);
		
		// Check live storage
		if (key in this.store && this.store[key] !== null) return true;
		
		// Try local storage
		if (!this.isStorageEnabled()) return false;
		var data	= window.localStorage.getItem(key);
		
		// Save in live storage
		if (data !== null)
		{
			data	= JSON.parse(data);
			if (data) {
				this.store[key]	= data;
				return true;
			}
		}
		
		return false;
	},
	
	// Clear all data
	clear : function()
	{
		$.each(this.store, function(key, value) {
			delete Data.store[key];
		});
		
		// Clear local storage
		if (this.isStorageEnabled()) {
			window.localStorage.clear();
		}
	},
	
	// Cleans a string
	// Accents: http://www.tuxlanding.net/how-to-display-the-accented-characters-in-javascript/
	clean : function(str)
	{
		if (!str || typeof str != 'string' || str.length < 1) return '';
		
		return str.trim();
		return str.trim().replace(/[^\w\d\s]+/ig, '');
	},
	
	isStorageEnabled : function()
	{
		if (this._isStorageEnabled === null)
			this._isStorageEnabled	= (this.check('localStorage', window) && (window.JSON && window.JSON.parse));
		
		return this._isStorageEnabled;
	}
};
