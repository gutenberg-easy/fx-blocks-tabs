<?php
/**
 * Plugin Name: f(x) Blocks - Tabs
 * Plugin URI:
 * Description:
 * Version:     0.1.0
 * Author:      turtlepod
 * Author URI:  https://shellcreeper.com
 * Text Domain: fx-blocks-tabs
 * Domain Path: /languages
 *
 * @package PluginScaffold
 */

// Useful global constants.
define( 'FX_BLOCKS_TABS_VERSION', '0.1.0' );
define( 'FX_BLOCKS_TABS_PLUGIN', plugin_basename( __FILE__ ) );
define( 'FX_BLOCKS_TABS_URL', plugin_dir_url( __FILE__ ) );
define( 'FX_BLOCKS_TABS_PATH', plugin_dir_path( __FILE__ ) );
define( 'FX_BLOCKS_TABS_INC', FX_BLOCKS_TABS_PATH . 'includes/' );

// Include files.
require_once FX_BLOCKS_TABS_INC . 'core.php';

// Bootstrap.
add_action( 'plugins_loaded', '\FxBlocksTabs\Core\setup' );
