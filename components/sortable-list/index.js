/**
 * COMPONENT: SortableList
 * Creates a list of sortable items.
 *
 * @author 10up
 */

/**
 * External Dependencies
 */
import isFunction from 'lodash/isFunction';
import classnames from 'classnames';
import {
	DragDropContext,
	Droppable,
	Draggable,
} from 'react-beautiful-dnd';

/**
 * WordPress Dependencies
 */
const {
	IconButton,
} = wp.components;

const {
	Component,
} = wp.element;

const {
	__,
	sprintf,
} = wp.i18n;

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Reorder the list of items.
 *
 * @param {array} list       List of item objects.
 * @param {int}   startIndex Index to start sorting from.
 * @param {int}   endIndex   Index to end sorting until.
 * @return {obj} Ordered list.
 */
const reorder = ( list, startIndex, endIndex ) => {
	const result    = Array.from( list );
	const [removed] = result.splice( startIndex, 1 );

	result.splice( endIndex, 0, removed );

	return result;
};

/**
 * Usage:
 *
 * - Pass along a list of items in the `items` attribute
 * - Requires the parent element to implement an addItem() function.
 * - Requires the parent element to implement an updateItems() function.
 * - Requires the parent element to implement a renderItem() function.
 *
 * <SortableList
 *     items = { items }
 *     addItem = { addItem }
 *     renderItem = { renderItem }
 *     updateItems = { updateItems }
 *     itemLabel = 'Item Name' (Optional, defaults to "Item")
 *     addItemLabel = 'Item Name' (Optional, defaults to "Item" in "Add Item")
 *     direction = "vertical" (Optional, default vertical)
 *     disableDrag = {false} (Optional, default false)
 * />
 */
class SortableList extends Component {

	/**
	 * Get Items
	 */
	getItems = () => {
		let curItems = this.props.items;

		if ( ! curItems ) {
			curItems = [];
		} else {
			curItems = JSON.parse( curItems );
		}

		return curItems;
	};

	/**
	 * Add Items
	 */
	addItem = () => {
		if ( ! this.props.addItem || ! isFunction( this.props.addItem ) ) {
			console.error(
				'[SortableList] The "addItem" property must be specified and must be a valid function.'
			);
			return;
		}

		this.props.addItem();
	};

	/**
	 * Update Items
	 */
	updateItems = ( items ) => {
		if ( ! this.props.updateItems || ! isFunction( this.props.updateItems ) ) {
			console.error(
				'[SortableList] The "updateItems" property must be specified and must be a valid function.'
			);
			return;
		}

		this.props.updateItems( items );
	};

	/**
	 * Render Item
	 */
	renderItem = ( item ) => {
		if ( ! this.props.renderItem || ! isFunction( this.props.renderItem ) ) {
			console.error(
				'[SortableList] The "renderItem" property must be specified and must be a valid function.'
			);
			return;
		}

		return this.props.renderItem( item );
	};

	/**
	 * Remove Item
	 */
	removeItem = ( index ) => {
		let newItems = this.getItems();
		newItems.splice( index, 1 );
		this.props.updateItems( newItems );
	};

	/**
	 * On Drag End
	 */
	onDragEnd = ( result ) => {
		// Item is dropped outside of the list.
		if ( ! result.destination ) {
			return;
		}

		this.reorderItems( result.source.index, result.destination.index );
	}

	/**
	 * Move Up.
	 */
	moveUp = ( index ) => {
		if ( index > 0 ) {
			this.reorderItems( index, parseInt( index, 10 ) - 1 );
		}
	}

	/**
	 * Move Down.
	 */
	moveDown = ( index ) => {
		this.reorderItems( index, parseInt( index, 10 ) + 1 );
	}

	/**
	 * Reorder Items
	 */
	reorderItems = ( sourceIndex, destinationIndex ) => {
		const reorderedItems = reorder(
			this.getItems(),
			sourceIndex,
			destinationIndex
		);

		this.props.updateItems( reorderedItems );
	};

	/**
	 * Render Callback.
	 */
	render() {
		const labelItemAdd           = this.props.labelItemAdd || 'Add Item';
		const labelItemRemove        = this.props.labelItemRemove || 'Remove Item';
		const labelItemMoveUp        = this.props.labelItemMoveUp || 'Move Up';
		const labelItemMoveDown      = this.props.labelItemMoveDown || 'Move Down';
		const direction              = this.props.direction || 'vertical';
		const disableDrag            = this.props.disableDrag || false;
		const upIcon                 = 'vertical' === direction ? 'arrow-up-alt2' : 'arrow-left-alt2';
		const downIcon               = 'vertical' === direction ? 'arrow-down-alt2' : 'arrow-right-alt2';
		const listItems              = this.getItems();
		const maxIndex               = listItems.length - 1;

		return [
			<div className="sortable-list">
				<DragDropContext onDragEnd={ this.onDragEnd } >
					<Droppable droppableId="sortable-list-droppable" direction={ direction }>
						{ ( provided, snapshot ) => (
							<ul
								ref={ provided.innerRef }
								className={ classnames(
									"sortable-list-items",
									this.props.className || null
								) }
							>
								{
									listItems.map( ( item, index ) => {

										if ( ! item || undefined === item ) {
											return;
										}

										return (
											<Draggable
												draggableId={ index }
												index={ index }
												key={ index }
												isDragDisabled={ false }
											>
												{ ( provided, snapshot ) => (
													<li
														className={ classnames(
															'sortable-list-item',
															snapshot.isDragging ? 'sortable-list-item-dragging' : ''
														) }
														data-id={ index }
														ref={ provided.innerRef }
														{...provided.draggableProps}
													>
														<div className="sortable-list-item-toolbar">
															<IconButton
																className="components-toolbar__control"
																icon="trash"
																key="remove-item"
																// translators: %s: item title/name to be added
																label={ labelItemRemove }
																onClick={ ( event ) => {
																	this.removeItem( event.target.closest( 'li' ).dataset.id );
																} }
															/>
															<IconButton
																className="components-toolbar__control"
																disabled={ 0 === index ? "disabled" : null }
																icon={ upIcon }
																key="up-item"
																label={ labelItemMoveUp }
																onClick={ ( event ) => {
																	event.target.blur();
																	this.moveUp( event.target.closest( 'li' ).dataset.id );
																} }
															/>
															<div
																className="sortable-list-handle"
																{...provided.dragHandleProps}
															>
																<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
																	<path d="M13,8c0.6,0,1-0.4,1-1s-0.4-1-1-1s-1,0.4-1,1S12.4,8,13,8z M5,6C4.4,6,4,6.4,4,7s0.4,1,1,1s1-0.4,1-1S5.6,6,5,6z M5,10
																		c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S5.6,10,5,10z M13,10c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S13.6,10,13,10z M9,6
																		C8.4,6,8,6.4,8,7s0.4,1,1,1s1-0.4,1-1S9.6,6,9,6z M9,10c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S9.6,10,9,10z" />
																</svg>
															</div>
															<IconButton
																className="components-toolbar__control"
																disabled={ maxIndex === index ? "disabled" : null }
																icon={ downIcon }
																key="down-item"
																label={ labelItemMoveDown }
																onClick={ ( event ) => {
																	event.target.blur();
																	this.moveDown( event.target.closest( 'li' ).dataset.id );
																} }
															/>
														</div>
														<div className="sortable-list-item-wrap">
															{ this.renderItem( item ) }
														</div>
													</li>
												) }
											</Draggable>
										);
									} )
								}
								{ provided.placeholder }
							</ul>
						) }
					</Droppable>
				</DragDropContext>
				<IconButton
					className="sortable-list-button-add-item"
					icon="insert"
					key="add-item"
					label={ labelItemAdd }
					onClick={ ( event ) => {
						event.stopPropagation();
						this.addItem();
						event.target.blur();
					} }
				/>
			</div>
		]
	}
}

export default SortableList;
