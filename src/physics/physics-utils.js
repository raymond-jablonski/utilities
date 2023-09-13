import { exp, ln, sqrt } from '../math/math-utils.js'

export function maxVelocity(acceleration, drag) {
  return acceleration / drag
}
export function velocityAfterTime(acceleration, currentVelocity, drag, time, Vmax = maxVelocity(acceleration, drag)) {
  return Vmax + (currentVelocity - Vmax) * exp(-drag * time)
}
export function displacementAfterTime(acceleration, currentVelocity, drag, time, Vmax = maxVelocity(acceleration, drag)) {
  return Vmax * time - (currentVelocity - Vmax) * exp(-drag * time) / drag + (currentVelocity - Vmax) / drag
}
export function timeToRest(acceleration, currentVelocity, drag) {
  return -ln(acceleration / (acceleration - currentVelocity * drag)) / drag
}
export function distanceAtRest(acceleration, currentVelocity, drag) {
  return displacementAfterTime(acceleration, currentVelocity, drag, timeToRest(acceleration, currentVelocity, drag))
}
export function timeToAccelerateToTarget(displacement, acceleration, currentVelocity, drag, Vmax = maxVelocity(acceleration, drag)) {
  const VID = currentVelocity / Vmax;
  const EVIDDDV = exp(displacement * drag / Vmax - VID);
  const squarePart = sqrt(1 + (VID - 1) / EVIDDDV);
  const logPart = EVIDDDV * (1 + squarePart); //(VID-1)/(squarePart-1) Also works
  const accelerateTimeNeeded = ln(logPart) / drag;

  return accelerateTimeNeeded
}