# react-axios-api

## Declare Api

```js
import {makeApi} from 'react-axios-api'

const api ={
  main: {path: '/getXX'},
  second: {path: '/getXX', method: 'post'},
  third: {path: '/getId/:id'},
  quatro: {path: '/post/:id', method: 'post'}
}

export default api

export const { main, second, third, quatro } = makeApi(api, 'localhost:5000')
```

## Usage in component

Take care about the arguments:

* route parameters
* body object
* axios extra options


```js
import {useEffect } from 'react'
import { main, second, quatro } from 'myApiFile'

const App = () => {

  useEffect(() => {
      main() // return promise
  }, [])

  let {isCalling, data, error} = quatro.useHook({id: '13'}, {content: 'my body variable'})
  

  if (isCalling === true) {
      return <p>Api is calling</p>
  }

  if (error) {
      return <p>Api Error</p>
  }

  return <p>Api is calling</p>
}

```

