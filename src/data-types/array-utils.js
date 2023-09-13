export function getLength(arr) {
	return arr.length;
}

export function getSize(arr) {
	return arr.length;
}

export function eachIndex(arr, callback) {
	for (let i = 0, len = arr.length; i < len; i++) {
		callback(i)
	}
	return arr;
}

export function eachValue(arr, callback) {
	for (let val of arr) {
		callback(val);
	}
	return arr;
}

export function eachIndexValue(arr, callback) {
	arr.forEach(function (value, index) {
		callback({ index, value });
	});
}

export function addItemToBeginning(arr, item) {
	arr.unshift(item);
	return arr;
}

export function addItemToEnd(arr, item) {
	arr.push(item);
	return arr;
}

export function removeLastItem(arr) {
	arr.pop();
	return arr;
}

export function getFirstItem(arr) {
	return arr[0];
}

export function transformEach(arr, transform) {
	return arr.map(function (item, index) {
		return transform({item, index, arr: array})
	});
}

export function sort(arr, sorter) {
	return arr.sort(sorter);
}

export function reverse(arr) {
	return arr.reverse();
}

export function merge(...arrs) {
	return [...arrs];
}

export function flatten(...arrs) {
	let ans = [...arrs];
	let i = 0;
	while (i < ans.length) {
		if (Array.isArray(ans[i])) {
			ans.splice(i, 1, ...ans[i])
		} else {
			i++
		}
	}
	return ans;
}

export function hasValue(arr, val) {
	return arr.includes(val)
}

export function firstIndexOfValue(arr, val) {
	return arr.indexOf(val)
}

export function lastIndexOfValue(arr, val) {
	return arr.lastIndexOf(val)
}

export function allIndexesOfValue(arr, val) {
	let ans = []
	for (let i = 0, len = arr.length; i < len; i++) {
		if (arr[i] === val) {
			ans.push(i);
		}
	}
	return ans
}

export function firstMatchingIndex(arr, valFunction) {
	return arr.findIndex(function (val) {
		return valFunction(val)
	});
}

export function lastMatchingIndex(arr, valFunction) {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (valFunction(arr[i])) {
			return i
		}
	}
	return -1
}

export function allMatchingIndexes(arr, matchFunction) {
	let ans = []
	for (let i = 0, len = arr.length; i < len; i++) {
		if (matchFunction(arr[i])) {
			ans.push(i);
		}
	}
	return ans
}

export function firstMatchingValue(arr, matchFunction) {
	return arr.find(function (val) {
		return matchFunction(val)
	});
}

export function lastMatchingValue(arr, matchFunction) {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (matchFunction(arr[i])) {
			return arr[i]
		}
	}
	return -1
}

export function allMatchingValues(arr, matchFunction) {
	return arr.filter(function (val) {
		return matchFunction(val)
	});
}

export function getLastItem(arr) {
	return arr[arr.length - 1];
}

export function removeFirstInstanceOfItem(arr, item) {
	arr.shift(item);
	return arr;
}

export function trim(arr, length) {
	arr.splice(length)
	return arr;
}

export function removeElementAt(arr, index) {
	arr.splice(index, 1)
	return arr;
}

export function insertBefore(arr, index, ...elements) {
	arr.splice(index, 0, ...elements)
	return arr;
}

export function insertAfter(arr, index, ...elements) {
	arr.splice(index + 1, 0, ...elements)
	return arr;
}

export function insertAndReplaceAt(arr, index, ...elements) {
	arr.splice(index, 1, ...elements)
	return arr;
}

export function isClean(arr) {
	if (!Array.isArray(arr)) {
		return false
	}
	let count = 0
	for (let key in arr) {
		if (key != count) {
			return false
		}
		count++;
	}
}

export function clean(arr) {
	if (Array.isArray(arr)) {
		let count = 0
		for (let key in arr) {
			if (key != count) {
				arr[count] = arr[key]
				delete arr[key]
			}
			count++;
		}
		arr.splice(count)
	} else if (typeof (arr) === "object") { // won't work
		return Object.values(arr)
	} else {
		arr = [arr]
	}
	return arr
}

export function delimitedStringToArray(arr, delimiter) {
	return arr.split(delimiter);
}

export function clone(arr) {
	return Array.from(arr);
	// return arr.slice();
}

export function compute(arr, startValue, computeFunction) {
	let length = arr.length
	let lastIndex = length - 1
	return arr.reduce(function (previousValue, value, index) {
		computeFunction(previousValue, value, index, lastIndex, length)
	}, startValue)
}

export function sumAll(arr) {
	return (([start, end]) => Array.from({ length: 1 + end - start }, (x, i) => i + start).reduce((p, c) => p + c))(arr.sort((a, b) => a - b))
}

export function chunk(arr, chunkSize) {
	function* cGen(arr, chunkSize) {
		for (let i = 0; i < arr.length; i += chunkSize) {
			yield arr.slice(i, i + chunkSize);
		}
	}
	return [...cGen(arr, chunkSize)]
}

export function chunkAt(arr, chunkCheck) {
	let ans = [],
		lastChunk = 0
	for (let key in arr) {
		if (chunkCheck(arr[key])) {
			ans.push(arr.slice(lastChunk, key))
			lastChunk = key
		}
	}
	ans.push(arr.slice(lastChunk))
	return ans
}

export function forEachAdjacentGroup(arr, groupSize, handler) {
	groupSize = Math.min(groupSize, arr.length)
	let lastIndex = arr.length - groupSize
	for (let i = 0; i <= lastIndex; i++) {
		handler(arr.slice(i, i + groupSize).reduce((p, c, offset) => { p.push({ index: i + offset, item: c }); return p }, []))
	}
}

export function forEachUnorderedGroup(arr, groupSize, handler) {
	function iterate(indices, offset) {
		if (indices.length === groupSize) {
			handler(indices.reduce((p, c) => { p.push({ index: c, item: arr[c] }); return p }, []))
		} else {
			let lastIndex = arr.length - (groupSize - indices.length)
			for (let i = indices.length + offset; i <= lastIndex; i++) {
				iterate([...indices, i], i)
			}
		}
	}
	iterate([], 0)
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