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

export function mapEachRow(arr, callback) {
	return arr.map((row, rowIndex) => callback(row, rowIndex))
}

export function transpose(arr) {
	const maxLen = arr.reduce((max, row) => Math.max(max, row.length), 0)
	return Array.from({ length: maxLen }, (_, columnIndex) => arr.map(row => row[columnIndex]))
}

export function mapEachColumn(arr, callback) {
	return transpose(transpose(arr).map((column, columnIndex) => callback(column, columnIndex)))
}

export function flipHorizontal(arr) {
	return arr.map(row => row.slice().reverse())
}

export function flipVertical(arr) {
	return arr.slice().reverse()
}

export function rotateClockwise90(arr) {
	return transpose(flipVertical(arr))
}

export function rotateCounterClockwise90(arr) {
	return flipHorizontal(transpose(arr))
}

export function rotate180(arr) {
	return flipVertical(flipHorizontal(arr))
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

export function superimpose(baseArr, overlayArr, startRowIndex = 0, startColIndex = 0, expandIfNeeded = true) {
    overlayArr.forEach((row, rowIndex) => {
        const targetRowIndex = startRowIndex + rowIndex
        if (!baseArr[targetRowIndex] && expandIfNeeded) {
            baseArr[targetRowIndex] = []
        }
        if (baseArr[targetRowIndex]) {
            row.forEach((cell, colIndex) => {
                const targetColIndex = startColIndex + colIndex
                
                if (expandIfNeeded || targetColIndex < baseArr[targetRowIndex].length) {
                    baseArr[targetRowIndex][targetColIndex] = cell
                }
            })
        }
    })
    return baseArr
}