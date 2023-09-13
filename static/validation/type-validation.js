export function isFunction(val) {
	return typeof val === 'function' 
}

export function isObj(val, { includeNull, includeFunctions } = { includeNull: false, includeFunctions: false }) {
	if (val === null && includeNull) {
		return true
	}
	const type = typeof val;
	if (includeFunctions && isFunction(val)) {
		return true
	}
	return type === 'object'
}

export function isString(val) {
	return typeof val === 'string'
}

export function isNumber(val) {
	return typeof val === 'number'
}

export function isBoolean(val) {
	return typeof val === 'boolean'
}

export function isBigInt(val) {
	return typeof val === 'bigint'
}

export function isSymbol(val) {
	return typeof val === 'symbol'
}

export function isUndefined(val) {
	return typeof val === 'undefined'
}

export function isNull(val) {
	return val === null
}

export function isPrimitive(val, JSONPrimitive = false) {
	if (JSONPrimitive) {
		return isString(val) || isNumber(val) || isBoolean(val) || isNull(val)
	}
	return isString(val) || isNumber(val) || isBoolean(val) || isNull(val) || isUndefined(val) || isSymbol(val) || isBigInt(val)
}

export function isJSON(val) {
	return isObj(val) && !Array.isArray(val)
}

export function isArr(val) {
	return Array.isArray(val)
}

export function isSet(val) {
	return val instanceof Set
}

export function isMap(val) {
	return val instanceof Map
}

export function isDate(val) {
	return val instanceof Date
}

export function isRegExp(val) {
	return val instanceof RegExp
}

export function isPromise(val) {
	return val instanceof Promise
}

export function isIterator(val) {
	return val instanceof Iterator
}

export function isGenerator(val) {
	return val instanceof Generator
}

export function isGeneratorFunction(val) {
	return val instanceof GeneratorFunction
}

export function isAsyncGenerator(val) {
	return val instanceof AsyncGenerator
}

export function isAsyncGeneratorFunction(val) {
	return val instanceof AsyncGeneratorFunction
}

export function isAsyncFunction(val) {
	return val instanceof AsyncFunction
}

export function isAsync(val) {
	return isPromise(val) || isAsyncGenerator(val) || isAsyncGeneratorFunction(val) || isAsyncFunction(val)
}

export function isClass(val) {
	return val instanceof Class
}

export function isClassInstance(val) {
	return val instanceof ClassInstance
}




