<?php
/**
 * Core plugin functionality.
 *
 * @package PluginScaffold
 */

namespace FxBlocksTabs\Core;

use \WP_Error as WP_Error;

/**
 * Default setup routine
 *
 * @return void
 */
function setup() {
	$n = function( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	load_plugin_textdomain( dirname( $plugin ), false, dirname( $plugin ) . '/languages/' );

}
