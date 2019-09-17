import CacheAdapter from "../CacheAdapter";

export default class MemoryCacheAdapter extends CacheAdapter {
    cache = {};
   
    async get(cacheKey: string) {
        const data = this.cache[cacheKey];
        return data ? this.parse(data) : undefined;
    }

    async has(cacheKey: string) {
        return this.cache[cacheKey] !== undefined;
    }

    async set(cacheKey: string, data: any) {
        // Stringify data
        const dataStringfy = this.stringify(data);
        // set key -> data in local storage
        return this.cache[cacheKey] = dataStringfy;
    }
}

