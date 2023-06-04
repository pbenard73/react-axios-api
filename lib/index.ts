import { useState, useEffect } from "react";
import { mergeDeepLeft } from 'ramda'

import Api from "./Api";

// declare module 'react-axios-api';

export interface ApiPoolItem {
  path: string
  method?: string
  domain?: string
  body?: any
  headers?: any
  options?: any
}
export interface ApiPool {
  [routeName: string]: ApiPoolItem
}

export interface HookItem {
  isCalling: boolean
  data: any | null
  error: any | null
}

export interface ExtraOptions {
  [name: string]: any
}

export interface ApiItem {
  (options?: any, body?: any, givenExtraOptions?: ExtraOptions): Promise<any>
  url(options?: any): string
  useHook(options?: any, body?: any, givenExtraOptions?: any): HookItem
}

export interface GeneratedApi {
  [routeName: string]: ApiItem
}

export type Prefix = string | (() => string)

const makeApiFx = (apiPool: ApiPool = {}, prefix: Prefix = "", extraOptions: ExtraOptions = {}): GeneratedApi => {
  let data: GeneratedApi = {};

  const cleanRoute = (route: any) => ({ ...route, path: (typeof prefix === 'string' ? prefix : prefix()) + route.path })

  Object.keys(apiPool).forEach((routeName) => {
    const route = { ...apiPool[routeName] };

    const mergedOptions = (givenOptions = {}) => mergeDeepLeft(extraOptions, givenOptions)

    const callFunction = (options?: any, body?: any, givenExtraOptions?: ExtraOptions) => Api.call(cleanRoute(route), options, body, mergedOptions(givenExtraOptions));

    callFunction.url = (options?: any) => Api.url(cleanRoute(route), options);

    callFunction.useHook = (options?: any, body?: any, givenExtraOptions?: any) => {
      const [calling, setCalling] = useState(true);
      const [success, setSuccess] = useState();
      const [error, setError] = useState();

      useEffect(() => {
        Api.call(cleanRoute(route), options, body, mergedOptions(givenExtraOptions))
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
