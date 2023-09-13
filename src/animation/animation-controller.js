import { FiniteAxis2D, Location2D } from './location.js'
export { FiniteAxis2D, Location2D }

import { exp, ln, sqrt, abs, min, max, clamp, modulo } from '../math/math-utils.js'
import { maxVelocity, velocityAfterTime, displacementAfterTime, timeToRest, distanceAtRest, timeToAccelerateToTarget } from '../physics/physics-utils.js'

const LocationSystem = [];

export class LocationController {
	static maxVelocity = maxVelocity
	static velocityAfterTime = velocityAfterTime
	static displacementAfterTime = displacementAfterTime
	static timeToRest = timeToRest
	static distanceAtRest = distanceAtRest
	static timeToAccelerateToTarget = timeToAccelerateToTarget

	static get DEFAULT_DRAG() { return 0.185 }

	#location
	#velocity
	#drag
	#impulses
	#stabilizationAcceleration
	#stabilizedCallback
	#target
	#targetAcceleration
	#targetReachedCallback

	constructor(location, drag = LocationController.DEFAULT_DRAG) {
		this.#location = location
		this.#velocity = 0
		this.#drag = drag
		this.#impulses = new Set()
	}
	get velocity() {
		return this.#velocity
	}
	set drag(newDrag) {
		this.#drag = newDrag > 0 ? newDrag : LocationController.DEFAULT_DRAG
		return this.#drag
	}
	get drag() {
		return this.#drag
	}
	set velocity(newVelocity) {
		this.#velocity = newVelocity
	}
	addImpulse(targetVelocity, time = 0, completionCallback = null) {
		if (time === 0) {
			completionCallback(this)
			return null
		}
		let acceleration = this.#drag * targetVelocity

		let impulse = {
			acceleration,
			time,
			remainingTime: time
		}
		this.#impulses.add(impulse)
		return impulse
	}
	removeImpulse(impulse) {
		return this.#impulses.delete(impulse)
	}
	removeImpulses() {
		return this.#impulses.clear()
	}
	stabilize(acceleration) {
		return this.#stabilizationAcceleration = abs(acceleration)
	}
	setTarget(targetLocation, acceleration, targetReachedCallback) {
		this.#target = targetLocation
		this.#targetAcceleration = abs(acceleration)
		this.#targetReachedCallback = targetReachedCallback
		return this.#target
	}
	removeTarget() {
		this.#target = null
	}
	update(deltaTime) {
		if (this.#target) {
			const displacementToTarget = this.#location.distanceTo(this.#target)
			if (displacementToTarget === 0 && this.#velocity === 0) return
			const targetAcceleration = displacementToTarget >= 0 ? this.#targetAcceleration : -this.#targetAcceleration
			const accelerationTime = timeToAccelerateToTarget(displacementToTarget, targetAcceleration, this.#velocity, this.#drag)
			const postAccelerationVelocity = velocityAfterTime(targetAcceleration, this.#velocity, this.#drag, accelerationTime)
			const decellerationTime = timeToRest(-targetAcceleration, postAccelerationVelocity, this.#drag)

			if (accelerationTime > deltaTime) {
				this.accelerate(targetAcceleration, deltaTime)
			} else {
				if (accelerationTime > 0) {
					this.accelerate(targetAcceleration, accelerationTime)
					deltaTime -= accelerationTime
				}
				const decellerationTime = timeToRest(-targetAcceleration, this.#velocity, this.#drag)
				if (decellerationTime > deltaTime) {
					this.accelerate(-targetAcceleration, deltaTime)
				} else {
					this.#velocity = 0
					this.#location.location = this.#target.location
					this.#targetReachedCallback()
				}
			}
		} else {
			// Handle impulses, decrementing deltaTime as each impulse is finished
			while (this.#impulses.size > 0 && deltaTime > 0) {
				let acceleration = 0
				let shortestImpulseTime = deltaTime
				for (let impulse of this.#impulses) {
					acceleration += impulse.acceleration
					if (impulse.time > 0) {
						shortestImpulseTime = min(shortestImpulseTime, impulse.remainingTime)
					}
				}
				for (let impulse of this.#impulses) {
					if (impulse.time > 0) {
						if (impulse.remainingTime <= shortestImpulseTime) {
							this.#impulses.delete(impulse)
						} else {
							impulse.remainingTime -= shortestImpulseTime
						}
					}
				}
				deltaTime -= shortestImpulseTime
				this.accelerate(acceleration, shortestImpulseTime)
			}
			// No impulses remaining: Use the stabilization acceleration to decellerate to a speed of 0
			if (deltaTime > 0 && this.#velocity !== 0) {
				const stabilizationAcceleration = this.#velocity > 0 ? -this.#stabilizationAcceleration : this.#stabilizationAcceleration
				const timeToRest = timeToRest(stabilizationAcceleration, this.#velocity, this.#drag)
				if (timeToRest < deltaTime) {
					this.#location.location += displacementAfterTime(stabilizationAcceleration, this.#velocity, this.#drag, timeToRest)
					this.#velocity = 0
					this.#stabilizedCallback(deltaTime - timeToRest)
				} else {
					this.accelerate(stabilizationAcceleration, deltaTime)
				}
			}
		}
	}
	accelerate(acceleration, time) {
		const Vmax = maxVelocity(acceleration, this.#drag)
		this.#location.location += displacementAfterTime(acceleration, this.#velocity, this.#drag, time, Vmax)
		this.#velocity = velocityAfterTime(acceleration, this.#velocity, this.#drag, time, Vmax)
	}
}

export function animate(animationCallback, duration = -1, completionCallback, immediateAnimationTime = 0, startTime = performance.now(), animatingFunction = requestAnimationFrame) {
	let previousTime = startTime
	function callAnimation(newTime) {
		const deltaTime = newTime - previousTime
		const elapsedTime = newTime - startTime
		if (duration >= 0 && elapsedTime >= duration) {
			const durationRemaining = duration - (previousTime - startTime)
			animationCallback(durationRemaining, duration)
			if (completionCallback) { completionCallback(deltaTime - durationRemaining) }
			return false
		}
		animationCallback(deltaTime, elapsedTime)
		previousTime = newTime
		return true
	}
	if (callAnimation(immediateAnimationTime)) {
		animatingFunction(function animate(currentTime) {
			if (callAnimation(currentTime + immediateAnimationTime)) {
				animatingFunction(animate);
			}
		});
	}
}