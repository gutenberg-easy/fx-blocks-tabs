console.log( 'Frontend Block JS' );

jQuery( document ).on( 'click', '#hello-click', function() {
	jQuery( '#hello-text' ).toggle();
} );
