import chai from 'chai'

const expect = chai.expect

import { TimeLimitedMap, TimeLimitedSet } from '../index.mjs'

const sleep = ms => new Promise((r) => setTimeout(r, ms))

describe('TimeLimitedMap', function () {
  const addMapItems = async (map, count) => {
    for(let i = 0; i < count; i++) {
      map.set(`key${i}`, `value${i}`)
      await sleep(200)
    }
  }

  it(`can initialize with items`, function () {
    const collect = new TimeLimitedMap(10, [['key1', 'value1'], ['key2', 'value2']])
    expect(collect.get('key1')).equal('value1')
    expect(collect.get('key2')).equal('value2')
    expect(collect.size).equal(2)
  })

  it(`can add items`, function () {
    const collect = new TimeLimitedMap(10)
    const [key, value] = ['key1', 'value1']
    collect.set(key, value)
    expect(collect.get(key)).equal(value)
    expect(collect.size).equal(1)
  })

  it(`removes items when expired (after set time)`, async function () {
    const collect = new TimeLimitedMap(1200)
    await addMapItems(collect, 5)
    for (let i = 0; i < 5; i += 1) {
      expect(collect.size).equal(5 - i)
      let entries = Array.from(collect.entries())
      for (let c = 0; c < 5 - i; c += 1) {
        expect(entries[c][0]).equal(`key${i + c}`)
        expect(entries[c][1]).equal(`value${i + c}`)
      }

      await sleep(200)
    }
  })

  it(`does not remove items added with 'expire = false'`, async function () {
    const collect = new TimeLimitedMap(1200)
    collect.set('key', 'value', false)
    await addMapItems(collect, 5)
    for (let i = 0; i < 5; i += 1) {
      expect(collect.size).equal(5 - i + 1)
      let entries = Array.from(collect.entries())
      for (let c = 0; c < 5 - i; c += 1) {
        expect(entries[c + 1][0]).equal(`key${i + c}`)
        expect(entries[c + 1][1]).equal(`value${i + c}`)
      }

      await sleep(200)
    }
  })

  it(`removes items when expired (after set time), when initialized with items`, async function () {
    const collect = new TimeLimitedMap(100, [['key1', 'value1'], ['key2', 'value2']])
    expect(collect.size).equal(2)
    await sleep(110)
    expect(collect.size).equal(0)
  })

  it(`calls 'callback' with correct parameters when removing items`, function (done) {
    const [key1, value1] = ['key1', 'value1']
    const collect = new TimeLimitedMap(100, (key, value, mts) => {
      expect(key).equal(key1)
      expect(value).equal(value1)
      expect(Number.isFinite(mts)).equal(true)
      done()
    })

    collect.set(key1, value1)
  })
})

describe('TimeLimitedSet', function () {
  it(`can initialize with items`, function () {
    const collect = new TimeLimitedSet(10, ['key1', 'key2'])
    expect(collect.has('key1')).equal(true)
    expect(collect.has('key2')).equal(true)
    expect(collect.size).equal(2)
  })

  it(`can add items`, function () {
    const collect = new TimeLimitedSet(10)
    const key = 'key1'
    collect.add(key)
    expect(collect.has(key)).equal(true)
    expect(collect.size).equal(1)
  })

  it(`removes items when expired (after set time), when initialized with items`, async function () {
    const collect = new TimeLimitedSet(10, ['key1', 'key2'])
    expect(collect.size).equal(2)
    await sleep(110)
    expect(collect.size).equal(0)
  })

  it(`does not remove items added with 'expire = false'`, async function () {
    const collect = new TimeLimitedSet(100, ['key1', 'key2'])
    collect.add('key3', false)
    expect(collect.size).equal(3)
    await sleep(150)
    expect(collect.size).equal(1)
  })

  it(`calls 'callback' with correct parameters when removing items`, function (done) {
    const collect = new TimeLimitedSet(100, (value, mts) => {
      expect(value).equal('key1')
      expect(Number.isFinite(mts)).equal(true)
      done()

    }, ['key1'])

    collect.add('key2', false)
  })


})
