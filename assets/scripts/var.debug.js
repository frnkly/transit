/**
 * Debugging functions
 * 
 * @author Francis Amankrah <frank@frnk.ca>
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License
 */

var Debug =
{
	log : function(msg)
	{
		// Add message to debug stack
		$('#debug-stack').append('<li>'+ msg +'</li>');
		
		// Write message to console
		if (console) console.log('OT App: '+ msg);
		
		return false;
	},
	
	// http://binnyva.blogspot.com/2005/10/dump-function-javascript-equivalent-of.html
	dump : function(obj, deep, inArray, level)
	{
		var dump	= '';
		var pad		= '';
		if (!level) level	= 0;
		for (var j = 0; j < level + 1; j++) {
			pad	+= '   ';
		}
		
		// Array
		// obj.constructor
		var type	= typeof obj;
		pad		+= '['+ type +'] ';
		if (type == 'object' || type == 'array' || type == 'class' || type == 'regexp')
		{
			for(var i in obj)
			{
				var v	= obj[i];
				if (typeof v != 'function' || deep) {
					var t	= typeof v;
					if (t == 'object' || t == 'array' || t == 'class' || t == 'regexp') {
						dump	+= pad + i + ':\n';
						dump	+= this.dump(v, deep, true, level + 1);
					} else {
						dump	+= pad + i +': "'+ v +'"\n';
					}
				}
			}
		}
		
		// Element
		else if (type == 'element' || type == 'textnode' || type == 'whitespace') {
			dump	= '['+ obj.nodeName +']';
		}
		
		// Strings
		else {
			dump	= '['+ type +'] '+ obj;
		}
		
		// Dump
		if (!inArray) alert(dump);
		else return dump;
	}
};
