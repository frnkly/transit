<?php
/**
 * 
 *
 * @author Francis Amankrah <frank@frnk.ca>
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License
 */
defined('GTFSYAW') or die;


class x
{
	public static function spit()
	{
		// No AJAX requested
		if (!isset($_GET['r'])) {
			return false;
		}
		
		// Check token
		if (!self::checkToken()) {
			self::fail();
			die();
		}
		
		$a	= (string) $_GET['r'];
		switch($a)
		{
			case 'a':
				self::get(AGENCIES_URI);
				break;
			
			case 'b':
				$id	= preg_replace('/[^a-z0-9-]/', '', $_GET['a']);
				self::get(sprintf(AGENCY_URI, $id));
				break;
			
			case 'c':
				self::getAgencyData();
				break;
			
			default:
				self::fail();
		}
		
		exit;
	}
	
	public static function get($u)
	{
		// Retrieve JSON code
		$j	= (string) @file_get_contents( $u );
		if (!$j || !strlen($j)) {
			return self::fail('Not found (fgc)');
		}
		
		// Test JSON code
		if (!$test = json_decode($j)) {
			return self::fail('Invalid JSON');
		}
		
		// Spit back JSON
		return self::send($j);
	}
	
	public static function getAgencyData()
	{
		// Performance check
		$id	= preg_replace('/[^a-z0-9-]/', '', $_GET['i']);
		if (empty($id)) {
			return self::fail('Invalid ID');
		}
		
		// Check that data is not already uploaded
		// ...
		
		// Check URI
		$u		= urldecode($_GET['a']);
		$uri	= self::validateURI($u);
		if ($uri !== true) {
			return self::fail($uri);
		}
		
		// Download ZIP file
		$name	= $id .'.zip';
		$path	= GTFS_PATH.DS.$name;
		$copy	= self::copyRemoteFile($u, $path);
		if ($copy !== true) {
			return self::fail($copy);
		}
		
		// Open ZIP file
		$dir	= GTFS_PATH.DS.$id;
		$unzip	= self::extractArchive($path, $dir);
		if ($unzip !== true) {
			return self::fail($unzip);
		}
		
		// Delete ZIP file
		unlink($path);
		
		self::send('{"status_code":200,"status_txt":"ok"}');
	}
	
	private static function validateURI($uri)
	{
		// Check protocol
		if (stripos($uri, 'http://') !== 0 && stripos($uri, 'https://') !== 0) {
			return 'Invalid URL (h): '. $uri;
		}
		
		// Validate URL
		if (!$uri = filter_var($uri, FILTER_VALIDATE_URL)) {
			return 'Invalid URL (v): '. $uri;
		}
		
		return true;
	}
	
	private static function copyRemoteFile($url, $path)
	{
		// Open remote file
		$file = fopen($url, "rb");
		if (!$file) {
			return 'Couldn\'t retrieve file: '. $url;
		}
		
		// Prepare local copy
		$local	= fopen($path, "wb");
		if (!$local) {
			return 'Couldn\'t open file: '. $url;
		}
		
		// Make local copy
		while(!feof($file)) {
			fwrite($local, fread($file, 1024 * 8), 1024 * 8);
		}
		
		// Close file handles
		fclose($file);
		fclose($local);
		
		return true;
	}
	
	private static function extractArchive($file, $to)
	{
		// Open archive
		$zip	= new ZipArchive;
		$res	= $zip->open($file);
		if ($res !== true) {
			return 'Couldn\'t open archive: '. $res;
		}
		
		// Extract archive
		$zip->extractTo($to);
		
		// Close handles
		$zip->close();
		return true;
	}
	
	public static function checkToken()
	{
		
		
		// To do: check token before executing request
		return true;
	}
	
	public static function fail($msg = 'Not found') {
		header("HTTP/1.0 404 Not Found");
		return self::send('{"status_code":404,"status_txt":"'. $msg .'"}');
	}
	
	public static function send($json)
	{
		header('Content-type: application/json; charset=UTF-8');
		
		echo $json;
	}
}

