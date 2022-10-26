export interface ApiPoolItem {
    path: string;
    method?: string;
    domain?: string;
    body?: any;
    headers?: any;
    options?: any;
}
export interface ApiPool {
    [routeName: string]: ApiPoolItem;
}
export interface HookItem {
    isCalling: boolean;
    data: any | null;
    error: any | null;
}
export interface ExtraOptions {
    [name: string]: any;
}
export interface ApiItem {
    (options?: any, body?: any, givenExtraOptions?: ExtraOptions): Promise<any>;
    url(options?: any): string;
    useHook(options?: any, body?: any, givenExtraOptions?: any): HookItem;
}
export interface GeneratedApi {
    [routeName: string]: ApiItem;
}
export declare const makeApi: (apiPool?: ApiPool, prefix?: string, extraOptions?: ExtraOptions) => GeneratedApi;
