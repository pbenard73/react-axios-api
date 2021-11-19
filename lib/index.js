import { useState, useEffect } from "react";
import Api from "./Api";

const makeApiFx = (apiPool = {}, prefix = "") => {
  let data = {};

  Object.keys(apiPool).forEach((routeName) => {
    const route = apiPool[routeName];
    route.path = prefix + route.path;

    const callFunction = (...args) => Api.call(route, ...args);

    callFunction.url = (...args) => Api.url(route, ...args);

    callFunction.useHook = (...args) => {
      const [calling, setCalling] = useState(true);
      const [success, setSuccess] = useState();
      const [error, setError] = useState();

      useEffect(() => {
        Api.call(route, ...args)
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
