import { useState, useEffect } from "react";
import Api from "./Api";

// declare module 'react-axios-api';

interface ApiPoolItem {
  path: string
  method?: string
  domain?: string
  body?: any
  headers?: any
  options?: any
}

interface ApiPool {
  [routeName: string]: ApiPoolItem
}

interface HookItem {
  isCalling:boolean
  data: any | null
  error: any | null
}

interface CallArgs {

}

interface ApiItem {
  (options?: any, body?: any, givenExtraOptions?: any): Promise<any>
  url(options?: any):string
  useHook(options?: any, body?: any, givenExtraOptions?: any): HookItem
}

interface GeneratedApi {
  [routeName:string]: ApiItem
}

const makeApiFx = (apiPool:ApiPool = {}, prefix:string = ""):GeneratedApi => {
  let data:GeneratedApi = {};

  Object.keys(apiPool).forEach((routeName) => {
    const route = apiPool[routeName];
    route.path = prefix + route.path;

    const callFunction = (options?: any, body?: any, givenExtraOptions?: any) => Api.call(route, options, body, givenExtraOptions);

    callFunction.url = (options?: any) => Api.url(route, options);

    callFunction.useHook = (options?: any, body?: any, givenExtraOptions?: any) => {
      const [calling, setCalling] = useState(true);
      const [success, setSuccess] = useState();
      const [error, setError] = useState();

      useEffect(() => {
        Api.call(route, options, body, givenExtraOptions)
          .then((apidata) => setSuccess(apidata))
          .catch((e) => setError(e))
          .finally(() => setCalling(false));
      }, []);

      return { isCalling: calling, data: success, error };
    };

    data[routeName] = callFunction;
  });

  return data;
};

export const makeApi = makeApiFx;
