export function isObj(val, config = { includeNull: false, includeFunctions: false }) {
	if (val === null && config.includeNull) {
		return true
	}
	const type = typeof val;
	if(type === 'function' && config.includeFunctions) {
		return true
	}
	return type === 'object'
}

export function toObject(val, nullToEmpty = false) {
    switch (typeof val) {
        case "number":
            return Number(val)

        case "string":
            return String(val)

        case "boolean":
            return Boolean(val)

        case "object":
			if(val === null) {
				return nullToEmpty ? {} : val
			}
			return val

        case "undefined":
            return nullToEmpty ? {} : null

        case "bigInt":
            return BigInt(val)
			
        //case "function": // already an object
        //case "symbol": // already an object
        default:
            return val
    }
}