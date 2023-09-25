import { Observable } from '../data-types/object-utils.js'
import { max, clamp, modulo } from '../math/math-utils.js'

export class Axis2D {
    #length
    #nextAxis
    #previousAxis
	#looping
	#infinite
	#resizeBehavior 

    constructor(length = 0) {
        this.#length = length
        return Observable.from(this)
    }
    get length() {
        return this.#length
    }
    set length(newLength) {
        this.#length = max(0, newLength)
    }
}


export class Location2D {
    static defaultProps = { loop: true, maintainPercentOnAxisResize: true, axisRescaleInfluence: 0, parent: null }

    #props
    #axis
    #location

    constructor(initialLocation = 0, axis = new Axis2D(), props = Location2D.defaultProps) {
        this.#props = Object.assign(Location2D.defaultProps, props)
        this.#axis = axis
        this.#location = initialLocation
        Observable.observe(this.#axis, (prop, previousVal, newValue) => prop === 'length' ? this.rebase(previousVal, newValue) : null)
    }


    rebase(previousAxisLength, newAxisLength) {
        if(this.#props.maintainPercentOnAxisResize) {
            this.#location = this.#location * newAxisLength / previousAxisLength
            return 
        }
        this.#location = this.#location + this.#props.axisRescaleInfluence * (newAxisLength - previousAxisLength)
        this.location = this.#location
    }

    set location(newLocation) {
        this.#location = this.#props.loop ? modulo(newLocation, this.#axis.length) : clamp(newLocation, 0, this.#axis.length)
        return this.#location
    }

    get location() {
        return this.#location
    }

    set axis(newAxis) {
        this.#axis = newAxis
        this.location = this.#location
        return this.#axis
    }

    get axis() {
        return this.#axis
    }

    distanceFrom(otherLocation) {
			if(otherLocation.axis === this.#axis) {
				return this.#location - otherLocation.location
			}
			return null
    }
		distanceTo(otherLocation) {
			if(otherLocation.axis === this.#axis) {
				return otherLocation.location - this.#location
			}
			return null
    }
}
