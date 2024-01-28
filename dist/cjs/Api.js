"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = void 0;
const stringify_1 = __importDefault(require("qs/lib/stringify"));
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
        }
        else if (routePath.indexOf(optionKeys[i]) !== -1) {
            routePath = routePath.replace(":" + optionKeys[i], value);
        }
        else {
            qs[optionKeys[i]] = value;
        }
    }
    if (Object.keys(qs).length > 0) {
        routePath += "?" + (0, stringify_1.default)(qs);
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
    var extraOptions = Object.assign({}, givenExtraOptions);
    var headers = Object.assign({}, (route.headers || {}));
    var method = route.method !== undefined ? route.method.toLowerCase() : "get";
    if (["post", "put", "delete"].indexOf(method) === -1) {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (givenExtraOptions.headers !== undefined) {
        headers = Object.assign(Object.assign({}, headers), givenExtraOptions.headers);
        delete extraOptions.headers;
    }
    return Object.assign(Object.assign(Object.assign({ url,
        method,
        headers,
        data, withCredentials: true }, (route.options || {})), extraOptions), others);
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
exports.getOptions = getRequestOptions;
exports.default = new Api();
