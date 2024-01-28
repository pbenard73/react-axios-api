"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApi = void 0;
const react_1 = require("react");
const ramda_1 = require("ramda");
const Api_1 = __importDefault(require("./Api"));
const makeApiFx = (apiPool = {}, prefix = "", extraOptions = {}) => {
    let data = {};
    const cleanRoute = (route) => (Object.assign(Object.assign({}, route), { path: (typeof prefix === "string" ? prefix : prefix()) + route.path }));
    Object.keys(apiPool).forEach((routeName) => {
        const route = Object.assign({}, apiPool[routeName]);
        const mergedOptions = (givenOptions = {}) => (0, ramda_1.mergeDeepLeft)(extraOptions, givenOptions);
        const CallFunction = (options, body, givenExtraOptions) => Api_1.default.call(cleanRoute(route), options, body, mergedOptions(givenExtraOptions));
        CallFunction.url = (options) => Api_1.default.url(cleanRoute(route), options);
        CallFunction.useHook = (options, body, givenExtraOptions) => {
            const [calling, setCalling] = (0, react_1.useState)(true);
            const [success, setSuccess] = (0, react_1.useState)();
            const [error, setError] = (0, react_1.useState)();
            (0, react_1.useEffect)(() => {
                Api_1.default.call(cleanRoute(route), options, body, mergedOptions(givenExtraOptions))
                    .then((apidata) => setSuccess(apidata))
                    .catch((e) => setError(e))
                    .finally(() => setCalling(false));
            }, []);
            return { isCalling: calling, data: success, error };
        };
        data[routeName] = CallFunction;
    });
    return data;
};
exports.makeApi = makeApiFx;
