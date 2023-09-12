export function definePrimitiveConversion(obj, conversions) {
	const DefaultConversions = {
		string: obj => JSON.stringify(obj),
		number: obj => +obj,
		default: obj => JSON.stringify(obj)
	}
	conversions = { ...conversions, DefaultConversions }
	obj[Symbol.toPrimitive] = function (hint) {
		switch (hint) {
			case 'string':
				return conversions.string(this)
			case 'number':
				return conversions.number(this)
			default:
				return conversions.default(this)
		}
	}
	return obj
}

function isObj(value) {
	return typeof (value) === "object"
}

export function eachKeyValue(obj, callback, deep = false) {
	for (let key in obj) {
		const value = obj[key]
		callback({ key, value }, obj)
		if (deep && isObj(value)) {
			eachKeyValue(value, callback, true)
		}
	}
}

export function eachKey(obj, callback, deep = false) {
	if (deep) {
		eachKeyValue(obj, ({ key, }) => {
			callback(key, obj)
		}, true)
	} else {
		for (let key in obj) {
			callback(key, obj)
		}
	}
}

export function eachValue(obj, callback, deep = false) {
	for (let value of obj) {
		callback(value, obj)
		if (deep && isObj(value)) {
			eachValue(value, callback, true)
		}
	}
}

export function allKeys(obj) {
	return Object.keys(obj)
}

export function allValues(obj) {
	return Object.values(obj)
}

export function allKeysAndValues(obj) {
	return Object.entries(obj).map(([key, value]) => ({ key, value }))
}

export function containsKey(obj, key) {
	return key in obj
}

export function clone(obj, shallow = true) {
	if (shallow) {
		return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
	}
	deepEachKeyValue(obj, callback)
	if ({ ...obj }) {
		obj = { ...obj }
		for (let key in obj) {
			if (isObj(obj[key])) {
				obj[key] = cloneDeep(obj[key])
			}
		}
	}
	return obj
}

export function isEmpty(obj) {
	return obj && allKeys(obj).length === 0 && obj.constructor === Object
}

export function merge(obj, ...objs) {
	Object.assign({}, obj, ...objs)
	return obj
}

export function toArray(obj) {
	let arrayUnlikeProps,
		ans = [];

	if (isObj(obj)) {
		let entries = Object.entries(obj)
		for (let [key, val] of entries) {
			if (Number.isInteger(+key)) {
				ans.push(val)
			} else {
				arrayUnlikeProps.push({
					key: key,
					value: val
				});
			}
		}
	}
	return ans.concat(arrayUnlikeProps);
}

export function createChildOf(baseObj) {
	return Object.create(baseObj);
}

export function getParentObject(obj) {
	return Object.getPrototypeOf(obj);
}

export function changeParentOf(obj, parent) {
	return Object.setPrototypeOf(obj, parent)
}

export function insertAsParentOf(obj, parent) {
	Object.setPrototypeOf(parent, Object.getPrototypeOf(obj))
	Object.setPrototypeOf(obj, parent)
}

export function extend(obj, ...interfaces) {
	for (let currInterface of interfaces) {
		Object.setPrototypeOf(currInterface, Object.getPrototypeOf(obj))
		Object.setPrototypeOf(obj, currInterface)
	}
}

export function applyComponent(obj, componentObj) {
	if (typeof (obj) === 'function') {
		Object.assign(obj.prototype, componentObj)
	} else {
		insertAsParentOf(obj, componentObj)
	}
}

export function isAClass(obj) {
	return typeof (obj) === 'function' && Object.getPrototypeOf(obj)?.constructor === Function
}

export function wasConstructedFromClass(obj, classRef) {
	return obj instanceof classRef
}

export function lockObject(obj) {
	Object.preventExtensions(obj)
	Object.freeze(obj)
}

export function makePropertyReadOnly(obj, propName) {
	Object.defineProperty(obj, propName, { writable: false })
}

export function makePropertyNonEnumerable(obj, propName) {
	Object.defineProperty(obj, propName, { enumerable: false })
}

export function preventPropertyFromDeletion(obj, propName) {
	Object.defineProperty(obj, propName, { configurable: false })
}

export function moveProperty(propName, sourceObj, targetObj) {
	targetObj[propName] = sourceObj[propName];
	delete sourceObj[propName];
}

export function createSubscribeableReadOnlyRef(obj) {
	function NOPE() {
		throw new Error("Can't modify read-only view");
	}

	const handler = {
		set: NOPE,
		defineProperty: NOPE,
		deleteProperty: NOPE,
		preventExtensions: NOPE,
		setPrototypeOf: NOPE
	};
	return new Proxy(obj, handler);
}

export function getSubscribableObject(obj, handler) {
	let validator = {
		set: function (target, key, currentValue) {
			const previousValue = target[key]
			target[key] = currentValue
			handler({
				modifiedObject: target,
				key,
				previousValue,
				currentValue,
			})
			return true
		},
	}
	return new Proxy(obj, validator)
}

let myObject = { name: 'John', age: 30 };

function handleChange({ modifiedObject, key, previousValue, currentValue }) {
	console.log(`Property '${key}' changed from '${previousValue}' to '${currentValue}'`);
}

myObject = getSubscribableObject(myObject, handleChange)

myObject.name = 'Alice'; // This will trigger the handleChange function.

export function generateFunctionBoundClass(obj, numberParameters = 1) {
	return class {
		constructor(...params) {
			this.boundParams = params.slice(0, numberParameters)
			eachKeyValue(obj, (key, value) => {
				if (typeof value === 'function') {
					this[key] = (...args) => value(...this.boundParams, ...args)
				} else {
					this[key] = value
				}
			})
		}
	}
}

const OBSERVERS = Symbol('callbacks');

function from(obj) {
	obj[OBSERVERS] = []
	return new Proxy(obj, {
		set: (obj, prop, newValue, receiver) => {
			const previousVal = obj[prop]
			obj[prop] = newValue
			for (let callback of obj[OBSERVERS]) {
				callback(prop, previousVal, newValue)
			}
			return !(previousVal === newValue)
		},
		get(target, prop, receiver) {
			const value = target[prop]//Reflect.get(...arguments);
			return value //typeof value == 'function' ? value.bind(target) : value;
		}
	});
}
function observe(observableReference, callback) {
	observableReference[OBSERVERS].push(callback)
}

function unobserve(observableReference, callback) {
	observableReference[OBSERVERS] = observableReference[OBSERVERS].filter((val) => !(val === callback))
}

export const Observable = {
	from,
	observe,
	unobserve
}