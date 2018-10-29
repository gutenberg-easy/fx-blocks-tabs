<?php
/**
 * Template.
 *
 * @var $attributes array
 * @var $content    string
 */

// Check vars.
$attributes = isset( $attributes ) && is_array( $attributes ) ? $attributes : [];
$content    = isset( $content ) ? wp_kses_post( $content ) : false;

// Set defaults.
$attributes = wp_parse_args( $attributes, [
	'preview' => false,
	'items'   => [],
] );

$_items = is_array( $attributes['items'] ) ? $attributes['items'] : json_decode( $attributes['items'], true );

$items = [];
foreach ( $_items as $item ) {
	$items[] = wp_parse_args( $item, [
		'id'              => null,
		'titleText'       => null,
		'descriptionText' => null,
	] );
}
if ( ! $items ) {
	return false;
}

?>
<div class="fx-blocks-tabs">
	<ul class="fx-blocks-tabs-nav">
		<?php foreach ( $items as $i => $item ) : ?>
			<li class="fx-blocks-tabs-nav-item"><a href="#panel-<?php echo esc_attr( $item['id'] );?>" class="<?php echo esc_attr( 0 === $i ? 'selected' : 'not-selected' )?>"><?php echo esc_html( $item['titleText'] ); ?></a></li>
		<?php endforeach; ?>
	</ul>
	<div class="fx-blocks-tabs-panels">
		<?php foreach ( $items as $i => $item ) : ?>
			<div id="panel-<?php echo esc_attr( $item['id'] );?>" class="fx-blocks-tabs-panel" style="<?php echo esc_attr( 0 === $i ? 'display:block;' : 'display:none;' )?>">
				<?php echo wp_kses_post( $item['descriptionText'] ); ?>
			</div>
		<?php endforeach; ?>
	</div>
</div><!-- .fx-blocks-tabs -->








