class Cache {
	#length = undefined
	#indices = new WeakMap()
	#items = new WeakMap()
	constructor() {
	}
	set(index, item) {
		this.#indices.set(index, item)
		this.#items.set(item, index)
	}
	hasIndex(index) {
		return this.#indices.has(index)
	}
	hasItem(item) {
		return this.#items.has(item)
	}
	getIndex(item) {
		if (this.#items.has(item)) {
			return this.#items.get(item)
		}
	}
	getItem(index) {
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

export class DynamicList {
	#valid = false
	#emulatedMethods = {
		//getRoot: async () => undefined,
		//getItemAtIndex: async (index) => undefined,
		//getNextItem: async (item) => undefined,
		/*getIndexOf: async (item) => undefined,
		getLastItem: async () => undefined,
		getPreviousItem: async (item) => undefined,
		getNumberItems: async () => undefined*/
	}
	#config = {}
	constructor(api, config) {
		const DefaultConfig = { useCache: true, uniqueItems: false, itemsAreEqual: (a, b) => a === b }
		this.#config = Object.assign(DefaultConfig, config)
		// The API is valid if:
		// 1. It has a getRoot function and getNextItem function
		// 2. It has a getItemAtIndex function
		// 3. It has a getLastItem function and getPreviousItem function

		// If the API is valid, then you can get any item by index
		// If the API is valid, then you can get the index of any item
		// The other functions are optional, but if they are present, they will be used
		// If the API is valid, but the optional functions are not present, then they will be emulated


		let test = {
			getItemAtIndex: () => {},
			getNumberItems: () => {},
			getRoot: () => {},
			getLastItem: () => {},
			getNextItem: () => {},
			getIndexOf: () => {},
			getPreviousItem: () => {},
		}

		function cachify(api) {
			const cache = new Cache()
			return {
				getItemAtIndex: async (index) => {
					if (cache.hasIndex(index)) {
						return cache.getItem(index)
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
					if (cache.hasIndex(0)) {
						return cache.getIndex(0)
					}
					const root = await api.getRoot()
					cache.set(0, root)
					return root
				},
				getLastItem: async () => {
					const length = await this.getNumberItems()
					if (cache.hasIndex(length - 1)) {
						return cache.getIndex(length - 1)
					}
					const lastItem = await api.getLastItem()
					cache.set(length - 1, lastItem)
					return lastItem
				},
				getIndexOf: async (item) => {
					if (cache.hasItem(item)) {
						return cache.getIndex(item)
					}
					const index = await api.getIndexOf(item)
					cache.set(index, item)
					return index
				},
				getPreviousItem: async (item) => {
					const index = await this.indexOf(item)
					if (cache.hasIndex(index - 1)) {
						return cache.getIndex(index - 1)
					}
					const previousItem = await api.getPreviousItem(item)
					cache.set(index - 1, previousItem)
					return previousItem
				},
				getNextItem: async (item) => {
					const index = await this.indexOf(item)
					if (cache.hasIndex(index + 1)) {
						return cache.getIndex(index + 1)
					}
					const nextItem = await api.getNextItem(item)
					cache.set(index + 1, nextItem)
					return nextItem
				},
			}
			/*
		if (api.getItemAtIndex) {
			this.#valid = true
			this.#emulatedMethods = this.#config.useCache ? {
				getItemAtIndex: async (index) => {
					if (this.#cache.indices.has(index)) {
						return this.#cache.indices.get(index)
					}
					const item = await api.getItemAtIndex(index)
					cache(index, item)
					return item
				},
				getRoot: async () => {
					if (api.getRoot) {
						return await api.getRoot()
					} else {
						return await this.#emulatedMethods.getItemAtIndex(0)
					}
				},
				indexOf: async (item) => {
					if (api.indexOf) {
						const index = await api.indexOf(item)
						if (this.#config.useCache) {
							this.#cache.indices.set(index, item)
						}
						return index
					} else {
						if (this.#config.useCache && this.#cache.items.has(item)) {
							return this.#cache.items.get(item)
						}
						let currentItem = await this.#emulatedMethods.getRoot()
						let currentIndex = 0
						while (!this.#config.itemsAreEqual(currentItem, item)) {
							this.#cache.items.set(currentItem, currentIndex)
							currentIndex++
							currentItem = await this.#emulatedMethods.getItemAtIndex(currentIndex)
						}
						this.#cache.items.set(item, currentIndex)
						return currentIndex
					},
				}
			} : {

			}
		}
		this.#emulatedMethods = Object.assign(this.#emulatedMethods, api)
		*/
			this.#valid = false
		}

		function emulate(api) {
			let validAPI = api.getRoot && api.getNextItem || api.getLastItem && api.getPreviousItem || api.getItemAtIndex && api.getIndexOf
			if(!validAPI) {
				throw new Error('Invalid API')
			}
			let emulatedMethods = {}

			if (api.getItemAtIndex) {
				emulatedMethods.getItemAtIndex = api.getItemAtIndex
			} else if(api.getRoot && api.getNextItem) {
				emulatedMethods.getItemAtIndex = async (index) => {
					let currentItem = await emulatedMethods.getRoot()
					for (let i = 0; i < index; i++) {
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentItem
				}
			} else if(api.getLastItem && api.getPreviousItem) {
				emulatedMethods.getItemAtIndex = async (index) => {
					let currentItem = await emulatedMethods.getLastItem()
					for (let i = 0; i < index; i++) {
						currentItem = await emulatedMethods.getPreviousItem(currentItem)
					}
					return currentItem
				}
			}
			if(api.getNumberItems) {
				emulatedMethods.getNumberItems = api.getNumberItems
			} else if(api.getItemAtIndex) {
				emulatedMethods.getNumberItems = async () => {
					let currentItem = await emulatedMethods.getRoot()
					let currentIndex = 0
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentIndex++
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentIndex
				}
			} else if(api.getRoot && api.getNextItem) {
				emulatedMethods.getNumberItems = async () => {
					let currentItem = await emulatedMethods.getRoot()
					let currentIndex = 0
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentIndex++
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentIndex
				}
			} else if(api.getLastItem && api.getPreviousItem) {
				emulatedMethods.getNumberItems = async () => {
					let currentItem = await emulatedMethods.getLastItem()
					let currentIndex = 0
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentIndex++
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentIndex
				}
			}
			if(api.getRoot) {
				emulatedMethods.getRoot = api.getRoot
			} else if(api.getRoot && api.getNextItem) {
				emulatedMethods.getRoot = async () => {
					let currentItem = await emulatedMethods.getRoot()
					while (await emulatedMethods.getPreviousItem(currentItem)) {
						currentItem = await emulatedMethods.getPreviousItem(currentItem)
					}
					return currentItem
				}
			} else if(api.getLastItem && api.getPreviousItem) {
				emulatedMethods.getRoot = async () => {
					let currentItem = await emulatedMethods.getLastItem()
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentItem
				}
			}
			if(api.getNextItem) {
				emulatedMethods.getNextItem = api.getNextItem
			} else if(api.getItemAtIndex && api.getIndexOf) {
				emulatedMethods.getNextItem = async (item) => {
					const index = await emulatedMethods.getIndexOf(item)
					return await emulatedMethods.getItemAtIndex(index + 1)
				}
			} else if(api.getLastItem && api.getPreviousItem) {
				emulatedMethods.getNextItem = async (item) => {
					let currentItem = await emulatedMethods.getLastItem()
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentItem
				}
			}
			if(api.getPreviousItem) {
				emulatedMethods.getPreviousItem = api.getPreviousItem
			} else if(api.getItemAtIndex && api.getIndexOf) {
				emulatedMethods.getPreviousItem = async (item) => {
					const index = await emulatedMethods.getIndexOf(item)
					return await emulatedMethods.getItemAtIndex(index - 1)
				}
			} else if(api.getRoot && api.getNextItem) {
				emulatedMethods.getPreviousItem = async (item) => {
					let currentItem = await emulatedMethods.getRoot()
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentItem
				}
			} else if(api.getLastItem && api.getPreviousItem) {
				emulatedMethods.getPreviousItem = async (item) => {
					let currentItem = await emulatedMethods.getLastItem()
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentItem
				}
			}
			if(api.getIndexOf) {
				emulatedMethods.getIndexOf = api.getIndexOf
			} else if(api.getItemAtIndex && api.getNextItem) {
				emulatedMethods.getIndexOf = async (item) => {
					let currentItem = await emulatedMethods.getRoot()
					let currentIndex = 0
					while (!this.#config.itemsAreEqual(currentItem, item)) {
						currentIndex++
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentIndex
				}
			} else if(api.getLastItem && api.getPreviousItem) {
				emulatedMethods.getIndexOf = async (item) => {
					let currentItem = await emulatedMethods.getLastItem()
					let currentIndex = 0
					while (!this.#config.itemsAreEqual(currentItem, item)) {
						currentIndex++
						currentItem = await emulatedMethods.getPreviousItem(currentItem)
					}
					return currentIndex
				}
			} else if(api.getRoot && api.getNextItem) {
				emulatedMethods.getIndexOf = async (item) => {
					let currentItem = await emulatedMethods.getRoot()
					let currentIndex = 0
					while (!this.#config.itemsAreEqual(currentItem, item)) {
						currentIndex++
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentIndex
				}
			}
			if(api.getLastItem) {
				emulatedMethods.getLastItem = api.getLastItem
			} else if(api.getRoot && api.getNextItem) {
				emulatedMethods.getLastItem = async () => {
					let currentItem = await emulatedMethods.getRoot()
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentItem
				}
			} else if(api.getItemAtIndex && api.getIndexOf) {
				emulatedMethods.getLastItem = async () => {
					const length = await emulatedMethods.getNumberItems()
					return await emulatedMethods.getItemAtIndex(length - 1)
				}
			} else if(api.getPreviousItem && api.getNextItem) {
				emulatedMethods.getLastItem = async () => {
					let currentItem = await emulatedMethods.getRoot()
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentItem
				}
			} else if(api.getItemAtIndex && api.getNextItem) {
				emulatedMethods.getLastItem = async () => {
					let currentItem = await emulatedMethods.getRoot()
					while (await emulatedMethods.getNextItem(currentItem)) {
						currentItem = await emulatedMethods.getNextItem(currentItem)
					}
					return currentItem
				}
			}

		}
	}
}

let testAPI = {
	getRoot: () => testArr[0],
	getNextItem: (item) => testArr[testArr.indexOf(item) + 1]

}

