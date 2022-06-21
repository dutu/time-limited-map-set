export class TimeLimitedMap extends Map {
  constructor(maxMs) {
    super()
    this._mts = new Map()
    this.maxMs = maxMs
    Object.getOwnPropertyNames(Object.getPrototypeOf(new Map())).forEach((prop) => {
      if (typeof super[prop] === 'function' && prop !== 'constructor') {
        if (prop === 'set') {
          this[prop] = (...args) => {
            this._cleanup()
            this._mts.set(args[0], Date.now())
            return super[prop](...args)
          }
        } else {
          this[prop] = (...args) => {
            this._cleanup()
            return super[prop](...args)
          }
        }
      }
    })
  }

  get size() {
    this._cleanup()
    return super.size
  }

  _cleanup() {
    const maxAge = Date.now() - this.maxMs
    Array.from(this._mts.entries()).forEach(([key, mts]) => {
      if (mts < maxAge) {
        this._mts.delete(key)
        super.delete(key)
      }
    })
  }
}

export class TimeLimitedSet extends Set {
  constructor(maxMs) {
    super()
    this._mts = new Map()
    this.maxMs = maxMs
    Object.getOwnPropertyNames(Object.getPrototypeOf(new Set())).forEach((prop) => {
      if (typeof super[prop] === 'function' && prop !== 'constructor') {
        if (prop === 'add') {
          this[prop] = (...args) => {
            this._mts.delete(args[0])
            this._cleanup()
            this._mts.set(args[0], Date.now())
            return super[prop](...args)
          }
        } else {
          this[prop] = (...args) => {
            this._cleanup()
            return super[prop](...args)
          }
        }
      }
    })
  }

  get size() {
    this._cleanup()
    return super.size
  }

  _cleanup() {
    const maxAge = Date.now() - this.maxMs
    Array.from(this._mts.entries()).forEach(([key, mts]) => {
      if (mts < maxAge) {
        this._mts.delete(key)
        super.delete(key)
      }
    })
  }
}

