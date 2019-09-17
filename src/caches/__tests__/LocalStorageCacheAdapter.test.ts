import LocalStorgeCacheAdapter from "../LocalStorageCacheAdapter";


describe('Local Storage Cached :', () => {
    const localStroageCacheAdapter = new LocalStorgeCacheAdapter();
    const cacheKey = 'userData';
    const cacheKey2 = 'customerData';
    beforeEach(() => {
        localStorage.clear();
    });
    describe('Get Method Render : ', () => {
        it('Get Method : without Data', async () => {
            const data = await localStroageCacheAdapter.get(cacheKey);
            expect(data).toBe(undefined);
        });
        it('Get Method : with Data', async () => {
            localStorage.setItem(cacheKey, JSON.stringify({ name: 'Chirag' }));
            const data = await localStroageCacheAdapter.get(cacheKey);
            expect(data.name).toBe('Chirag');

            localStorage.setItem(cacheKey2, JSON.stringify({ name: 'Akshay' }));
            const data2 = await localStroageCacheAdapter.get(cacheKey2);
            expect(data2.name).toBe('Akshay');
        });    
    });

    describe('Has Method Render : ', () => {
        it('Has Method : without Data', async () => {
            const data = await localStroageCacheAdapter.has(cacheKey);
            expect(data).toBe(false);
        });
        it('Has Method : with Data', async () => {
            localStorage.setItem(cacheKey, JSON.stringify({ name: 'Chirag' }));
            const data = await localStroageCacheAdapter.has(cacheKey);
            expect(data).toBe(true);
        });    
    });

    describe('Set Method Render : ', () => {
        it('Set Method : without Data', async () => {
            const data = {};
            await localStroageCacheAdapter.set(cacheKey,data);
            const response = await localStroageCacheAdapter.get(cacheKey);
            expect(response).toMatchObject({});
            
        });
        it('Set Method : with Data', async () => {
            const data = { name: 'Chirag' };
            await localStroageCacheAdapter.set(cacheKey, data);
            const response = await localStroageCacheAdapter.get(cacheKey);
            expect(response.name).toBe('Chirag');

            const data2 = { name: 'Akshay' };
            await localStroageCacheAdapter.set(cacheKey2, data2);
            const response2 = await localStroageCacheAdapter.get(cacheKey2);
            expect(response2.name).toBe('Akshay');

        });    
    });
});