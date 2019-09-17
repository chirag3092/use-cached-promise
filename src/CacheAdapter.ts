interface Options {
    parse?: (x: string) => any
    stringify?: (x: any) => string
}

export default abstract class CacheAdapter {
    _stringify: Options['stringify'];
    _parse: Options['parse'];

    constructor({ parse, stringify}: Options = {}) {
        this._parse = parse;
        this._stringify = stringify;
    }

    abstract get(cacheKey: string) : Promise<any>
    abstract set(cacheKey: string, data: any) : Promise<any>
    abstract has(cacheKey: string): Promise<Boolean>

    stringify(data: any) {
        return this._stringify ? this._stringify(data) : data;
    }
    parse(data: string) {
        return this._parse ? this._parse(data) : data;
    }

}
