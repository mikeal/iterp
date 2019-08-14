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
  /*
   * Not sure if this next line is necessary, it may
   * not be, but it's better to be cautious just in case.
   * If we ever find a consistent reproduction we should
   * add it to the tests.
  */
  // istanbul ignore next
  while (results.length) yield results.shift()
}

module.exports = iterp
