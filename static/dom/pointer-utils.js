//clientX: relative to the topleft of the browser viewport
//movementX: delta since the last mousemove event
//offsetX: relative to the topleft of the containing element
//pageX: relative to the topleft of the html element (which may be offscreen)
//screenX: relative to the topleft of the device's screen (or the screen the device says the browser is on)
//x: alias of clientX

export default function handleDrag(element, dragStartCallback, dragCallback, dragEndCallback) {
	element.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); })
	element.addEventListener('pointerdown', dragStart, false);
	element.style.touchAction = "none"
	element.ondragstart = () => false
	let LatestDragInfo = {}
	const standardizeTouchEvent = (evt) => (evt.changedTouches ? evt.changedTouches[0] : evt);
	const getPositionInfoFromEvent = ({ offsetLeft, offsetTop }, { offsetX, offsetY, pageX, pageY, clientX, clientY, screenX, screenY }) => ({
		inPressedElement: { x: offsetX, y: offsetY },
		inRelativeParentOfPressedElement: { x: offsetLeft + offsetX, y: offsetTop + offsetY },
		inHTMLRoot: { x: pageX, y: pageY },
		inBrowserViewport: { x: clientX, y: clientY },
		inPhysicalScreen: { x: screenX, y: screenY },
	});
	function updateDragInfo(DragInfo, element, evt) {
		DragInfo.delta = {
			x: evt.clientX - DragInfo.startLocation.inBrowserViewport.x,
			y: evt.clientY - DragInfo.startLocation.inBrowserViewport.y
		}
		DragInfo.currentLocation = getPositionInfoFromEvent(element, evt)
		return DragInfo;
	}
	function dragStart(evt) {
		try {
			evt.preventDefault()
			evt.stopPropagation()
		} catch (error) {
			console.error("Error in dragStart:", error);
		}
		element.setPointerCapture(evt.pointerId);
		evt = standardizeTouchEvent(evt)
		LatestDragInfo = {
			dragging: true,
			startLocation: getPositionInfoFromEvent(element, evt),
			delta: {
				x: 0,
				y: 0
			}
		}
		LatestDragInfo.currentLocation = LatestDragInfo.startLocation

		element.addEventListener('pointermove', drag);
		element.addEventListener('pointerup', dragEnd)
		element.addEventListener('pointercancel', dragEnd)

		dragStartCallback(LatestDragInfo)
	}

	function drag(evt) {
		let DragInfo = { ...LatestDragInfo }
		try {
			evt.preventDefault()
			evt.stopPropagation()
		} catch (error) {
			console.error("Error in drag:", error);
		}
		if (DragInfo.dragging) {
			console.log("drag")
			evt = standardizeTouchEvent(evt)
			DragInfo = updateDragInfo(DragInfo, element, evt)
			dragCallback(DragInfo)
			LatestDragInfo = DragInfo
		}
	}

	function dragEnd(evt) {
		let DragInfo = { ...LatestDragInfo }
		try {
			evt.preventDefault()
			evt.stopPropagation()
		} catch (error) {
			console.error("Error in dragEnd:", error);
		}
		if (DragInfo.dragging) {
			updateDragInfo(DragInfo, element, evt)
			DragInfo.dragging = false
			element.removeEventListener('pointermove', drag, false);
			element.removeEventListener('pointerup', dragEnd);
			element.removeEventListener('pointercancel', dragEnd)
			dragEndCallback(DragInfo)
			LatestDragInfo = DragInfo
		}
	}
}