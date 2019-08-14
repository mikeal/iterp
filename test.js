const { test } = require('tap')
const sleep = require('sleep-promise')
const iterp = require('./')

test('basic test', async t => {
  let data = [1]
  const fn = value => sleep(10).then(() => value)
  let count = 0
  for await (const value of iterp(data.values(), fn)) {
    t.same(value, 1)
    count++
  }
  t.same(count, 1)

  data = [1, 2, 3, 4]
  count = 0
  let start = Date.now()
  for await (const value of iterp(data.values(), fn)) {
    count += value
  }
  t.ok((Date.now() - start) > 40)
  t.same(count, 10)

  count = 0
  start = Date.now()

  for await (const value of iterp(data.values(), fn, 4)) {
    count += value
  }
  t.same(count, 10)
  const tt = Date.now() - start
  console.error({ tt })
  t.ok(tt < 30 && tt > 9)
  for await (const value of iterp([].values(), fn)) {
    throw new Error(`Iteration when one should not have occured. value: ${value}`)
  }
})
