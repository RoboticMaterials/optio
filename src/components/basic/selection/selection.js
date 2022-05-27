import React, {useEffect, useRef, useState} from "react";
var PropTypes = require('prop-types')
import usePrevious from "../../../hooks/usePrevious";

var _ = require('lodash');
//var React = require('react/addons');

const Selection = (props) => {
	const {
		enabled,
		onSelectionChange,
		children
	} = props

	const [mouseDown, setMouseDown] = useState(false)
	const [startPoint, setStartPoint] = useState(null)
	const [endPoint, setEndPoint] = useState(null)
	const [selectionBox, setSelectionBox] = useState(null)
	const [selectedItems, setSelectedItems] = useState({})
	const [appendMode, setAppendMode] = useState(false)
	const [selectedChildren, setSelectedChildren] = useState({})

	const previousEnabled = usePrevious(enabled)

	const selectionBoxRef = useRef(null)



	useEffect(() => {
		setSelectedChildren({})

	}, [])

	/**
	 * On component props change
	 */
	useEffect(() => {
		if((previousEnabled !== enabled) && !enabled) setSelectedChildren({})

	}, [enabled])


	/**
	 * On component update
	 */
	useEffect(() => {
		if(mouseDown && !_.isNull(selectionBox)) {
			updateCollidingChildren(selectionBox);
		}
	}, [mouseDown, selectionBox])


	/**
	 * On root element mouse down
	 */
	const onMouseDown = (e) => {
		if(!enabled || e.button === 2 || e.nativeEvent.which === 2) {
			return;
		}

		if(e.ctrlKey || e.altKey || e.shiftKey) {
			setAppendMode(true)
		}
		setMouseDown(true)
		setStartPoint({
			x: e.pageX,
			y: e.pageY
		})

		window.document.addEventListener('mousemove', onMouseMove);
		window.document.addEventListener('mouseup', onMouseUp);
	}

	/**
	 * On document element mouse up
	 */
	const onMouseUp = (e) => {
		window.document.removeEventListener('mousemove', onMouseMove);
		window.document.removeEventListener('mouseup', onMouseUp);

		setMouseDown(false)
		setStartPoint(null)
		setEndPoint(null)
		setSelectionBox(null)
		setAppendMode(false)

		onSelectionChange.call(null, _.keys(selectedChildren));
	}

	/**
	 * On document element mouse move
	 */
	const onMouseMove = (e) => {
		e.preventDefault()

		if(mouseDown) {
			var newEndPoint = {
				x: e.pageX,
				y: e.pageY
			};

			setEndPoint(newEndPoint)
			setSelectionBox(calculateSelectionBox(startPoint, newEndPoint))
		}
	}



	/**
	 * Render children
	 */
	const renderChildren = () => {
		var index = 0;
		var tmpChild;

		return React.Children.map(children, function(child) {
			var tmpKey = _.isNull(child.key) ? index++ : child.key;
			var isSelected = _.has(selectedChildren, tmpKey);
			tmpChild = React.cloneElement(child, {
				ref: tmpKey,
				//selectionParent: _this,
				isSelected: isSelected
			});
			return React.DOM.div({
				className: 'select-box ' + (isSelected ? 'selected' : ''),
				onClickCapture: function(e) {
					if((e.ctrlKey || e.altKey || e.shiftKey) && enabled) {
						e.preventDefault();
						e.stopPropagation();
						selectItem(tmpKey, !_.has(selectedChildren, tmpKey));
					}
				}
			}, tmpChild);
		});
	}

	/**
	 * Render selection box
	 */
	const renderSelectionBox = () => {
		if(!mouseDown || _.isNull(endPoint) || _.isNull(startPoint)) {
			return null;
		}
		return(
			<div className='selection-border' style={selectionBox}></div>
		);
	}

	/**
	 * Manually update the selection status of an item
	 * @param {string} key the item's target key value
	 * @param {boolean} isSelected the item's target selection status
	 */
	const selectItem = (key, isSelected) => {
		if(isSelected) {
			setSelectedChildren({
				...selectedChildren,
				[key]: isSelected

			})
		}
		else {
			const {
				[key]: removedChild,
				...rest
			} = selectedChildren

			setSelectedChildren(rest)
		}

		onSelectionChange.call(null, _.keys(selectedChildren));
	}

	/**
	 * Select all items
	 */
	const selectAll = () => {
		let selectedChildrenClone = {...selectedChildren}

		_.each(refs, function(ref, key) {
			if(key !== 'selectionBox') {
				selectedChildrenClone = {
					...selectedChildrenClone,
					[key]: true
				}
			}
		})

		setSelectedChildren(selectedChildrenClone)
	}

	/**
	 * Manually clear selected items
	 */
	const clearSelection = () => {
		setSelectedChildren({})
		onSelectionChange.call(null, []);
		// this.forceUpdate();
	}

	/**
	 * Detect 2D box intersection
	 */
	const _boxIntersects = (boxA, boxB) => {
		if(boxA.left <= boxB.left + boxB.width &&
			boxA.left + boxA.width >= boxB.left &&
			boxA.top <= boxB.top + boxB.height &&
			boxA.top + boxA.height >= boxB.top) {
			return true;
		}
		return false;
	}

	/**
	 * Updates the selected items based on the
	 * collisions with selectionBox
	 */
	const updateCollidingChildren = (selectionBox) => {
		var tmpNode = null;
		var tmpBox = null;

		let setSelectedChildrenClone = {...selectedChildren}
		_.each(this.refs, function(ref, key) {
			if(key !== 'selectionBox') {
				tmpNode = React.findDOMNode(ref);
				tmpBox = {
					top: tmpNode.offsetTop,
					left: tmpNode.offsetLeft,
					width: tmpNode.clientWidth,
					height: tmpNode.clientHeight
				};
				if(_boxIntersects(selectionBox, tmpBox)) {
					setSelectedChildrenClone = {
						...setSelectedChildrenClone,
						[key]: true
					}

				}
				else {
					if(!appendMode) {
						const {
							[key]: deletedChild,
							...rest
						} = setSelectedChildrenClone

						setSelectedChildrenClone = {...rest}
					}
				}
			}
		});

		setSelectedChildren(setSelectedChildrenClone)


	}

	/**
	 * Calculate selection box dimensions
	 */
	const calculateSelectionBox = (startPoint, endPoint) => {
		if(!mouseDown || _.isNull(endPoint) || _.isNull(startPoint)) {
			return null;
		}

		var parentNode = selectionBox.current.getDOMNode();
		var left = Math.min(startPoint.x, endPoint.x) - parentNode.offsetLeft;
		var top = Math.min(startPoint.y, endPoint.y) - parentNode.offsetTop;
		var width = Math.abs(startPoint.x - endPoint.x);
		var height = Math.abs(startPoint.y - endPoint.y);
		return {
			left: left,
			top: top,
			width: width,
			height: height
		};
	}

	/**
	 * Render
	 */
	const render = () => {
		var className = 'selection ' + (mouseDown ? 'dragging' : '')

		return(
			<div className={className} ref={selectionBoxRef} onMouseDown={onMouseDown}>
				{renderChildren()}
				{renderSelectionBox()}
			</div>
		);
	}

};


// Specifies propTypes
Selection.propTypes = {
	enabled: React.PropTypes.bool,
	onSelectionChange: React.PropTypes.func
};

// Specifies the default values for props:
Selection.defaultProps = {
	enabled: true,
	onSelectionChange: () => {},
};

export default Selection