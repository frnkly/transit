<?php
/**
 * @author Francis Amankrah <frank@frnk.ca>
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License
 */
define('GTFSYAW', 1);

// Some definitions
require 'definitions.php';

// Handle XHR requests
require 'xhr.php';
x::spit();

// Headers
header('Link: <http://frnk.ca/app/transit>; rel="shortlink"');

?>
<!DOCTYPE html>
<?php //<html lang="en" manifest="manifest.php"> ?>
<html lang="en">
<head>
	<title>Open Transit</title>
	<meta charset="utf-8">
	<meta name="author" content="Frank" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta name="description" content="Open Transit" />
	<meta name="keywords" content="" />
	<meta name="robots" content="index, follow" />
	<meta property="og:title" content="Open Transit" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://frnk.ca/app/transit" />
	<meta property="og:desc" content="Open Transit" />
	<?php //<meta property="og:image" content="i/riu.144x144.png" />  ?>
	<link rel="canonical" href="http://frnk.ca/app/transit" />
	<link rel="shortlink" type="text/html" href="http://frnk.ca/app/transit" />
	<?php //<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" /> ?>
	<?php //<link rel="apple-touch-icon" href="riu.144x144.png" /> ?>
	<?php //<link rel="apple-touch-icon" sizes="72x72" href="riu.72x72.png" /> ?>
	<?php //<link rel="apple-touch-icon" sizes="112x112" href="riu.112x112.png" /> ?>
	<?php //<link rel="apple-touch-icon" sizes="144x144" href="riu.144x144.png" /> ?>
	<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Lato:300" />
	<link rel="stylesheet" type="text/css" href="assets/scripts/style.css?<?php echo INC; ?>" />
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<script src="assets/scripts/class.agency.js?<?php echo INC; ?>"></script>
	<script src="assets/scripts/var.data.js?<?php echo INC; ?>"></script>
	<script src="assets/scripts/geo.js?<?php echo INC; ?>"></script>
	<script src="assets/scripts/var.remote.js?<?php echo INC; ?>"></script>
	<script src="assets/scripts/var.debug.js?<?php echo INC; ?>"></script>
	<script src="assets/scripts/app.js?<?php echo INC; ?>"></script>
	<script src="assets/scripts/var.l10n.js?<?php echo INC; ?>"></script>
</head>
<body>
	<section id="main">
		<form onsubmit="App.go(); return false;">
			<div id="status">Welcome.</div>
			<input name="q" type="text" value="<?php echo @$_GET['q']; ?>" autocomplete="off" />
			<a href="#" class="find" onclick="App.go()"></a>
			<div class="clr"></div>
		</form>
		<div><ul id="results" class="center"></ul></div>
	</section>
	
	<nav>
		<a href="#" class="jump icon-agency" onclick=""><span class="h"></span></a>
		<a href="#" class="jump icon-bookmarks" onclick=""><span class="h"></span></a>
		<a href="#" class="jump icon-locate" onclick=""><span class="h"></span></a>
		<a href="#" class="jump icon-share" onclick=""><span class="h"></span></a>
		<a href="#" class="jump icon-settings" onclick=""><span class="h"></span></a>
		<a href="#" class="jump icon-info" onclick=""><span class="h"></span></a>
		<a href="#" class="jump icon-debug" onclick=""><span class="h"></span></a>
	</nav>
	<section style="text-align: center;width:100%;font-weight: bold;">
		Testing:
		<a href="#" onclick="App.setMode(2)">"Agency" mode</a> | 
		<a href="#" onclick="App.openDialog('bookmarks')">Bookmarks</a> | 
		<a href="#" onclick="Geo.openDialog()">Geo-location</a> | 
		<a href="#" onclick="App.openDialog('share')">Sharing</a> | 
		<a href="#" onclick="App.openDialog('settings')">Settings</a> | 
		<a href="#" onclick="App.openDialog('info')">Info</a> | 
		<a href="#" onclick="App.openDialog('debug')">Debug</a>
	</section>
	
	<section id="landing-dialog" class="dialog">
		<div>
			<h1 class="center">Hello :)</h1>
			<div class="center">Welcome to the <em>Open Transit</em> app.</div>
			<div>Make sure you're connected to a Wifi network before continuing. We'll be downloading some transit data to get you started.</div>
			<div class="center"><a href="#" onclick="App.getAgenciesList();">ok</a></div>
		</div>
	</section>
	
	<section id="notice-dialog" class="dialog">
		<div>
			<div id="notice-msg"></div><br />
			<div class="center"><a href="#" onclick="App.close();">ok</a></div>
		</div>
	</section>
	
	<section id="confirm-dialog" class="dialog">
		<div>
			<br />
			<div id="confirm-msg"></div>
			<div class="center">
				<a href="#" id="confirm-ok">ok</a>&nbsp;&nbsp;&nbsp;
				<a href="#" id="confirm-cancel">cancel</a></a>
			</div>
		</div>
	</section>
	
	<section id="loading-dialog" class="dialog">
		<div>
			<br />
			<div id="loading-msg" class="center">Working...</div><br />
			<div class="loading center"></div><br />
			<div class="center"><a href="#" onclick="Ajax.xhr.abort();App.close()">Cancel</a></div>
		</div>
	</section>
	
	<section id="bookmarks-dialog" class="dialog">
		<div>
			<span class="close"></span>
			<h1>Your bookmarks</h1>
			<div>You don't have any bookmarks yet.</div>
		</div>
	</section>
	
	<section id="info-dialog" class="dialog">
		<div>
			<span class="close"></span>
			<h1>Open Transit <span>(v. <?php echo VER; ?>)</span></h1>
			<div>Short description Aenean rhoncus bibendum nisl, in convallis nulla dictum in. Morbi vel orci id metus ultrices consectetur vitae eget dui. Sed sodales augue enim, non sodales augue porta nec. Fusce cursus, massa in ultrices convallis, enim.</div>
			<div class="center">Francis Amankrah &copy; <?php echo date('Y'); ?></div>
			<div class="center">
				<a href="mailto:&#102;&#114;&#97;&#110;&#107;&#64;&#102;&#114;&#110;&#107;&#46;&#99;&#97;">&#102;&#114;&#97;&#110;&#107;&#64;&#102;&#114;&#110;&#107;&#46;&#99;&#97;</a>
			</div>
			<div class="center">
				<a href="http://www.gnu.org/licenses/gpl.html" target="_blank">GNU General Public License</a>
			</div>
		</div>
	</section>
	
	<section id="locate-dialog" class="dialog">
		<div>
			<span class="close"></span>
			<h1>Your location</h1>
			<div id="loc-name">Loading...</div>
		</div>
	</section>
	
	<section id="settings-dialog" class="dialog">
		<div>
			<span class="close"></span>
			<h1>Settings</h1>
			<div>Set your language:</div>
			<select id="param-lang">
				<option value="en">English</option>
				<option value="fr">Français (bientôt)</option>
			</select>
			<div>Select your current transit agency:</div>
			<select id="param-agency" onchange="App.setActiveAgency()"></select>
			<div>Erase all offline data:</div>
			<div class="center"><a href="#" onclick="App.clearData();">Clear everything</a></div>
			<div>Various parameters:</div>
			<div class="row">
				<div class="col2 right">Parameter 1:</div>
				<div class="col2">...</div>
			</div>
			<div class="row">
				<div class="col2 right">Parameter 2:</div>
				<div class="col2">...</div>
			</div>
		</div>
	</section>
	
	<section id="share-dialog" class="dialog">
		<div>
			<span class="close"></span>
			<h1>Share this app</h1>
			<div>Link: ...</div>
			<div>...</div>
		</div>
	</section>
	
	<section id="debug-dialog" class="dialog">
		<div>
			<span class="close"></span>
			<h1>Debug</h1>
			<div>
				Offline storage: <span id="debug-storage"></span><br />
				Internet connection: <span id="debug-online"></span><br />
				Error messages: <ol id="debug-stack"></ol>
			</div>
		</div>
	</section>
	<script type="text/javascript">
		
		// Check offline storage
		App.debug('#debug-storage', Data.isStorageEnabled());
		
		// Check internet connection
		App.debug('#debug-online', navigator.onLine);
		
	</script>

<?php if (!IS_LOCAL): ?>
<script>
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-44084003-2', 'auto');
	ga('send', 'pageview');
</script>
<?php endif; ?>
</body>
</html>
