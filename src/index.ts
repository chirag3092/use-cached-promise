import { useReducer, useEffect } from 'react';
import CacheAdapter from './CacheAdapter';
export { default as LocalStorgeCacheAdapter } from './caches/LocalStorageCacheAdapter';
export { default as MemoryCacheAdapter } from './caches/MemoryCacheAdapter';

export const EVENTS = {
  API_CALLED: 'api_called',
  API_SUCCESS: 'api_success',
  API_FAILURE: 'api_failure',
};

type ResponseStatus = 'idle'|'pending'|'success'|'failure';
export const RESPONSE_STATUS: { [key: string]: ResponseStatus } = {
  idle: 'idle',
  pending: 'pending',
  success: 'success',
  failure: 'failure',
};

interface State {
  isLoading: boolean
  response: any
  status: ResponseStatus
}

const initialState: State = {
  isLoading: false,
  response: null,
  status: RESPONSE_STATUS.idle,
};

interface Dispatch<T = any> {
  type: string,
  payload?: T,
};

const reducer = (state: any, { type, payload }: Dispatch) => {
  switch (type) {
    case EVENTS.API_CALLED:
      return { response: null, isLoading: true, status: RESPONSE_STATUS.pending };
    case EVENTS.API_FAILURE:
      return { response: payload, isLoading: false, status: RESPONSE_STATUS.failure };
    case EVENTS.API_SUCCESS:
      return { response: payload, isLoading: false, status: RESPONSE_STATUS.success };
    default:
      return state;
  }
};

interface Options {
  cacheAdapter?:CacheAdapter
  shouldCallPromiseFactory?: (...args: any[]) => boolean
  cacheKey: string 
}  

const useCachedPromise = (promiseFactory: (...args: any[]) => Promise<any>, options: Options, ...args: any[]) => {
  const {
    cacheAdapter,
    shouldCallPromiseFactory = () => true,
    cacheKey,
  } = options;

  const [{ isLoading, response, status }, dispatch] = useReducer(reducer, initialState);

  const shouldCall = shouldCallPromiseFactory(...args);

  async function resolvePromise({ dispatchEvent }: { dispatchEvent: (a: Dispatch) => void }) {
   
    if (cacheAdapter && await cacheAdapter.has(cacheKey) ) {
      const hasKeyExpired =  await cacheAdapter.hasKeyExpired(cacheKey);
      if(!hasKeyExpired) {
        dispatchEvent({ type: EVENTS.API_CALLED });
        
        const data = await cacheAdapter.get(cacheKey);

        dispatchEvent({ type: EVENTS.API_SUCCESS, payload: data });

        return;
      }
    }

    if (shouldCall) {
      dispatchEvent({ type: EVENTS.API_CALLED });

      const data = await promiseFactory(...args);

      dispatchEvent({ type: EVENTS.API_SUCCESS, payload: data });

      if (cacheAdapter) {
        cacheAdapter.set(cacheKey, data);
        cacheAdapter.refreshExpiry(cacheKey);
      }
    }
  }

  useEffect(
    () => {
      let isCancelled = false;

      const dispatchEvent = (a: Dispatch) => !isCancelled && dispatch(a);

      resolvePromise({ dispatchEvent }).catch((error: Error) => {
        dispatchEvent({ type: EVENTS.API_FAILURE, payload: error });
      });

      return () => {
        isCancelled = true;
      };
    },
    [shouldCall, ...args],
  );

  return { response, isLoading, status };
};

export default useCachedPromise;
