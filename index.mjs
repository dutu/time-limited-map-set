export class TimeLimitedMap extends Map {
  #expiryMs
  #callback
  #timeoutIds
  #insertedMts

  constructor(expiryMs, callback, iterable) {
    super()
    this.#expiryMs = expiryMs
    this.#insertedMts = new Map()
    let _iterable
    if (typeof callback === 'function') {
      this.#timeoutIds = new Map()
      this.#callback = callback
      _iterable = iterable
    } else {
      _iterable = callback
    }

    if (_iterable) {
      const expire = true
      for (const [key, value] of _iterable) {
        this.set(key, value, expire)
      }
    }

    Object.getOwnPropertyNames(Object.getPrototypeOf(new Map())).forEach((prop) => {
      if (typeof super[prop] === 'function' && prop !== 'constructor' && prop !== 'set' && prop !== 'delete' && prop !== 'clear') {
        this[prop] = (...args) => {
          if (!this.#callback) this.#removeExpired()
          return super[prop](...args)
        }
      }
    })
  }

  #removeExpired() {
    const maxInsertedMts = Date.now() - this.#expiryMs
    for (const [key, [insertedMts, expire]] of this.#insertedMts.entries()) {
      if (insertedMts > maxInsertedMts) {
        break
      }

      if (expire) {
        this.#insertedMts.delete(key)
        super.delete(key)
      }
    }
  }

  set(key, value, expire = true) {
    if (!expire) {
      return super.set(key, value)
    }

    const insertedMts = Date.now()
    if (this.#callback) {
      const timeoutId = setTimeout(() => {
        this.#timeoutIds.delete(key)
        this.#insertedMts.delete(key)
        super.delete(key)
        this.#callback(key, value, insertedMts)
      }, this.#expiryMs)

      this.#timeoutIds.set(key, timeoutId)
    } else {
      this.#removeExpired()
    }

    this.#insertedMts.set(key, [insertedMts, expire])
    return super.set(key, value)
  }

  delete(key) {
    this.#insertedMts.delete(key)
    if (this.#callback) {
      clearTimeout(this.#timeoutIds.get(key))
    } else {
      this.#removeExpired()
    }

    return super.delete(key)
  }

  clear() {
    if (this.#callback) {
      this.#timeoutIds.forEach((key, timeoutId) => clearTimeout(timeoutId))
      this.#timeoutIds.clear()
    }

    this.#insertedMts.clear()
    return super.clear()
  }

  get size() {
    if (!this.#callback) this.#removeExpired()
    return super.size
  }

  getExpiryMts(key) {
    if (!this.#insertedMts.has(key)) {
      return undefined
    }

    const [insertedMts, expire] = this.#insertedMts.get(key)
    return expire ? insertedMts + this.#expiryMs : null
  }
}

export class TimeLimitedSet extends Set {
  #expiryMs
  #callback
  #timeoutIds
  #insertedMts

  constructor(expiryMs, callback, iterable) {
    super()
    this.#expiryMs = expiryMs
    this.#insertedMts = new Map()
    let _iterable
    if (typeof callback === 'function') {
      this.#timeoutIds = new Map()
      this.#callback = callback
      _iterable = iterable
    } else {
      _iterable = callback
    }

    if (_iterable) {
      const expire = true
      for (const value of _iterable) {
        this.add(value, expire)
      }
    }


    Object.getOwnPropertyNames(Object.getPrototypeOf(new Set())).forEach((prop) => {
      if (typeof super[prop] === 'function' && prop !== 'constructor' && prop !== 'add' && prop !== 'delete' && prop !== 'clear') {
        this[prop] = (...args) => {
          if (!this.#callback) this.#removeExpired()
          return super[prop](...args)
        }
      }
    })
  }

  #removeExpired() {
    const maxInsertedMts = Date.now() - this.#expiryMs
    for (const [key, [insertedMts, expire]] of this.#insertedMts.entries()) {
      if (insertedMts > maxInsertedMts) {
        break
      }

      if (expire) {
        this.#insertedMts.delete(key)
        super.delete(key)
      }
    }
  }

  add(value, expire = true) {
    if (!expire) {
      return super.add(value)
    }

    const insertedMts = Date.now()
    if (this.#callback) {
      const timeoutId = setTimeout(() => {
        this.#timeoutIds.delete(value)
        this.#insertedMts.delete(value)
        super.delete(value)
        this.#callback(value, insertedMts)
      }, this.#expiryMs)

      this.#timeoutIds.set(value, timeoutId)
    } else {
      this.#removeExpired()
    }

    this.#insertedMts.set(value, [insertedMts, expire])
    return super.add(value)
  }

  delete(value) {
    this.#insertedMts.delete(value)
    if (this.#callback) {
      clearTimeout(this.#timeoutIds.get(value))
    } else {
      this.#removeExpired()
    }

    return super.delete(value)
  }

  clear() {
    if (this.#callback) {
      this.#timeoutIds.forEach((key, timeoutId) => clearTimeout(timeoutId))
      this.#timeoutIds.clear()
    }

    this.#insertedMts.clear()
    return super.clear()
  }

  get size() {
    if (!this.#callback) this.#removeExpired()
    return super.size
  }

  getExpiryMts(value) {
    if (!this.#insertedMts.has(value)) {
      return undefined
    }

    const [insertedMts, expire] = this.#insertedMts.get(value)
    return expire ? insertedMts + this.#expiryMs : null
  }
}
