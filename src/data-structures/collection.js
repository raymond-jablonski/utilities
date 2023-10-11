export default class Collection { // Might replace DynamicList
	constructor(iterable) {
		this._items = []
		if (iterable) {
			this.addAll(iterable)
		}
	}
	get items() {
		return this._items
	}
	get size() {
		return this._items.length
	}
	get isEmpty() {
		return this._items.length === 0
	}
	contains(item) {
		return this._items.includes(item)
	}
	add(item) {
		this._items.push(item)
		return this
	}
	addAll(iterable) {
		for (let item of iterable) {
			this.add(item)
		}
		return this
	}
	remove(item) {
		const index = this._items.indexOf(item)
		if (index !== -1) {
			this._items.splice(index, 1)
		}
		return this
	}
	clear() {
		this._items = []
	}
	toArray() {
		return this._items.slice()
	}
	toString() {
		return this._items.toString()
	}
	[Symbol.iterator]() {
		return this._items[Symbol.iterator]()
	}
	map(callback) {
		this._items.map(callback)
		return this
	}
	filter(callback) {
		this._items.filter(callback)
		return this
	}
	reduce(callback, initialValue) {
		return this._items.reduce(callback, initialValue)
	}
	every(callback) {
		return this._items.every(callback)
	}
	some(callback) {
		return this._items.some(callback)
	}
	any(callback) {
		return this.some(callback)
	}
	all(callback) {
		return this.every(callback)
	}
	none(callback) {
		return !this.some(callback)
	}
	each(callback) {
		this._items.forEach(callback)
		return this
	}
}