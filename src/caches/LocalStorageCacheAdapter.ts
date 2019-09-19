import CacheAdapter, { Options }  from "../CacheAdapter";

const stringify = (obj: any) => {
    try {
        return JSON.stringify(obj);
    }
    catch {
        return '';
    }
}

const parse = (str: string) => {
    try {
        return JSON.parse(str);
    }
    catch {
        return {};
    }
}

export default class LocalStorgeCacheAdapter extends CacheAdapter {
    constructor(options: Options = {}) {
        super({ stringify: stringify, parse: parse, ...options });
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

