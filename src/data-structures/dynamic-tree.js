import * as DynamicList from './dynamic-list.js'


let node = {
	getRoot: () => {},
	getItem: () => {},
	getParent: () => {},
	getDepth: () => {},
	children: {
		getFirst: () => {},
		getLast: () => {},
		getNumberChildren: () => {},
		eachChild: (nodeCallback, limit = -1, start = 0) => {},
		getChildAtIndex: (index) => {},
		getIndexOfChild: (child) => {},
		isChild: (child) => {},
	},
	siblings: {
		getIndex: () => {},
		getFirst: () => {},
		getNumberSiblings: () => {},
		getLast: () => {},
		getPrevious: () => {},
		getNext: () => {},
		isSibling: (sibling) => {},
	},
}

class DynamicTree {
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