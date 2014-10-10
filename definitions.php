<?php
defined('GTFSYAW') or die;

// App details
define('VER', 0.3);
define('IS_LOCAL', (($_SERVER['HTTP_HOST'] == 'localhost' || $_SERVER['HTTP_HOST'] == '127.0.0.1') ? 1 : 0));
define('INC', (IS_LOCAL ? time() : VER));

// AJAX URLs
define('AGENCIES_URI',	'http://www.gtfs-data-exchange.com/api/agencies');
define('AGENCY_URI',	'http://www.gtfs-data-exchange.com/api/agency?agency=%s');

// Local paths
define('DS', DIRECTORY_SEPARATOR);
define('GTFS_PATH', dirname(__FILE__).DS.'data.gtfs');

