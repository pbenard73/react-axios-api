interface ApiPoolItem {
    path: string;
    method?: string;
    domain?: string;
    body?: any;
    headers?: any;
    options?: any;
}
interface ApiPool {
    [routeName: string]: ApiPoolItem;
}
interface HookItem {
    isCalling: boolean;
    data: any | null;
    error: any | null;
}
interface ApiItem {
    (options?: any, body?: any, givenExtraOptions?: any): Promise<any>;
    url(options?: any): string;
    useHook(options?: any, body?: any, givenExtraOptions?: any): HookItem;
}
interface GeneratedApi {
    [routeName: string]: ApiItem;
}
export declare const makeApi: (apiPool?: ApiPool, prefix?: string) => GeneratedApi;
export {};
