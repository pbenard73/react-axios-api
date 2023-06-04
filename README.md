# react-axios-api

## Declare Api

```js
import {makeApi} from 'react-axios-api'

const api ={
  main: {path: '/getXX'},
  second: {path: '/getXX', method: 'post'},
  third: {path: '/getId/:id'},
  quatro: {
    path: '/post/:id',
    method: 'post',
    body: {token:'myAlwaysSendToken'},
    headers: {'customHeader': 'headerValue'}
  }
}

export default api

export const { main, second, third, quatro } = makeApi(api, 'localhost:5000')

/**
 * Base path can be a function to dynamically change host request. 
 */
// export const { main, second, third, quatro } = makeApi(api, () => 'localhost:5000')
```

## Explanations

Take care about the arguments:

* route parameters
* body object
* axios extra options

```js
  quatro(
    {id: 'one', urlQueryParam: 'two'},
    {aBodyValue: 'value'},
    {
      headers: {'newHeaderKey': 'newHeaderValue'},
      /* new key values will be passed to axios */
    }
```

will generate

```js
  axios.request({
    url: 'localhost:5000/getId/one?urlQueryParam=two',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // only for 'put' 'post' 'delete' methods
      'customHeader': 'headerValue',
      'newHeaderKey': 'newHeaderValue'
    },
    data: {aBodyValue: 'value'},
    withCredentials: true,
  })

```

## Usage in component

```js
import {useEffect } from 'react'
import { main, second, quatro } from 'myApiFile'

const App = () => {

  useEffect(() => {
      main() // return promise

      /**
       * If need to abort
       */  

      main.cancel()

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

