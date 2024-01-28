export function getOptions(route: any, options?: {}, givenBody?: {}, givenExtraOptions?: {}, others?: {}): any;
declare const _default: Api;
export default _default;
declare class Api {
    axios: any;
    setAxios(givenAxios: any): void;
    url(route: any, options?: {}): any;
    call(route: any, options?: {}, body?: {}, givenExtraOptions?: {}): Promise<any>;
}
