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

## Usage with Symfony React

### Create a the route.json

*assets/routes/stock.json*

```
{
    "index": {"path":"/", "method":"get"},
    "stockGetNumber": {"path":"/stock/getNumber", "method":"post"},
    "stockRandom": {"path":"/stock/stockRandom", "method":"post"},
    "getDate": {"path":"/stock/getDate", "method":"get"}
}
```

### Override controller

*src/Controller/StockController.php*

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class StockController extends AbstractController
{
  /**
   *  Link the stock.json routes here
   */
    public static $api = __DIR__ . './../../assets/routes/stock.json*';

    public function index(): Response
    {
        return $this->render('stock/index.html.twig', [
            'controller_name' => 'StockController',
        ]);
    }
    
    public function stockGetNumber(): Response
    {
        $data = rand();

        return new JsonResponse($data);
    }

    public function stockRandom(): Response {
        return new JsonResponse('coucou ta mere');
    }

    public function getDate():Response {
        return new JsonResponse(date('d-m-y h:i:s'));
    }
}
```

### Register routes

*config/routes.php*

```php
<?php

use App\Controller\StockController;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes): void {
  /**
   *  Register your controller here
   */
    $controllers = [
        StockController::class
    ];

    foreach($controllers as $controller) {
        $currentRoutes = json_decode(file_get_contents($controller::$api));
      
        foreach($currentRoutes as $routeName => $pathData) {
            $routes
            ->add($routeName, $pathData->path)
            ->controller([$controller, $routeName])
            ->methods([$pathData->method]);
        }
    };
};
```

### Inside the react project

```js
import { makeApi } from "react-axios-api";
import routes from './../routes/stock.json'

export const { stockGetNumber, stockRandom, getDate } = makeApi(routes)
```
