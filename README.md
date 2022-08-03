time-limited-map-set
====
[![Build Status](https://travis-ci.com/dutu/time-limited-map-set.svg?branch=master)](https://travis-ci.com/dutu/time-limited-map-set)  

Extend `Map` and `Set` standard build-in objects, with the options for the collection items to be automatically removed after a period of time.

`TimeLimitedMap` and `TimeLimitedSet` inherit all methods of `Map` and `Set` standard build-in objects.

Examples:
```js
const map = new TimeLimitedMap(1000, (k, v, insertedMts) => console.log(k))

// add a new pair to the map
// it will be automatically removed after 1000 milliseconds and the callback function will be called 
map.set('key', 'value')

const set = new TimeLimitedSet(500)

// add a new item to the set
// it will be automatically removed after 500 milliseconds 
set.add('item')

// add a new item to the set, which will not be removed automatically
set.add('item2', false)
```

## Constructor

### `new TimeLimitedMap([expiryMs] [, callback] [, iterable])`
### `new TimeLimitedSet([expiryMs] [, callback] [, iterable])`

Optional parameters can be passed to the constructor:
* `expiryMs` - Indicates the duration in milliseconds after which the items are automatically removed from the collection. If `undefined` items are not removed from the collection.
* `callback` - Function to be called when an expired item is removed from the collection.
   The function is called with parameters `key`, `value` (only for `TimeLimitedMap`) and `mts` (inserted millisecond-timestamp).
* `iterable` - As for the `Map` and `Set` build-in objects, an iterable whose elements are added to the collection.


## Methods

`TimeLimitedMap` and `TimeLimitedSet` inherit all methods of `Map` and `Set` standard build-in objects.

### Changed methods:

### `set(key, value, [expire = true])`
 * `expire` - Additional optional parameter. Indicates whether the item should or should not be removed after `expiryMs` period has passed. Default is `true`.

### `add(value, [expire = true])`
* `expire` - Additional optional parameter. Indicates whether the item should or should not be removed after `expiryMs` period has passed. Default is `true`.

### New Methods:
### `getExpiryMts(key)`
Returns expiry millisecond-time of a particular item in the collection.

