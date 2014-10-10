<?php

// Includes
require '../compressor.php';

// Compress scripts
$c	= new Compressor('javascript', false, false);
$c->load('transit/assets/scripts/app.js');
$c->load('transit/assets/scripts/data.js');
$c->load('transit/assets/scripts/geo.js');
$c->load('transit/assets/scripts/xhr.js');

// Output
echo $c->getOutput();
exit;
