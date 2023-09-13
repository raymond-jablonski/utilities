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