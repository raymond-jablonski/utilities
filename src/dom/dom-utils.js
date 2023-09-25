export function getHTMLElement(document) {
	return document.documentElement
}
export function getBodyElement(document) {
	return document.body
}
export function getHeadElement(document) {
	return document.head
}

export function forEachChild(element, callback, { elementsOnly, directDescendantsOnly, filter } = { elementsOnly: false, directDescendantsOnly: false, filter: node => true }) {
	function forEachChildWithDepth(element, callback, { elementsOnly, directDescendantsOnly, filter }, depth = 0) {
		element = elementsOnly ? element.firstElementChild : element.firstChild
		while (element) {
			if (filter(element)) {
				callback(element, depth)
			}
			if (directDescendantsOnly) {
				forEachChildWithDepth(element, callback, { elementsOnly, directDescendantsOnly, filter }, depth + 1)
			}
			element = elementsOnly ? element.nextElementSibling : element.nextSibling
		}
	}
	forEachChildWithDepth(element, callback, { elementsOnly, directDescendantsOnly, filter })
}

export function hasChildren(element, elementsOnly = false) {
	return elementsOnly ? element.children.length > 0 : element.hasChildNodes()
}

export function forEachSiblng(element, callback, { filter, elementsOnly } = { filter: node => true, elementsOnly: false }) {
	let sibling = elementsOnly ? element.parentElement.firstElementChild : element.parentElement.firstChild
	let before = true
	while (sibling) {
		if (sibling === element) {
			before = false
		} else {
			if (filter(sibling)) {
				callback(sibling, before)
			}
		}
		sibling = elementsOnly ? sibling.nextElementSibling : sibling.nextSibling
	}
}

export function tableToJSON(table, expandExtendedCells = false) {
	const Sections = [...table.children]
		.filter(node => node.nodeName === 'TBODY' || node.nodeName === 'THEAD' || node.nodeName === 'TFOOT')
		.map(section => ({ type: section.nodeName, rows: [...section.children].map(row => [...row.children]) }))
	if (expandExtendedCells) {
		return Sections.map(section => {
			let filledArr = []
			for (let rowIndex in section.rows) {
				for (let cellIndex in section.rows[rowIndex]) {
					const cell = row[cellIndex]
					const ColSpan = +(cell.getAttribute("colspan")) || 1
					const RowSpan = +(cell.getAttribute("rowspan")) || 1
					const currentCol = column
					fill2DArr(filledArr, { row, currentCol, ColSpan, RowSpan }, cell, true)
				}
			}
			filledArr.length = section.rows.length
			return { ...section, rows: filledArr }
		})
	}

	return Sections
}

export function elementMatchesCSS(element, selector) {
	return element.matches(selector)
}

export function closestMatchingParent(element, matcher) {
	const parent = element.parentElement
	if (parent === null) {
		return null
	}
	if (matcher(parent)) {
		return parent
	}
	return closestMatchingParent(parent, matcher)
}

export function elementMatches(element, { id, className, tagName, hasAttribute, anyId, anyClassName, anyTagName, anyAttribute, everyClassName, everyAttribute } = {}) {
	if (id && element.id !== id) {
		return false
	}
	if (className && !element.classList.contains(className)) {
		return false
	}
	if (tagName && element.tagName !== tagName) {
		return false
	}
	if (hasAttribute && !element.hasAttribute(hasAttribute)) {
		return false
	}
	if (anyId && !anyId.split(' ').any(id => element.id !== id)) {
		return false
	}
	if (anyClassName && !anyClassName.split(' ').any(className => element.classList.contains(className))) {
		return false
	}
	if (anyTagName && !anyTagName.split(' ').any(tagName => element.tagName !== tagName)) {
		return false
	}
	if (anyAttribute && !anyAttribute.split(' ').any(attribute => element.hasAttribute(attribute))) {
		return false
	}
	if (everyClassName && !everyClassName.split(' ').every(className => element.classList.contains(className))) {
		return false
	}
	if (everyAttribute && !everyAttribute.split(' ').every(attribute => element.hasAttribute(attribute))) {
		return false
	}
	return true
}

export function forEachMatchingChild(element, matcher, callback, { directDescendantsOnly, elementsOnly } = { directDescendantsOnly: false, elementsOnly: false }) {
	forEachChild(element, (child, depth) => { if (elementMatches(child, matcher)) { callback(child, depth) } }, { directDescendantsOnly, elementsOnly })
}

export function isElement(element) {
	return element instanceof Element
}

export function elementIsTaggedHidden(element) {
	return element.hasAttribute('hidden')
}
export function setElementHiddenTag(element, hidden = true) {
	if (hidden) {
		element.setAttribute('hidden', '')
	} else {
		element.removeAttribute('hidden')
	}
}



export function insertText(element, text, asHTML = false) {
	if (asHTML) {
		element.innerHTML = text
	} else {
		element.textContent = text
	}
}

export function insertNodeAsFirstChild(nodeToInsert, parent) {
	parent.prepend(nodeToInsert)
}

export function insertNodeAsLastChild(nodeToInsert, parent) {
	parent.appendChild(nodeToInsert)
}

export function insertNodeBefore(nodeToInsert, nodeToInsertBefore) {
	nodeToInsertBefore.before(nodeToInsert)
}

export function insertNodeAfter(nodeToInsert, nodeToInsertAfter) {
	nodeToInsertAfter.after(nodeToInsert)
}

export function replaceNode(nodeToInsert, nodeToReplace) {
	nodeToReplace.replaceWith(nodeToInsert)
}

export function removeNode(node, reparentChildren = false) {
	if (reparentChildren && node.parentNode) {
		while (node.firstChild) {
			node.parentNode.insertBefore(node.firstChild, node)
		}
	}
	node.remove()
}

export function cloneNode(node, deep = false) {
	return node.cloneNode(deep)
}

export function createFragment() {
	return new DocumentFragment()
}

export function createStyleIfNotExist(document, styleText) {
	if (!document.querySelector(`style[data-style="${styleText}"]`)) {
		const style = document.createElement('style')
		style.dataset.style = styleText
		style.textContent = styleText
		document.head.appendChild(style)
	}
}

export function getStyleValues(element, psuedoElement) {
	return getComputedStyle(element, psuedoElement)
}

export function insertHTMLAsFirstChild(HTML, parent) {
	parent.insertAdjacentHTML('afterbegin', HTML)
}

export function insertHTMLAsLastChild(HTML, parent) {
	parent.insertAdjacentHTML('beforeend', HTML)
}

export function insertHTMLBefore(HTML, nodeToInsertBefore) {
	nodeToInsertBefore.insertAdjacentHTML('beforebegin', HTML)
}

export function insertHTMLAfter(HTML, nodeToInsertAfter) {
	nodeToInsertAfter.insertAdjacentHTML('afterend', HTML)
}

export function insertTextAsFirstChild(text, parent) {
	insertText(parent, text, false)
}

export function insertTextAsLastChild(text, parent) {
	insertText(parent, text, false)
}

export function insertTextBefore(text, nodeToInsertBefore) {
	insertText(nodeToInsertBefore, text, false)
}

export function insertTextAfter(text, nodeToInsertAfter) {
	insertText(nodeToInsertAfter, text, false)
}

export function wrapElement(element, wrapper) {
	if(element.parentElement) {
		insertNodeBefore(wrapper, element)
	}
	insertAsLastChild(element, wrapper)
}

export function hasAttribute(element, attribute) {
	return element.hasAttribute(attribute)
}

export function getAttribute(element, attribute) {
	return element.getAttribute(attribute)
}

export function setAttribute(element, attribute, value) {
	element.setAttribute(attribute, value)
}

export function removeAttribute(element, attribute) {
	element.removeAttribute(attribute)
}

export function forEachAttribute(element, callback) {
	for (let attribute of element.attributes) {
		callback(attribute.name, attribute.value)
	}
}

export function forEachClass(element, callback) {
	for (let className of element.classList) {
		callback(className)
	}
}

export function addClass(element, className) {
	element.classList.add(className)
}

export function removeClass(element, className) {
	element.classList.remove(className)
}

export function attributeNameToCamelCase(attribute) {
	return attribute.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

export function camelCaseAttributeNameToHyphen(attribute) {
	return attribute.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
}

export function createElement(document, tagName, { id, classNames, attributes, textContent, innerHTML, parentElement } = {}) {
	const element = document.createElement(tagName)
	if (id) {
		element.id = id
	}
	if (classNames) {
		element.className = classNames
	}
	if (attributes) {
		for (let attribute in attributes) {
			element.setAttribute(attribute, attributes[attribute])
		}
	}
	if (textContent) {
		element.textContent = textContent
	}
	if (innerHTML) {
		element.innerHTML = innerHTML
	}
	if (parentElement) {
		parentElement.appendChild(element)
	}
	return element
}

export function createTextNode(document, text, parentElement) {
	const textNode = document.createTextNode(text)
	if (parentElement) {
		parentElement.appendChild(textNode)
	}
	return textNode
}

export function getDimensions(element) {
	return {
		offsetParent: {
			top: element.offsetTop,
			left: element.offsetLeft,
			element: element.offsetParent
		},
		withBordersAndScrollbars: {
			width: element.offsetWidth,
			height: element.offsetHeight
		},
		withoutBordersAndScrollbars: {
			width: element.clientWidth,
			height: element.clientHeight
		},
		scrollArea: {
			width: element.scrollWidth,
			height: element.scrollHeight
		},
		scrollPosition: {
			top: element.scrollTop,
			left: element.scrollLeft
		},
		borderDimensions: {
			left: element.clientLeft,
			top: element.clientTop,
			right: element.offsetWidth - element.clientWidth - element.clientLeft,
			bottom: element.offsetHeight - element.clientHeight - element.clientTop
		}
	}
}

export function scrollIntoView(element, top = false) {
	element.scrollIntoView(top)
}
export function scrollTo(element, { top, left } = {top: element.scrollTop, left: element.scrollLeft}}) {
	element.scrollTo(top, left)
}

export function onDOMReady(document, callback) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", callback)
	} else {
		callback()
	}
}

export function POSTOnNavigateAway(window, url, data) {
	window.addEventListener('beforeunload', () => {
		navigator.sendBeacon(url, data)
	})
}

export function requireConfirmationOnNavigateAway(window, message) {
	window.addEventListener('beforeunload', (event) => {
		event.returnValue = message
		return message
	})
}

export function isParent(element, parent, direct = false) {
	if (element.parentNode === parent) {
		return true
	}
	if (!direct && element.parentNode) {
		return isParent(element.parentNode, parent)
	}
	return false
}


export function singleKeyObjectToHTML(obj) {
	const key = Object.keys(obj)[0];
	if (key === "table") {
		const rows = obj[key]
		return rows.reduce((p, c) => `${p}<tr>${c.reduce((p, c) => `${p}${singleKeyObjectToHTML(c)}`, '')}</tr>`, '<table><tbody>') + '</tbody></table>'
	}
	return `<${key}>${obj[key]}</${key}>`
}

export function arraysToObjects(keys, ...valueArrays) {
	const objectArray = valueArrays.map(values => {
		return keys.reduce((obj, key, index) => {
			obj[key] = values[index]
			return obj
		}, {})
	})
	return objectArray
}

export function removeDuplicates(arr, equalityCheck = (a, b) => a === b) {
	return arr.reduce((p, c, index, arr) => {
		if (!p.some((item) => equalityCheck(item, c))) {
			p.push(c);
		}
		return p;
	}, []);
}

export function getDuplicates(arr, equalityCheck = (a, b) => a === b) {
	const duplicates = []
	const seen = new Set()
	arr.forEach((current, index) => {
		arr.slice(index + 1).filter(compare => equalityCheck(current, compare) && !seen.has(current))
			.forEach(() => {
				duplicates.push(current)
				seen.add(current)
			})
	})
	return duplicates
}

export function getWithMatchesRemoved(arr, match = (val, index) => val === null || val === undefined) {
	return arr.filter((value, index) => !match(value, index))
}

export function mapXPath(XPath, mapper, parentNode = document) {
	const Result = document.evaluate(XPath, parentNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE)
	let ans = []
	while (node = Result.iterateNext()) {
		ans.push(mapper(node))
	}
	return ans
}



export function allDescendantsFlattened(element) {
	const descendants = []
	let child = element.firstElementChild
	while (child && isParent(child, element)) {
		descendants.push(child)
		child = nextElementFlattened(child)
	}
	return descendants
}

export function allElementsAfterFlattened(element) {
	const elements = []
	let currentElement = nextElementFlattened(element)
	while (currentElement) {
		elements.push(currentElement)
		currentElement = nextElementFlattened(currentElement)
	}
	return elements
}

export function allElementsBeforeFlattened(element) {
	const elements = []
	let currentElement = previousElementFlattened(element)
	while (currentElement) {
		elements.push(currentElement)
		currentElement = previousElementFlattened(currentElement)
	}
	return elements
}

export function nextElementFlattened(element) {
	let nextElement = element.firstElementChild || element.nextElementSibling
	while (!nextElement && element.parentElement) {
		element = element.parentElement
		nextElement = element.nextElementSibling
	}
	return nextElement || null
}

export function previousElementFlattened(element) {
	function getlastChildElement(element) { return element.lastElementChild ? getlastChildElement(element.lastElementChild) : element }
	if (element.previousElementSibling) {
		const lastChildElement = getlastChildElement(element.previousElementSibling)
		return lastChildElement === element ? element.previousElementSibling : lastChildElement
	} else {
		return element.parentElement || null
	}
}

export function nextMatchingElementFlattened(element, matcher) {
	element = nextElementFlattened(element)
	return element ? (matcher(element) ? element : nextMatchingElementFlattened(element, matcher)) : null
}

export function previousMatchingElementFlattened(element, matcher) {
	element = previousElementFlattened(element)
	return element ? (matcher(element) ? element : previousMatchingElementFlattened(element, matcher)) : null
}

export function filterAndMap(arr, ...mappers) {
	return arr.reduce((prev, curr) => {
		const result = mappers.find(mapper => mapper(curr))
		if (result) {
			prev.push(result(curr))
		}
		return prev;
	}, []);
}

export function replaceArrValues(arrToPushInto, arrToPullFrom, valuesToReplaceTest = (ele) => ele === null || ele === undefined ? true : false) {
	const arrToPullFromCopy = [...arrToPullFrom]
	return [
		arrToPushInto.map(val => (arrToPullFromCopy.length === 0 || !valuesToReplaceTest(val)) ? val : arrToPullFromCopy.shift()),
		arrToPullFromCopy
	]
}



export function fill2DArr(arr, { row, column, width, height }, fillValue, fillUndefined = false) {
	if (fillUndefined) {
		for (let rowIndex = row; rowIndex < row + height; rowIndex++) {
			if (!arr[rowIndex]) {
				arr[rowIndex] = new Array(column + width);
			} else {
				arr[rowIndex].length = Math.max(arr[rowIndex].length, column + width);
			}
		}
	}
	arr.slice(row, row + height).forEach((rowArr) => rowArr.fill(fillValue, column, column + width));
	return arr;
}


export function arrToMatrix(arr, fillValue) {
	const maxRowLength = Math.max(...arr.map(row => row.length));
	return arr.map(row => {
		const newRow = [...row];
		while (newRow.length < maxRowLength) {
			newRow.push(fillValue);
		}
		return newRow;
	})
}

export function findNextElement(selector, element) {
	const nextSibling = element.nextElementSibling
	if (!nextSibling) {
		return null;
	}
	if (nextSibling.matches(selector)) {
		return nextSibling;
	}
	return findNextElement(selector, nextSibling)
}


export function getAllFromXPath(XPathExpression, elementContext = document) {
	const XIterator = document.evaluate(XPathExpression, elementContext);
	let allMatches = []
	let currentMatch = XIterator.iterateNext()
	while (currentMatch) {
		allMatches.push(currentMatch)
		currentMatch = XIterator.iterateNext()
	}
	return allMatches
}




// function that takes an element, gets its height and width, then turns it into a block-level element with a fixed height and width and a horizontal-only scroll
// then takes each child element, gets its height and width, then turns it into a block-level element with a fixed height and width 
// The child elements are stacked from top to bottom in a column, and if the bottom of the column is reached, a new column is created and the remaining children are added to that column

let observer = new IntersectionObserver(entries => {
	entries.forEach((entry) => {
		unflowChildren(entry.target)
		flowChildren(entry.target)
	})
}, {});


function unflowChildren(ele) {
	ele.style.height = ''
	ele.style.width = ''
	ele.style.overflow = ''
	ele.style.whiteSpace = ''
	for (let column of ele.children) {
		for (let child of column.children) {
			child.style.display = ''
			child.style.height = ''
			child.style.width = ''
			ele.appendChild(child)
		}
		ele.removeChild(column)
	}
}

function flowChildren(ele) {
	preventViewOverflow(ele.parentElement)
	function preventViewOverflow(ele) {
		ele.style.height = `${(document.documentElement.clientHeight - ele.getBoundingClientRect().top)}px`
		ele.style.width = `${(document.documentElement.clientWidth - ele.getBoundingClientRect().left)}px`
	}
	function createColumn() {
		const column = document.createElement('div')
		column.style.display = 'inline-block'
		column.style.overflow = 'hidden'
		column.style.height = '100%'
		ele.appendChild(column)
		return column
	}
	function addChildToColumn(column, child) {
		column.appendChild(child)
	}
	function freezeDimensions(ele) {
		const { height, width } = { height: ele.offsetHeight, width: ele.offsetWidth }
		ele.style.height = `${height}px`
		ele.style.width = `${width}px`
	}
	ele.style.height = `100%`
	ele.style.width = `100%`
	freezeDimensions(ele)
	ele.style.overflow = 'auto hidden'
	ele.style.whiteSpace = 'nowrap'

	for (let child of ele.children) {
		child.style.display = 'block'
		freezeDimensions(child)
	}
	const { height, width } = { height: ele.offsetHeight, width: ele.offsetWidth }

	const children = [...ele.children]
	let currentColumn = createColumn()
	let currentHeight = 0
	children.forEach(child => {
		if (currentHeight + child.offsetHeight > height) {
			currentColumn = createColumn()
			currentHeight = 0
			addChildToColumn(currentColumn, child)
		} else {
			addChildToColumn(currentColumn, child)
		}
		currentHeight += child.offsetHeight
	})
}


