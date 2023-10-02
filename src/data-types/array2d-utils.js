import * as arrayUtils from './array-utils.js';

export function createMatrix(rows = 1, columns = 1, eachValue = (rowIndex, columnIndex) => undefined) {
	return Array(rows).fill().map((_, rowIndex) => Array(columns).fill().map((_, columnIndex) => eachValue(rowIndex, columnIndex)))
}

export function forEachRow(arr, callback) {
	for (let rowIndex in arr) {
		callback(arr[rowIndex], +rowIndex)
	}
}

export function forEachColumn(arr, callback) {
	const maxLen = arr.reduce((max, row) => Math.max(max, row.length), 0)
	for (let columnIndex = 0; columnIndex < maxLen; columnIndex++) {
		callback(arr.map(row => row[columnIndex]), columnIndex)
	}
}

export function toMatrix(arr, fill = (rowIndex, columnIndex) => undefined) {
	const maxLen = arr.reduce((max, row) => Math.max(max, row.length), 0)
	return arr.map((row, rowIndex) => [...row, ...Array(maxLen - row.length).fill(fill(rowIndex, maxLen))])
}

export function resize(arr, { width, height }, fill = (rowIndex, columnIndex) => undefined) {
	return Array.from({ length: height }, (_, rowIndex) =>
		Array.from({ length: width }, (_, columnIndex) =>
			(arr[rowIndex] && arr[rowIndex][columnIndex]) || fill(rowIndex, columnIndex)
		)
	)
}

export function getSlice(arr, { rowIndex, columnIndex, width, height }) {
	return arr.slice(rowIndex, rowIndex + height).map(row => row.slice(columnIndex, columnIndex + width))
}

// returns a new array with the transpose array overriding the values of the original array starting at the specified row and column.
// If transposeOverUndefined is false, then undefined values in the original array are transposed, and the original array is expanded if needed
// transpose([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [['a', 'b'], ['a1', 'b1']], 3, 3, true) returns [[1, 2, 3, undefined, undefined], [4, 5, 6, undefined, undefined], [7, 8, 9, undefined, undefined], [undefined, undefined, undefined, 'a', 'b'], [undefined, undefined, undefined, 'a1', 'b1']]
export function transpose(arr, arrToTranspose, rowIndex = 0, columnIndex = 0, transposeOverUndefined = true) {
	const numRows = transposeOverUndefined ? Math.max(arr.length, rowIndex + arrToTranspose.length) : arr.length
	return arrayUtils.resize(arr, numRows, () => []).map((row, currRowIndex) => arrayUtils.transpose(row, arrToTranspose[currRowIndex - rowIndex] || [], columnIndex, transposeOverUndefined))
}
