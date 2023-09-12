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

export function isParent(element, parent) {
	if (element.parentNode === null) {
		return false
	}
	if (element.parentNode === parent) {
		return true
	}
	return isParent(element.parentNode, parent)
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
export function flowChildren(ele) {
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


