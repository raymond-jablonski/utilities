class Cache {
	#length = undefined
	#indices = new Map()
	#items = new Map()
	constructor() {
	}
	set(index, item) {
		this.#indices.set(index, item)
		this.#items.set(item, index)
	}
	hasItemAtIndex(index) {
		return this.#indices.has(index)
	}
	hasItem(item) {
		return this.#items.has(item)
	}
	getIndexOf(item) {
		if (this.#items.has(item)) {
			return this.#items.get(item)
		}
	}
	getIndexOfItem(index) {
		if (this.#indices.has(index)) {
			return this.#indices.get(index)
		}
	}
	getNumberItems() {
		if (!(this.#length === undefined)) {
			return this.#length
		}
	}
	setNumberItems(length) {
		this.#length = length
	}
	clear() {
		this.#length = undefined
		this.#indices = new WeakMap()
		this.#items = new WeakMap()
	}
}

function cachify(api) {
	const cache = new Cache()
	return {
		getItemAtIndex: async (index) => {
			if (cache.hasItemAtIndex(index)) {
				return cache.getIndexOfItem(index)
			}
			const item = await api.getItemAtIndex(index)
			cache.set(index, item)
			return item
		},
		getNumberItems: async () => {
			if (cache.getNumberItems() !== undefined) {
				return cache.getNumberItems()
			}
			const length = await api.getNumberItems()
			cache.setNumberItems(length)
			return length
		},
		getRoot: async () => {
			if (cache.hasItemAtIndex(0)) {
				return cache.getIndexOfItem(0)
			}
			const root = await api.getRoot()
			cache.set(0, root)
			return root
		},
		getLastItem: async () => {
			const length = await this.getNumberItems()
			if (cache.hasItemAtIndex(length - 1)) {
				return cache.getIndexOfItem(length - 1)
			}
			const lastItem = await api.getLastItem()
			cache.set(length - 1, lastItem)
			return lastItem
		},
		getIndexOf: async (item) => {
			if (cache.hasItem(item)) {
				return cache.getIndexOf(item)
			}
			const index = await api.getIndexOf(item)
			cache.set(index, item)
			return index
		},
		getPreviousItem: async (item) => {
			const index = await this.indexOf(item)
			if (cache.hasItemAtIndex(index - 1)) {
				return cache.getIndexOf(index - 1)
			}
			const previousItem = await api.getPreviousItem(item)
			cache.set(index - 1, previousItem)
			return previousItem
		},
		getNextItem: async (item) => {
			const index = await this.indexOf(item)
			if (cache.hasItemAtIndex(index + 1)) {
				return cache.getIndexOf(index + 1)
			}
			const nextItem = await api.getNextItem(item)
			cache.set(index + 1, nextItem)
			return nextItem
		},
	}
}

function emulate(api, equalityCheck = async (a, b) => a === b) {
	let validAPI = api.getRoot && api.getNextItem || api.getLastItem && api.getPreviousItem || api.getItemAtIndex && api.getIndexOf
	if (!validAPI) {
		throw new Error('Invalid API')
	}
	let emulatedMethods = {}

	if (api.getItemAtIndex) {
		emulatedMethods.getItemAtIndex = api.getItemAtIndex
	} else if (api.getRoot && api.getNextItem) {
		emulatedMethods.getItemAtIndex = async (index) => {
			let currentItem = await emulatedMethods.getRoot()
			for (let i = 0; i < index; i++) {
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem
		}
	} else if (api.getLastItem && api.getPreviousItem) {
		emulatedMethods.getItemAtIndex = async (index) => {
			let currentItem = await emulatedMethods.getLastItem()
			let lastIndex = await emulatedMethods.getIndexOf(currentItem)
			for (let i = 0; i < index; i++) {
				currentItem = await emulatedMethods.getPreviousItem(currentItem)
			}
			return currentItem
		}
	}
	if (api.getNumberItems) {
		emulatedMethods.getNumberItems = api.getNumberItems
	} else if (api.getItemAtIndex || api.getRoot && api.getNextItem) {
		emulatedMethods.getNumberItems = async () => {
			let currentItem = await emulatedMethods.getRoot()
			let currentIndex = 0
			while (currentItem !== undefined) {
				currentIndex++
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentIndex
		}
	} else if (api.getLastItem && api.getPreviousItem) {
		emulatedMethods.getNumberItems = async () => {
			let currentItem = await emulatedMethods.getLastItem()
			let currentIndex = 0
			while (await emulatedMethods.getPreviousItem(currentItem)) {
				currentIndex++
				currentItem = await emulatedMethods.getPreviousItem(currentItem)
			}
			return currentIndex
		}
	}
	if (api.getRoot) {
		emulatedMethods.getRoot = api.getRoot
	} else if (api.getRoot && api.getNextItem) {
		emulatedMethods.getRoot = async () => {
			let currentItem = await emulatedMethods.getRoot()
			while (await emulatedMethods.getPreviousItem(currentItem)) {
				currentItem = await emulatedMethods.getPreviousItem(currentItem)
			}
			return currentItem
		}
	} else if (api.getLastItem && api.getPreviousItem) {
		emulatedMethods.getRoot = async () => {
			let currentItem = await emulatedMethods.getLastItem()
			while (await emulatedMethods.getNextItem(currentItem)) {
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem
		}
	}
	if (api.getNextItem) {
		emulatedMethods.getNextItem = api.getNextItem
	} else if (api.getItemAtIndex && api.getIndexOf) {
		emulatedMethods.getNextItem = async (item) => {
			const index = await emulatedMethods.getIndexOf(item)
			return await emulatedMethods.getItemAtIndex(index + 1)
		}
	} else if (api.getLastItem && api.getPreviousItem) {
		emulatedMethods.getNextItem = async (item) => {
			let currentItem = await emulatedMethods.getLastItem()
			while (await emulatedMethods.getNextItem(currentItem)) {
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem
		}
	}
	if (api.getPreviousItem) {
		emulatedMethods.getPreviousItem = api.getPreviousItem
	} else if (api.getItemAtIndex && api.getIndexOf) {
		emulatedMethods.getPreviousItem = async (item) => {
			const index = await emulatedMethods.getIndexOf(item)
			return await emulatedMethods.getItemAtIndex(index - 1)
		}
	} else if (api.getRoot && api.getNextItem) {
		emulatedMethods.getPreviousItem = async (item) => {
			let currentItem = await emulatedMethods.getRoot()
			while (await emulatedMethods.getNextItem(currentItem)) {
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem
		}
	} else if (api.getLastItem && api.getPreviousItem) {
		emulatedMethods.getPreviousItem = async (item) => {
			let currentItem = await emulatedMethods.getLastItem()
			while (await emulatedMethods.getNextItem(currentItem)) {
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem
		}
	}
	if (api.getIndexOf) {
		emulatedMethods.getIndexOf = api.getIndexOf
	} else if (api.getItemAtIndex && api.getNextItem) {
		emulatedMethods.getIndexOf = async (item) => {
			let currentItem = await emulatedMethods.getRoot()
			let currentIndex = 0
			while (!equalityCheck(currentItem, item) && currentItem !== undefined) {
				currentIndex++
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem === undefined ? undefined : currentIndex
		}
	} else if (api.getLastItem && api.getPreviousItem) {
		emulatedMethods.getIndexOf = async (item) => {
			let currentItem = await emulatedMethods.getLastItem()
			let currentIndex = await emulatedMethods.getNumberItems() - 1
			while (!equalityCheck(currentItem, item) && currentIndex >= 0) {
				currentIndex--
				currentItem = await emulatedMethods.getPreviousItem(currentItem)
			}
			return currentIndex >= 0 ? currentIndex : undefined
		}
	} else if (api.getRoot && api.getNextItem) {
		emulatedMethods.getIndexOf = async (item) => {
			let currentItem = await emulatedMethods.getRoot()
			let currentIndex = 0
			while (!equalityCheck(currentItem, item) && currentItem !== undefined) {
				currentIndex++
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem === undefined ? undefined : currentIndex
		}
	}
	if (api.getLastItem) {
		emulatedMethods.getLastItem = api.getLastItem
	} else if (api.getRoot && api.getNextItem) {
		emulatedMethods.getLastItem = async () => {
			let currentItem = await emulatedMethods.getRoot()
			while (await emulatedMethods.getNextItem(currentItem)) {
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem
		}
	} else if (api.getItemAtIndex && api.getIndexOf) {
		emulatedMethods.getLastItem = async () => {
			const length = await emulatedMethods.getNumberItems()
			return await emulatedMethods.getItemAtIndex(length - 1)
		}
	} else if (api.getPreviousItem && api.getNextItem) {
		emulatedMethods.getLastItem = async () => {
			let currentItem = await emulatedMethods.getRoot()
			while (await emulatedMethods.getNextItem(currentItem)) {
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem
		}
	} else if (api.getItemAtIndex && api.getNextItem) {
		emulatedMethods.getLastItem = async () => {
			let currentItem = await emulatedMethods.getRoot()
			while (await emulatedMethods.getNextItem(currentItem)) {
				currentItem = await emulatedMethods.getNextItem(currentItem)
			}
			return currentItem
		}
	}
	return emulatedMethods
}

class DynamicList {
	#valid = false
	#emulatedMethods
	#config
	constructor(api, config) {
		const DefaultConfig = { useCache: true, uniqueItems: false, equalityCheck: async (a, b) => a === b }
		this.#config = Object.assign(DefaultConfig, config)
		this.#emulatedMethods = cachify(emulate(api, this.#config.equalityCheck))
	}
	async getRoot() {
		return this.#emulatedMethods.getRoot()
	}
	async getItemAtIndex(index) {
		return this.#emulatedMethods.getItemAtIndex(index)
	}
	async getNumberItems() {
		return this.#emulatedMethods.getNumberItems()
	}
	async getLastItem() {
		return this.#emulatedMethods.getLastItem()
	}
	async getIndexOf(item) {
		return this.#emulatedMethods.getIndexOf(item)
	}
	async getPreviousItem(item) {
		return this.#emulatedMethods.getPreviousItem(item)
	}
	async getNextItem(item) {
		return this.#emulatedMethods.getNextItem(item)
	}
}


let testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let testAPI = {
	getRoot: () => testArr[0],
	getNextItem: (item) => testArr[testArr.indexOf(item) + 1]
}

let testDynamicList = new DynamicList(testAPI)

testDynamicList.getLastItem()
testDynamicList.getItemAtIndex(0)

