/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';
import classnames from 'classnames';
import SortableList from '../../components/sortable-list';
import FxClassicEditor from '../../components/fx-classic-editor';

/**
 * Set Locale
 */
wp.i18n.setLocaleData( { '': {} }, 'fx-blocks-tabs' );

/**
 * Internal block libraries
 */
const {
	__
} = wp.i18n;

const {
	registerBlockType
} = wp.blocks;

const {
	InspectorControls,
	BlockControls,
	RichText,
} = wp.editor;

const {
	Fragment
} = wp.element;

const {
	IconButton,
	TextControl,
	TextareaControl,
	ServerSideRender,
	PanelBody,
	PanelRow,
	RadioControl,
} = wp.components;

/**
 * Register block
 */
export default registerBlockType(
	'fx-blocks/tabs',
	{
		title: __( 'Tabs' ),
		description: __( 'f(x) Blocks: Simple tabs block.', 'fx-blocks-tabs' ),
		category: 'common',
		icon: 'welcome-widgets-menus',
		keywords: [
			__( 'Tabs', 'fx-blocks-tabs' ),
			__( 'Toggle', 'fx-blocks-tabs' ),
			__( 'Accordion', 'fx-blocks-tabs' ),
		],
		attributes: {
			preview: {
				type: 'bool',
				default: false,
			},
			display: {
				type: 'string',
				default: 'tabs',
			},
			items: {
				type: 'string',
				default: null,
			},
		},
		edit: props => {
			const { className, isSelected, setAttributes, attributes: { display, items } } = props;

			const getItems = () => {
				let curItems = items;
				if ( ! curItems ) {
					curItems = [];
				} else {
					curItems = JSON.parse( curItems );
				}
				return curItems;
			};

			const addItem = () => {
				let newItems   = getItems();
				newItems.push( {
					id: Date.now(),
					titleText: null,
					descriptionText: null,
				} );
				setAttributes( { items: JSON.stringify( newItems ) } );
			};

			const updateItems = ( items ) => {
				setAttributes( { items: JSON.stringify( items ) } );
			};

			const updateItem = ( id, key, value ) => {
				let curItems = getItems();
				curItems.forEach( function( item ) {
					if ( item.id === id ) {
						item[ key ] = value;
					}
				} );
				updateItems( curItems );
			};

			const renderItem = ( item ) => {
				const Editorsettings = window.wpEditorL10n.tinymce.settings;
				return (
					<div className="fx-blocks-tab">
						<Fragment>
							<TextControl
								type="text"
								placeholder={ __( 'Title', 'fx-blocks-tabs' ) }
								value={ item.titleText }
								onChange={ ( value ) => updateItem( item.id, 'titleText', value ) }
							/>
							<FxClassicEditor
								{ ...props }
								editorSettings={ {
									plugins: Editorsettings.plugins,
									toolbar1: 'bold,italic,link,unlink',
									inline: false,
								} }
								editorID={ item.id }
								editorValue={ item.descriptionText }
								onBlur={ ( value ) => {
									updateItem( item.id, 'descriptionText', value )
								} }
								attributeName={ item.descriptionText }
							/>
						</Fragment>
					</div>
				);
			};

			if ( undefined === items || items < 1 ) {
				addItem();
			}

			return [
				!! props.isSelected && (
					<InspectorControls key="inspector">
						<PanelBody
							title={ __( 'Display Settings' ) }
							initialOpen={ true }
						>
							<PanelRow key='display'>
								<RadioControl
									selected={ props.attributes.display }
									options={ [
										{
											label: __( 'Tabs', 'fx-blocks-tabs' ),
											value: 'tabs',
										},
										{
											label: __( 'List', 'fx-blocks-tabs' ),
											value: 'toggle',
										},
									] }
									onChange={ ( value ) => {
										props.setAttributes( { display: value } )
									} }
								/>
							</PanelRow>
						</PanelBody>
					</InspectorControls>
				),
				<Fragment>
					<BlockControls>
						<div className="components-toolbar">
							<IconButton
								icon={ props.attributes.preview ? 'edit' : 'visibility' }
								label={ props.attributes.preview ? __( 'Edit', 'fx-blocks-tabs' ) : __( 'Preview', 'fx-blocks-tabs' ) }
								onClick={ ( event ) => {
									event.stopPropagation();
									props.setAttributes( { preview: ! props.attributes.preview } );
									event.target.blur();
								} }
								className='components-toolbar__control'
							/>
						</div>
					</BlockControls>

					{ props.attributes.preview ? (
						<div>
							<ServerSideRender
								block={ props.name }
								attributes={ props.attributes }
							/>
						</div>
					) : (
						<SortableList
							items={ items }
							addItem={ addItem }
							updateItems={ updateItems }
							renderItem={ renderItem }
							labelItemAdd={ __( 'Add Item', 'fx-blocks-tabs' ) }
							className={ `item` }
							direction="vertical"
							disableDrag={ false }
						/>
					) }
				</Fragment>
			];
		},
		save: props => {
			return false;
		},
	},
);
