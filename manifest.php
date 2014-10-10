<?php
define('GTFSYAW', 2);
header('Content-type: text/cache-manifest');
header('Content-Disposition: attachment; filename="riu.mf"');
header('Cache-Control: no-cache, must-revalidate');

// Definitions
require 'definitions.php';

// Version
$v	= Ver ."\n";

// See http://www.html5rocks.com/en/tutorials/appcache/beginner/
?>
CACHE MANIFEST
# 2013-11-16

# Explicitly cached 'master entries'
CACHE:
a.css?<?php echo $v; ?>
d.php
index.php
s/a.js?<?php echo $v; ?>
s/x.js?<?php echo $v; ?>
http://themes.googleusercontent.com/static/fonts/lato/v6/KT3KS9Aol4WfR6Vas8kNcg.woff
http://fonts.googleapis.com/css?family=Lato:300
http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js

