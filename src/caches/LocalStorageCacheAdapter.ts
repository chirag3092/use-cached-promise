import CacheAdapter from "../CacheAdapter";

export default class LocalStorgeCacheAdapter extends CacheAdapter {
    constructor() {
        super({ stringify: JSON.stringify, parse: JSON.parse });
    }

    async get(cacheKey: string) {
        const data = localStorage.getItem(cacheKey);
        return data ? this.parse(data) : undefined;
    }

    async has(cacheKey: string) {
        return !!(localStorage.getItem(cacheKey));
    }

    async set(cacheKey: string, data: any) {
        // Stringify data
        const dataStringfy = this.stringify(data);
        // set key -> data in local storage
        return localStorage.setItem(cacheKey, dataStringfy);
    }
}

