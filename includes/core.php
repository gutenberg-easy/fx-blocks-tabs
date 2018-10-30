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

	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Register Blocks.
	add_action( 'wp_loaded', $n( 'register_blocks' ) );

	// Editor Assets.
	add_action( 'enqueue_block_editor_assets', $n( 'editor_assets' ) );

	// Block Assets.
	add_action( 'enqueue_block_assets', $n( 'block_assets' ) );
}

/**
 * Register Blocks
 *
 * @return void
 */
function register_blocks() {
	register_block_type(
		'fx-blocks/tabs',
		array(
			'render_callback' => function( $attributes = [], $content = '' ) {
				ob_start();
				include( FX_BLOCKS_TABS_PATH . 'blocks/tabs/template.php' );
				return ob_get_clean();
			},
			'attributes' => [
				'preview'   => [
					'type'    => 'bool',
					'default' => false,
				],
				'display'   => [
					'type'    => 'string',
					'default' => 'tabs',
				],
				'items'     => [
					'type'    => 'string', // Use JSON string.
					'default' => null,
				],
			],
		)
	);
}

/**
 * Editor Assets
 *
 * @return @void
 */
function editor_assets() {
	// JS.
	wp_enqueue_script(
		'fx-blocks-tabs-editor',
		FX_BLOCKS_TABS_URL . 'assets/js/editor.blocks.js',
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'jquery' ],
		// FX_BLOCKS_TABS_VERSION
		time()
	);

	// CSS.
	wp_enqueue_style(
		'fx-blocks-tabs-editor',
		FX_BLOCKS_TABS_URL . 'assets/css/blocks.editor.css',
		[ 'wp-components' ],
		// FX_BLOCKS_TABS_VERSION
		time()
	);
}

/**
 * Block Assets
 *
 * @return void
 */
function block_assets() {
	wp_enqueue_script(
		'fx-blocks-tabs',
		FX_BLOCKS_TABS_URL . 'assets/js/frontend.blocks.js',
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'jquery' ],
		// FX_BLOCKS_TABS_VERSION
		time()
	);

	wp_enqueue_style(
		'fx-blocks-tabs',
		FX_BLOCKS_TABS_URL . 'assets/css/blocks.style.css',
		[ 'wp-blocks' ],
		// FX_BLOCKS_TABS_VERSION
		time()
	);
}
