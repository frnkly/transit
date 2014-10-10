/**
 * 
 * 
 * @author Francis Amankrah <frank@frnk.ca>
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License
 * 
 */

function Agency(_id)
{
	// Load from object
	var props	= false;
	if (typeof _id == 'object') {
		props	= _id;
		_id		= props.id;
	}
	
	// Check ID
	this.id	= _id.toString().replace(/[^a-z0-9\-]/gi, '');
	if (this.id.length < 2 || this.id != _id) {
		this.id	= null;
		return Debug.log('Invalid Agency ID');
	}
	
	// Load properties
	if (props) this.loadDetails(props);
	
	return this;
};

Agency.prototype.loadDetails	= function(details)
{
	this.name		= details.name || 'Transit agency';
	this.url		= details.url;
	this.area		= details.area;
	this.state		= details.state;
	this.country	= details.country;
	this.official	= (details.is_official);
	this.dataURI	= details.dataURI || null;
};

Agency.prototype.setDataURI	= function(files)
{
	// Known data file
	if (typeof files == 'string') {
		this.dataURI	= files;
		return;
	}
	
	// List of data files
	var uri		= files[0].file_url;
	var latest	= files[0].date_added;
	files.forEach(function(df, index)
	{
		if (df.date_added > latest) {
			uri		= df.file_url;
			latest	= df.date_added;
		}
	});
	
	// Save data file URL
	this.dataURI	= uri;
	Debug.log('Found '+ files.length +' data files for '+ this.id);
	Debug.log('Latest ZIP file: '+ uri);
};
