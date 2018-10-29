jQuery( document ).on( 'click', '.fx-blocks-tabs-nav-item', function() {
	jQuery( this ).parents( 'ul' ).find( 'a' ).addClass( 'not-selected' );
	jQuery( this ).find( 'a' ).removeClass( 'not-selected' ).addClass( 'selected' );
	var panel = jQuery( this ).find( 'a' ).attr( 'href' );
	var $panel = jQuery( panel );
	jQuery( '.fx-blocks-tabs-panel' ).hide();
	$panel.show();
} );
