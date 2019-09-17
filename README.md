# use-cached-promise
React hooks that allows to you to use cached promise factory.
 

[![NPM](https://img.shields.io/npm/v/use-cached-promise.svg)](https://www.npmjs.com/package/use-cached-promise)

## Install

```bash
yarn add use-cached-promise
```

## Usage

### Without cache

```js
import React, { Component } from 'react'
import useCachedPromise, { RESPONSE_STATUS } from "use-cached-promise";

const fetchIp = () =>
  fetch("https://httpbin.org/get")
    .then(r => r.json())
    .then(({ origin }) => origin);

const options = {
  cacheKey: "ipStore"
};

function IpInfo() {
  const { response, status } = useCachedPromise(fetchIp, options);

  return (
    <div className="App">
      <h1>{status === RESPONSE_STATUS.pending && "Loading..."}</h1>
      <h1>{status === RESPONSE_STATUS.success && `Your ip is ${response}`}</h1>
    </div>
  );
}
```

### With cache

```js
import React, { Component } from 'react'
import useCachedPromise, { RESPONSE_STATUS, LocalStorgeCacheAdapter } from "use-cached-promise";

const fetchIp = () =>
  fetch("https://httpbin.org/get")
    .then(r => r.json())
    .then(({ origin }) => origin);

const options = {
  cacheKey: "ipStore",
  cacheAdapter: new LocalStorgeCacheAdapter()
};

function IpInfo() {
  const { response, status } = useCachedPromise(fetchIp, options);

  return (
    <div className="App">
      <h1>{status === RESPONSE_STATUS.pending && "Loading..."}</h1>
      <h1>{status === RESPONSE_STATUS.success && `Your ip is ${response}`}</h1>
    </div>
  );
}
```


### Response Status types
* idle
* pending
* success
* failure

### Cache adapters

* MemoryCacheAdapter
```js
import { MemoryCacheAdapter } from 'use-cached-promise';
```

* LocalStorageCacheAdapter
```js
import { LocalStorageCacheAdapter } from 'use-cached-promise';
```

## License

MIT © [chirag](https://github.com/chirag)
