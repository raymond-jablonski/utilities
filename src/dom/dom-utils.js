export function getHTMLElement(document) {
	return document.documentElement
}
export function getBodyElement(document) {
	return document.body
}
export function getHeadElement(document) {
	return document.head
}

export function forEachChild(element, callback, { elementsOnly, directDescendantsOnly, filter } = { elementsOnly: false, directDescendantsOnly: false, filter: (node, depth) => true }) {
	function forEachChildWithDepth(node, callback, { elementsOnly, directDescendantsOnly, filter }, depth = 0) {
		node = elementsOnly ? node.firstElementChild : node.firstChild
		while (node) {
			if (filter(node, depth)) {
				callback(node, depth)
			}
			if (directDescendantsOnly) {
				forEachChildWithDepth(node, callback, { elementsOnly, directDescendantsOnly, filter }, depth + 1)
			}
			node = elementsOnly ? node.nextElementSibling : node.nextSibling
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

export function tableToJSON(table, expandCellSpans = false) {
	const getCellAttributes = (cell) => ({
		colSpan: +(cell.getAttribute("colspan")) || 1,
		rowSpan: +(cell.getAttribute("rowspan")) || 1,
		content: cell,
	})

	const createSectionObject = (section) => ({
		type: section.nodeName,
		rows: [...section.children].map((row) =>
			[...row.children].map((cell) => getCellAttributes(cell))
		),
	})

	const fillIfUndefined = (arr, fillValue, startRowIndex, startColumnIndex, height, width) => {
		const stopRow = Math.min(startRowIndex + height, arr.length)
		const stopColumn = startColumnIndex + width

		for (let rowIndex = startRowIndex; rowIndex < stopRow; rowIndex++) {
			for (let columnIndex = startColumnIndex; columnIndex < stopColumn; columnIndex++) {
				if (!arr[rowIndex][columnIndex]) {
					arr[rowIndex][columnIndex] = fillValue
				}
			}
		}
		return arr
	}

	const sections = [...table.children].filter(
		(node) => node.nodeName === 'TBODY' || node.nodeName === 'THEAD' || node.nodeName === 'TFOOT'
	)

	if (expandCellSpans) {
		const sectionsWithExpandedCells = sections.map((section) => {
			let rows = Array.from({ length: section.children.length }, () => []);
			for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
				let columnIndex = 0
				for (let cell of [...section.children[rowIndex].children]) {
					columnIndex = rows[rowIndex].findIndex((item) => !item)
					if (columnIndex === -1) {
						columnIndex = rows[rowIndex].length
					}
					const { colSpan, rowSpan, content } = getCellAttributes(cell)
					rows = fillIfUndefined(rows, content, rowIndex, columnIndex, rowSpan, colSpan)
				}
			}
			return { ...createSectionObject(section), rows }
		})
		return sectionsWithExpandedCells
	}
	return sections.map((section) => createSectionObject(section))
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

export function createElementFromString(elementString) {
	const parser = new DOMParser()
	const doc = parser.parseFromString(elementString, 'text/html')
	return doc.body.firstChild
}
export function forEachSelectedElement(selector, callback, root = document) {
	root.querySelectorAll(selector).forEach(element => callback(element))
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

export function setText(element, text, asHTML = false) {
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

export function insertNodeBefore(node, nodeToInsertBefore) {
	nodeToInsertBefore.before(node)
}

export function insertNodeAfter(node, nodeToInsertAfter) {
	nodeToInsertAfter.after(node)
}

export function replaceNode(node, replacementNode, reparentChildren = false) {
	if (reparentChildren) {
		transferChildren(node, replacementNode)
	}
	node.replaceWith(replacementNode)
}

export function removeNode(node, reparentChildren = false) {
	if (reparentChildren && node.parentNode) {
		while (node.firstChild) {
			insertNodeBefore(node.firstChild, node)
		}
	}
	node.remove()
}

export function swap(firstNode, secondNode, reparentChildren = false) {
	const firstNodePrev = firstNode.previousSibling
	const firstNodeParent = firstNode.parentNode
	const secondNodePrev = secondNode.previousSibling
	const secondNodeParent = secondNode.parentNode
	if (firstNodeParent) {
		firstNodeParent.removeChild(firstNode)
		secondNodePrev ? secondNodePrev.after(firstNode) : secondNodeParent.prepend(firstNode)
	}
	if (secondNodeParent) {
		secondNodeParent.removeChild(secondNode)
		firstNodePrev ? firstNodePrev.after(secondNode) : firstNodeParent.prepend(secondNode)
	}
	if (reparentChildren) {
		swapChildren(firstNode, secondNode)
	}
}

export function swapChildren(nodeA, nodeB) {
	const tempA = newFragment()
	const tempB = newFragment()
	transferChildren(nodeA, tempA)
	transferChildren(nodeB, tempB)
	nodeA.appendChild(tempB)
	nodeB.appendChild(tempA)
}


export function transferChildren(sourceNode, targetNode) {
	while (sourceNode.firstChild) {
		targetNode.appendChild(sourceNode.firstChild)
	}
}


export function removeMatchingChildren(element, match, { directDescendantsOnly = false, reparentChildren = true } = {}) {
	const children = [...element.children]
	for (let child of children) {
		if (match(child)) {
			removeNode(child, reparentChildren)
		} else if (!directDescendantsOnly) {
			removeMatchingChildren(child, match, { directDescendantsOnly, reparentChildren })
		}
	}
}

export function stripAttributes(element, recursive = true) {
	if (element.nodeType === Node.ELEMENT_NODE) {
		const attributes = element.attributes;
		for (let attribute of attributes) {
			element.removeAttribute(attribute.name);
		}

		if (recursive) {
			const childNodes = element.childNodes;
			for (let childNode of childNodes) {
				stripAttributes(childNode);
			}
		}
	}
	return element;
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
	if (element.parentElement) {
		insertNodeBefore(wrapper, element)
	}
	insertNodeAsLastChild(element, wrapper)
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
export function scrollTo(element, { top, left } = { top: element.scrollTop, left: element.scrollLeft }) {
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