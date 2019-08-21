# `iterp`

![1267](https://img.shields.io/badge/compiled%20bundle-1k-brightgreen) ![612](https://img.shields.io/badge/gzipped%20bundle-1k-brightgreen)

```javascript
const iterp = require('iterp')

const data = ['one', 'two', 'three']

const fn = async value => {
  // Do some async work.
  return value + '-done'
}

for await (let value of iterp(data.values(), fn, 2)) {
  console.log(value)
}
```

