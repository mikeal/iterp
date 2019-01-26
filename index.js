const iterp = async function * (iter, fn,  parallelism=1) {
  let running = new Set()
  let _run = (value) => {
    let promise = fn(value)
    promise.then(() => {
      running.delete(promise)
    })
    running.add(promise)
		return promise
  }
  for (let i = 0; i < parallelism; i++) {
    let { value, done } = iter.next()
    if (!done) _run(value)
  }
  while (running.size) {
    let ret = await Promise.race(Array.from(running))
    yield ret
    let { value, done } = iter.next()
    if (!done) _run(value)
  }
}

module.exports = iterp

