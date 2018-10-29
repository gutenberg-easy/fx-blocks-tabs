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
				?>
				<div>
					<h3>Tabs</h3>
					<p>Attr: <?php echo json_encode( array_map( 'esc_attr', $attributes ) ); ?></p>
					<p>Content: <?php echo json_encode( $content ); ?></p>
				</div>
				<?php
				return ob_get_clean();
			},
			'attributes' => [
				'preview'   => [
					'type'    => 'bool',
					'default' => false,
				],
				'items' => [
					'type'    => 'string',
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
		'my-blocks-editor',
		FX_BLOCKS_TABS_URL . 'assets/js/editor.blocks.js',
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'jquery' ],
		FX_BLOCKS_TABS_VERSION
	);

	// CSS.
	wp_enqueue_style(
		'my-blocks-editor',
		FX_BLOCKS_TABS_URL . 'assets/css/blocks.editor.css',
		[ 'wp-components' ],
		FX_BLOCKS_TABS_VERSION
	);
}
