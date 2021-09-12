import { useState, useEffect } from "react";
import Api from "./Api";

const makeApi = (apiPool = {}, prefix) => {
  let data = {};

  Object.keys(apiPool).forEach((routeName) => {
    const callFunction = (...args) => Api.call(apiPool[name], ...args);

    callFunction.url = (...args) => Api.getUrl(apiPool[name], ...args);

    callFunction.useHook = (...args) => {
      const [calling, setCalling] = useState(true);
      const [success, setSuccess] = useState();
      const [error, setError] = useState();

      useEffect(() => {
        Api.call(apiPool[name], ...args)
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

export default makeApi;
