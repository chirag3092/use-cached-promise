import React from 'react';
import { render, waitForElement } from '@testing-library/react'
import useCachedPromise, { RESPONSE_STATUS, LocalStorgeCacheAdapter, MemoryCacheAdapter } from ".";

describe('ExampleComponent', () => {
  const originalError = console.error
  beforeAll(() => {
    console.error = (...args: any) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return
      }
      originalError.call(console, ...args)
    }
  })

  afterAll(() => {
    console.error = originalError
  })

  afterEach(() => {
    localStorage.clear();
  })

  
  const apifn = (success: boolean) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({ name: 'Chirag' });
      } else {
        reject(new Error('Failure'));
      }
    }, 100);
  });

  const DummyComponent = ({ success, options }: { success: boolean, options?: any }) => {
    const { response, status } = useCachedPromise(apifn, { cacheKey: 'userData', ...options }, success);
    return (
      <>
        <div data-testid={status} id={status}>{status}</div>
        <div data-testid="content">{status !== RESPONSE_STATUS.success ? 'Loading' : response.name}</div>
      </>
    )
  }
  
  test('check Local storage : success', async () => {
    const { getByTestId } = render(<DummyComponent success />);
    // expect(getByTestId('idle').innerHTML).toContain('idle');
    await waitForElement(() => getByTestId('pending'));
    expect(getByTestId('pending').innerHTML).toContain('pending');
    await waitForElement(() => getByTestId('success'));
    expect(getByTestId('success').innerHTML).toContain('success');
  });

  test('check Local storage : fail', async () => {
    const { getByTestId } = render(<DummyComponent success={false} />);
    // expect(getByTestId('idle').innerHTML).toContain('idle');
    await waitForElement(() => getByTestId('pending'));
    expect(getByTestId('pending').innerHTML).toContain('pending');
    await waitForElement(() => getByTestId('failure'));
    expect(getByTestId('failure').innerHTML).toContain('failure');
  });

  test('check Local storage : LocalCache', async () => {
    const cacheAdapter =  new LocalStorgeCacheAdapter();
    const options = {
      cacheAdapter,
      cacheKey: 'foo'
    }
    cacheAdapter.set('foo', { name: 'Chirag' })
    const { getByTestId } = render(<DummyComponent success options={options} />);
    await waitForElement(() => getByTestId('success'));
    expect(getByTestId('success').innerHTML).toContain('success');
    expect(getByTestId('content').innerHTML).toContain('Chirag');
  });

  test('check Local storage : LocalCache without store', async () => {
    const cacheAdapter =  new LocalStorgeCacheAdapter();
    const options = {
      cacheAdapter,
      cacheKey: 'foo'
    }
    const { getByTestId } = render(<DummyComponent success options={options} />);
    await waitForElement(() => getByTestId('success'));
    expect(getByTestId('success').innerHTML).toContain('success');
    expect(getByTestId('content').innerHTML).toContain('Chirag');
  });

  test('check Local storage : MemoeryCache', async () => {
    const cacheAdapter =  new MemoryCacheAdapter();
    const options = {
      cacheAdapter,
      cacheKey: 'foo'
    }
    cacheAdapter.set('foo', { name: 'Chirag' })
    const { getByTestId } = render(<DummyComponent success options={options} />);
    await waitForElement(() => getByTestId('success'));
    expect(getByTestId('success').innerHTML).toContain('success');
    expect(getByTestId('content').innerHTML).toContain('Chirag');
  });

})
