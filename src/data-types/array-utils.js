export function create(length, eachItem = (index) => undefined) {
	return Array.from({ length }, (index) => eachItem(index))
}

export function getLength(arr) {
	return arr.length
}

export function getSize(arr) {
	return getLength(arr)
}

export function eachIndex(arr, callback) {
	for (let index in arr) {
		callback(+index)
	}
}

export function eachItem(arr, callback) {
	for (let item of arr) {
		callback(item);
	}
}

export function eachIndexItem(arr, callback) {
	for (let index in arr) {
		callback(+index, arr[index])
	}
}

export function addItemToBeginning(arr, item) {
	arr.unshift(item)
	return arr
}

export function addItemToEnd(arr, item) {
	arr.push(item)
	return arr
}

export function removeLastItem(arr) {
	arr.pop()
	return arr
}

export function getFirstItem(arr) {
	return arr[0]
}

export function getLastItem(arr) {
	return arr[arr.length - 1]
}

export function transformEach(arr, transform) {
	return arr.map((item, index) => transform(item, index, arr))
}

export function sort(arr, sorter) {
	return arr.sort(sorter)
}

export function reverse(arr) {
	return arr.reverse()
}

export function merge(...arrs) {
	return [...arrs]
}

export function flatten(...arrs) {
	return arrs.flat()
}

export function flattenRecursive(...arrs) {
	return arrs.flat(Infinity)
}

export function hasItem(arr, item) {
	return arr.includes(item)
}

export function firstIndexOfItem(arr, item) {
	return arr.indexOf(item)
}

export function lastIndexOfItem(arr, item) {
	return arr.lastIndexOf(item)
}

export function allIndexesOfItem(arr, item) {
	return arr.reduce((prev, curr, index) => {
		if (curr === item) {
			prev.push(index)
		}
		return prev
	}, [])
}

export function firstMatchingIndex(arr, itemFunction) {
	return arr.findIndex(function (item) {
		return itemFunction(item)
	})
}

export function lastMatchingIndex(arr, itemFunction) {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (itemFunction(arr[i])) {
			return i
		}
	}
	return -1
}

export function allMatchingIndexes(arr, matchFunction) {
	return arr.reduce((prev, curr, index) => {
		if (matchFunction(curr, index)) {
			prev.push(index)
		}
		return prev
	}, [])
}

export function firstMatchingItem(arr, matchFunction) {
	return arr.find((item, index) => matchFunction(item, index))
}

export function lastMatchingItem(arr, matchFunction) {
	for (let index = arr.length - 1; index >= 0; index--) {
		const item = arr[i]
		if (matchFunction(item, index)) {
			return item
		}
	}
	return undefined
}

export function allMatchingItems(arr, matchFunction) {
	return arr.filter((item, index) => matchFunction(item, index))
}

export function removeFirstInstanceOfItem(arr, item) {
	const index = firstIndexOfItem(arr, item)
	if (index !== -1) {
		return removeElementAt(arr, index)
	}
	return arr
}

export function removeLastInstanceOfItem(arr, item) {
	const index = lastIndexOfItem(arr, item)
	if (index !== -1) {
		return removeElementAt(arr, index)
	}
	return arr
}

export function trim(arr, length) {
	arr.splice(length)
	return arr
}

export function trimAfter(arr, index) {
	arr.splice(index + 1)
	return arr
}

export function trimBefore(arr, index) {
	arr.splice(0, index)
	return arr
}

export function removeElementAt(arr, index) {
	arr.splice(index, 1)
	return arr
}

export function removeElementsFrom(arr, index, count) {
	arr.splice(index, count)
	return arr
}

export function insertBefore(arr, index, ...elements) {
	arr.splice(index, 0, ...elements)
	return arr
}

export function insertAfter(arr, index, ...elements) {
	arr.splice(index + 1, 0, ...elements)
	return arr
}

export function insertAndReplaceAt(arr, index, ...elements) {
	arr.splice(index, 1, ...elements)
	return arr
}

export function isClean(arr) {
	if (!Array.isArray(arr)) {
		return false
	}
	for (let key in arr) {
		if (key != +key || key < 0) {
			return false
		}
	}
	return true
}

export function clean(arr) {
	if (Array.isArray(arr)) {
		for (let key in arr) {
			if (key != +key || key < 0) {
				delete arr[key]
			}
		}
		return arr
	} else if (typeof arr === "object") {
		return Object.entries(arr).reduce((prev, [key, value]) => { if (key == +key && key >= 0) { prev[key] = value } return prev }, [])
	} else {
		arr = [arr]
	}
	return arr
}

export function delimitedStringToArray(arr, delimiter) {
	return arr.split(delimiter)
}

export function clone(arr) {
	return [...arr]
}

export function compute(arr, computeFunction, answer = 0) {
	const length = arr.length
	const lastIndex = length - 1
	return arr.reduce(function (answer, item, index) {
		computeFunction({ answer, item, index, lastIndex, length })
	}, answer)
}

export function chunk(arr, chunkSize) {
	function* cGen(arr, chunkSize) {
		for (let i = 0; i < arr.length; i += chunkSize) {
			yield arr.slice(i, i + chunkSize);
		}
	}
	return [...cGen(arr, chunkSize)]
}

export function chunkAfter(arr, chunkCheck) {
	function* cGen(arr, chunkCheck) {
		let chunk = []
		for (let index in arr) {
			const item = arr[index]
			chunk.push(item)
			if (chunkCheck(item, index)) {
				yield chunk
				chunk = []
			}
		}
		if (chunk.length) {
			yield chunk
		}
	}
	return [...cGen(arr, chunkCheck)]
}

export function forEachAdjacentSet(arr, setSize, callback) {
	function* cGen(arr, setSize) {
		for (let i = 0; i < arr.length; i++) {
			const set = arr.slice(i, i + setSize)
			if (set.length === setSize) {
				yield set
			}
		}
	}
	for (let set of cGen(arr, setSize)) {
		callback(set)
	}
}

export function forEachToArray(forEachFunction, ...args) {
	const arr = []
	forEachFunction(...args, (ans) => arr.push(ans))
	return arr
}

export function swap(arr, index1, index2) {
	const temp = arr[index1]
	arr[index1] = arr[index2]
	arr[index2] = temp
}

export function forEachSet(arr, setSize, callback) {
	function generateCombinations(arr, setSize, index = 0, currentSet = []) {
		if (currentSet.length === setSize) {
			callback(currentSet.slice())
			return
		}
		if (index >= arr.length) {
			return
		}
		currentSet.push(arr[index])
		generateCombinations(arr, setSize, index + 1, currentSet)
		currentSet.pop()
		generateCombinations(arr, setSize, index + 1, currentSet)
	}
	generateCombinations(arr, setSize)
}

export function forEachPermutation(arr, callback) {
	function generatePermutations(arr, index = 0) {
		if (index >= arr.length - 1) {
			callback(arr.slice())
			return
		}
		for (let i = index; i < arr.length; i++) {
			swap(arr, index, i)
			generatePermutations(arr, index + 1)
			swap(arr, index, i)
		}
	}
	generatePermutations(arr)
}

export function reverseArrInPlace(arr, startIndex = 0, endIndex = arr.length - 1) {
	while (endIndex > startIndex) {
		let temp = arr[endIndex]
		arr[endIndex] = arr[startIndex]
		arr[startIndex] = temp
		endIndex--
		startIndex++
	}
}

export function removeDuplicates(arr, equalityCheck = (a, b) => a === b) {
	return arr.reduce((p, c, index, arr) => {
		if (!p.some((item) => equalityCheck(item, c))) {
			p.push(c)
		}
		return p
	}, [])
}

export function forEachDuplicate(arr, callback, equalityCheck = (a, b) => a === b) {
	const unique = []
	for (let index in arr) {
		const item = arr[index]
		if (unique.some((uniqueItem) => equalityCheck(uniqueItem, item))) {
			callback(item, +index, arr)
		}
		unique.push(item)
	}
}

export function getWithMatchesRemoved(arr, match = (item, index) => item === null || item === undefined) {
	return arr.filter((item, index) => !match(item, index))
}

export function forEachInReverse(arr, callback) {
	for (let i = arr.length - 1; i >= 0; i--) {
		callback(arr[i], i)
	}
}

export function forEachChunk(arr, chunkSize, callback) {
	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize)
		callback(chunk, i, i + chunk.length - 1)
	}
}

export function forEachChunkReversed(arr, chunkSize, callback) {
	for (let i = arr.length - 1; i >= 0; i -= chunkSize) {
		const chunk = arr.slice(Math.max(0, i - chunkSize + 1), i + 1)
		callback(chunk, i - chunk.length + 1, i)
	}
}

export function forEachSlide(arr, slideSize, callback) {
	for (let i = 0; i < arr.length - slideSize + 1; i++) {
		const slide = arr.slice(i, i + slideSize)
		callback(slide, i, i + slide.length - 1)
	}
}

export function forEachSlideReversed(arr, slideSize, callback) {
	for (let i = arr.length - 1; i >= slideSize - 1; i--) {
		const slide = arr.slice(i - slideSize + 1, i + 1)
		callback(slide, i - slide.length + 1, i)
	}
}

export function transpose(arr, transposeArr, startIndex = 0, transposeOverUndefinedItems = true) {
	for (let index in transposeArr) {
		if (arr[+index + startIndex] !== undefined || transposeOverUndefinedItems) {
			arr[+index + startIndex] = transposeArr[index]
		}
	}
	return arr
}

export function resize(arr, length, fill = (index) => undefined) {
	const oldLength = arr.length
	arr.length = length
	for (let index = oldLength; index < length; index++) {
		arr[index] = fill(index)
	}
	return arr
}

export function sequentialReplace(arr, replacementItems, itemsToReplace = (item, index) => item === null || item === undefined) {
	return arr.map((ele) => itemsToReplace(ele) ? replacementItems.shift() : ele)
}

export function transposeMatchingSequentially(arr, replacementItems, matcher = (item, index) => item === null || item === undefined) {
	return arr.map((ele) => matcher(ele) ? replacementItems.shift() : ele).concat(replacementItems)
}
