export function isFunction(val) {
	return typeof val === 'function';
}

export function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            }
        }
    };
}

export function redefineThis(fn, thisDef) {
    fn = fn.bind(thisDef)
    return fn
}

export function callWithRedefinedThis(fn, thisDef, ...args) {
    return fn.call(thisDef, ...args)
}

export function createAsync(fn) {
    return function (...args) {
        return new Promise(function(resolve, reject) {
            args.push(function(err, ...results) {
                if (err) {
                    reject(err)
                } else {
                    resolve(...results)
                }
            });
            fn.call(this, ...args)
        });
    };
}

export function createDelayFor(fn) {
    fn.delay = function (time) {
        return function (...args) {
            fn.delayID = setTimeout(fn, time, ...args)
        }
    }
    fn.cancelDelay = function () {
        clearTimeout(fn.delayID)
    }
}

export function createRepeaterFor(fn) {
    fn.repeat = function (time) {
        return function (...args) {
            fn.repeatID = setInterval(fn, time, ...args)
        }
    }
    fn.endRepeat = function () {
        clearInterval(fn.repeatID)
    }
}