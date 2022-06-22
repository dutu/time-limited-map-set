export class TimeLimitedMap extends Map {
  constructor(expiryMs) {
    super()
    this._mts = new Map()
    this.expiryMs = expiryMs
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

  getExpiryMts(key) {
    const mts = this._mts.get(key)
    return mts ? mts + this.expiryMs : mts
  }

  setExpiryMs(expiryMs) {
    this._mts = expiryMs
  }

  _cleanup() {
    const expiryTimeMts = Date.now() - this.expiryMs
    for (const [key, mts] of this._mts.entries()) {
      if (mts < expiryTimeMts) {
        this._mts.delete(key)
        super.delete(key)
      } else {
        break
      }
    }
  }
}

export class TimeLimitedSet extends Set {
  constructor(expiryMs) {
    super()
    this._mts = new Map()
    this.maxMs = expiryMs
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

  getExpiryMts(key) {
    const mts = this._mts.get(key)
    return mts ? mts + this.expiryMs : mts
  }

  setExpiryMs(expiryMs) {
    this._mts = expiryMs
  }

  _cleanup() {
    const expiryTimeMts = Date.now() - this.maxMs
    for (const [key, mts] of this._mts.entries()) {
      if (mts < expiryTimeMts) {
        this._mts.delete(key)
        super.delete(key)
      } else {
        break
      }
    }
  }
}
