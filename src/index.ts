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
  shouldCallPromiseFactory?: (...args: Array<any>) => boolean
  cacheKey: string 
}  

const useCachedPromise = (apiFn: Function , options: Options, ...args: Array<any>) => {
  const {
    cacheAdapter,
    shouldCallPromiseFactory = () => true,
    cacheKey,
  } = options;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading, response, status } = state;

  const shouldCall = shouldCallPromiseFactory(...args);

  useEffect(
    () => {
      if (cacheAdapter && cacheAdapter.has(cacheKey)) {
        dispatch({ type: EVENTS.API_CALLED });
        cacheAdapter.get(cacheKey).then(data => {
          dispatch({ type: EVENTS.API_SUCCESS, payload: data });
        });
        return;
      }

      if (shouldCall) {
        dispatch({ type: EVENTS.API_CALLED });
        apiFn(...args)
          .then((data: any) => {
            dispatch({ type: EVENTS.API_SUCCESS, payload: data });
            if (cacheAdapter) {
              cacheAdapter.set(cacheKey, data);
            }
          })
          .catch((error: Error) => {
            dispatch({ type: EVENTS.API_FAILURE, payload: error });
          });
      }
    },
    [shouldCall, ...args],
  );

  return { response, isLoading, status };
};

export default useCachedPromise;
