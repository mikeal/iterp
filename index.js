const iterp = async function * (iter, fn, parallelism = 1) {
  const running = new Set()
  const results = []
  const _run = (value) => {
    const promise = fn(value)
    promise.then(val => {
      results.push(val)
      running.delete(promise)
    })
    running.add(promise)
    return promise
  }
  for (let i = 0; i < parallelism; i++) {
    const { value, done } = iter.next()
    if (!done) _run(value)
  }
  while (running.size) {
    await Promise.race(Array.from(running))
    while (results.length) yield results.shift()
    const { value, done } = iter.next()
    if (!done) _run(value)
  }
  while (results.length) yield results.shift()
}

module.exports = iterp
