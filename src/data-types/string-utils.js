function findFirstSequentialInt(str) {
	let ans = parseInt(str)
	while (str && isNaN(ans)) {
		str = str.substring(1)
		ans = parseInt(str)
	}
	return ans
}

function extractInt(str) {
	let ans = parseInt(str)
	while (str && isNaN(ans)) {
		str = str.substring(1)
		ans = parseInt(str)
	}
	return ans
}

function contains(str, substring) {
	return Boolean(~str.indexOf(substring))
}

function reverseWordsInPlace(charArr, delimiter = " ") {
	function reverseArrInPlace(arr, startIndex = 0, endIndex = arr.length - 1) {
		while (endIndex > startIndex) {
			let temp = arr[endIndex]
			arr[endIndex] = arr[startIndex]
			arr[startIndex] = temp
			endIndex--
			startIndex++
		}
	}
	reverseArrInPlace(charArr, 0, charArr.length - 1)
	let i = 0, wordStart = 0
	while (i < charArr.length) {
		if (charArr[i] == delimiter) {
			reverseArrInPlace(charArr, wordStart, i-1)
			wordStart = i + 1
		}
		i++
	}
	reverseArrInPlace(charArr, wordStart, i-1)
}