import * as typeUtils from '../type-utils.js'
import * as FuncUtils from './function-utils.js'

typeUtils.isObj({})

export default class {
	constructor(value) {
		this.value = value
	}
}

function Validate(value) {
	return this
}

let test = {
	val: 0.5,
	val2: 10
}

FuncUtils.addMethod(Validate, 'meetsJSONTemplate', function (template) {
})

Validate(test).meetsJSONTemplate({
	val: {

	},
	val2: {
		
	}
})