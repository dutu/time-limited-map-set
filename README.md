time-limited-map-set
====
[![Build Status](https://travis-ci.com/dutu/time-limited-map-set.svg?branch=master)](https://travis-ci.com/dutu/time-limited-map-set)  

The module provides `TimeLimitedMap` and `TimeLimitedSet` objects, which extend `Map` and `Set`.

Items added to `TimeLimitedMap` and `TimeLimited` are automatically removed from the collection when `expiryMs` milliseconds have passed.
`expiryMs` parameter is specified in the constructor

Example:
Added items are automatically removed after 1000 milliseconds
```js
const map = new TimeLimitedMap(1000)
map.add('key', 'value')

const map = new TimeLimitedSet(1000)
map.set('item')
```

`TimeLimitedMap` and `TimeLimitedSet` inherit all methods of `Map` and `Set`.
In addition the following methods are available:

* `setExpiryMs(expiryMs)` - sets a new `expiryMs` value
* `getExpiryMts(key)` - returns the millisecond-timestamp for a particular item in the collection

