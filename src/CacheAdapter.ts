export interface Options {
    parse?: (x: string) => any
    stringify?: (x: any) => string
    maxAge?: number
}

const CACHE_EXPIRY = 'cacheexpiry';

export default abstract class CacheAdapter {
    _stringify: Options['stringify'];
    _parse: Options['parse'];
    _maxAge: Options['maxAge'] ;

    constructor({ parse, stringify, maxAge }: Options = {}) {
        this._parse = parse;
        this._stringify = stringify;
        this._maxAge = maxAge;
    }

    abstract get(cacheKey: string) : Promise<any>
    abstract set(cacheKey: string, data: any) : Promise<any>
    abstract has(cacheKey: string): Promise<Boolean>
    
    async hasKeyExpired(cacheKey: string) {
        const cacheExpiry = await this.get(CACHE_EXPIRY) || {};
        return cacheExpiry[cacheKey] !== undefined ? cacheExpiry[cacheKey] <= Date.now() : false;
    }

    async refreshExpiry(cacheKey: string) {
        const allExpiryData = await this.get(CACHE_EXPIRY) || {};
        allExpiryData[cacheKey] = this._maxAge;
        await this.set(CACHE_EXPIRY, allExpiryData);
    }

    stringify(data: any) {
        return this._stringify ? this._stringify(data) : data;
    }
    parse(data: string) {
        return this._parse ? this._parse(data) : data;
    }

}
