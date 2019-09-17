import MemoryCacheAdapter from "../MemoryCacheAdapter";

describe('Memory Storage Cached :', () => {
    const memoryStorageAdapter = new MemoryCacheAdapter();
    const cacheKey = 'userData';
    const cacheKey2 = 'customerData';
    beforeEach(() => {
        memoryStorageAdapter.cache = {};
    });
    describe('Get Method Render : ', () => {
        it('Get Method : without Data', async () => {
            const data = await memoryStorageAdapter.get(cacheKey);
            expect(data).toBe(undefined);
        });
        it('Get Method : with Data', async () => {
            memoryStorageAdapter.cache[cacheKey] = { name: 'Chirag' }
            const data = await memoryStorageAdapter.get(cacheKey);
            expect(data.name).toBe('Chirag');

            memoryStorageAdapter.cache[cacheKey2] = { name: 'Akshay' }
            const data2 = await memoryStorageAdapter.get(cacheKey2);
            expect(data2.name).toBe('Akshay');
        });    
    });

    describe('Has Method Render : ', () => {
        it('Has Method : without Data', async () => {
            const data = await memoryStorageAdapter.has(cacheKey);
            expect(data).toBe(false);
        });
        it('Has Method : with Data', async () => {
            memoryStorageAdapter.cache[cacheKey] = { name: 'Chirag' }
            const data = await memoryStorageAdapter.has(cacheKey);
            expect(data).toBe(true);
        });    
    });

    describe('Set Method Render : ', () => {
        it('Set Method : without Data', async () => {
            const data = {};
            await memoryStorageAdapter.set(cacheKey,data);
            const response = await memoryStorageAdapter.get(cacheKey);
            expect(response).toMatchObject({});
        });
        it('Set Method : with Data', async () => {
            const data = { name: 'Chirag' };
            await memoryStorageAdapter.set(cacheKey, data);
            const response = await memoryStorageAdapter.get(cacheKey);
            expect(response.name).toBe('Chirag');

            const data2 = { name: 'Akshay' };
            await memoryStorageAdapter.set(cacheKey2, data2);
            const response2 = await memoryStorageAdapter.get(cacheKey2);
            expect(response2.name).toBe('Akshay');
        });    
    });
});