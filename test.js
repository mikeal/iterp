const { test } = require('tap')
const sleep = require('sleep-promise')
const iterp = require('./')

test('basic test', async t => {
  let data = [1]
  let fn = value => sleep(10).then(() => value)
  let count = 0
  for await (let value of iterp(data.values(), fn)) {
    t.same(value, 1)
    count++
  }
  t.same(count, 1)

  data = [1,2,3,4]
  count = 0
  let start = Date.now()
  for await (let value of iterp(data.values(), fn)) {
    t.same(value, count + 1)
    count++
  }
  t.ok((Date.now() - start) > 40)
  t.same(count, 4)

  count = 0
  start = Date.now()
  for await (let value of iterp(data.values(), fn, 4)) {
    t.same(value, count + 1)
    count++
  }
  let tt = Date.now() - start
  t.ok(tt < 20 && tt > 9)
  for await (let value of iterp([].values(), fn)) {
    throw new Error('Got iteration when one should not have occured.')
  }
})
