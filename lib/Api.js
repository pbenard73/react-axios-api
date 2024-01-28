import stringify from "qs/lib/stringify";

function getUrl(route, givenOptions = {}) {
  if (typeof route === "string") {
    return route;
  }

  const options = typeof givenOptions === "object" && givenOptions !== null ? givenOptions : {};

  let routePath = (route.domain !== undefined ? route.domain : "") + route.path;

  const optionKeys = Object.keys(options).sort((a, b) => (a.length > b.length ? 1 : -1));
  let queryParams = [];
  let qs = {};

  for (var i = optionKeys.length - 1; i >= 0; i--) {
    const value = options[optionKeys[i]];

    if (value === undefined || value.toString === undefined) {
      continue;
    } else if (routePath.indexOf(optionKeys[i]) !== -1) {
      routePath = routePath.replace(":" + optionKeys[i], value);
    } else {
      qs[optionKeys[i]] = value;
    }
  }

  if (Object.keys(qs).length > 0) {
    routePath += "?" + stringify(qs);
  }

  return routePath;
}

function getRequestOptions(route, options = {}, givenBody = {}, givenExtraOptions = {}, others = {}) {
  const url = getUrl(route, options);

  const body = typeof givenBody !== "object" || givenBody === null ? {} : givenBody;

  var data = Object.assign(route.body !== undefined ? route.body : {}, body);

  if (body.constructor !== undefined && body.constructor.name === "FormData") {
    data = body;
  }

  var extraOptions = { ...givenExtraOptions };
  var headers = { ...(route.headers || {}) };
  var method = route.method !== undefined ? route.method.toLowerCase() : "get";

  if (["post", "put", "delete"].indexOf(method) === -1) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  if (givenExtraOptions.headers !== undefined) {
    headers = { ...headers, ...givenExtraOptions.headers };
    delete extraOptions.headers;
  }

  return {
    url,
    method,
    headers,
    data,
    withCredentials: true,
    ...(route.options || {}),
    ...extraOptions,
    ...others,
  };
}

class Api {
  url(route, options = {}) {
    return getUrl(route, options);
  }

  call(route, options = {}, body = {}, givenExtraOptions = {}) {
    const axios = require("axios");

    const controller = new AbortController();

    const newCall = new Promise((resolve, reject) => {
      return axios
        .request(getRequestOptions(route, options, body, givenExtraOptions, { signal: controller.signal }))
        .then((response) => {
          if ([200, 201].indexOf(response.status) === -1) {
            response.message = response.data.status;

            return reject(response);
          }

          if (typeof givenExtraOptions.parseData !== "function") {
            return resolve(response.data);
          }

          return givenExtraOptions.parseData(response.data);
        })
        .catch((error) => reject(error));
    });

    newCall.cancel = () => controller.abort();

    return newCall;
  }
}

export const getOptions = getRequestOptions;

export default new Api();
