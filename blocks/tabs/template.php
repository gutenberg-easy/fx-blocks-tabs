<?php
/**
 * Template.
 *
 * @var $attributes array
 * @var $content    string
 */
?>

<div>
	<h3>Tabs</h3>
	<p>Attr: <?php echo json_encode( array_map( 'esc_attr', $attributes ) ); ?></p>
	<p>Content: <?php echo json_encode( $content ); ?></p>
</div>
