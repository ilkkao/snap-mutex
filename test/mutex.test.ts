import assert from 'node:assert/strict';
import { setTimeout as sleep } from 'node:timers/promises';
import { beforeEach, describe, mock, test } from 'node:test';
import { type Lock, Mutex } from '../src/index.ts';

describe('Mutex', () => {
  let mutex: Mutex;

  beforeEach(() => {
    mutex = new Mutex();
  });

  test('one caller', async () => {
    const lock = await mutex.acquire();

    lock.release();
  });

  test('two callers', async () => {
    const resolveHandler = mock.fn((lock: Lock) => lock.release());

    void mutex.acquire().then(resolveHandler);

    const lock = await mutex.acquire();

    assert.equal(resolveHandler.mock.callCount(), 1);
    lock.release();
  });

  test('second caller gets the lock only after the first one releases it', async () => {
    const first = await mutex.acquire();
    let secondGotLock = false;

    const second = mutex.acquire().then(lock => {
      secondGotLock = true;
      return lock;
    });

    await sleep(10);
    assert.equal(secondGotLock, false);

    first.release();
    (await second).release();
    assert.equal(secondGotLock, true);
  });

  test('two callers, first one does not release the lock', async () => {
    await mutex.acquire();

    await assert.rejects(mutex.acquire({ timeout: 100 }), new Error('Queue timeout'));
  });

  test('waiter that timed out is skipped when the lock is released', async () => {
    const first = await mutex.acquire();
    const timedOut = mutex.acquire({ timeout: 10 });
    const third = mutex.acquire();

    await assert.rejects(timedOut, new Error('Queue timeout'));

    first.release();
    (await third).release();
  });

  test('one caller, internal timer expires after the lock has given to it', async () => {
    const lock = await mutex.acquire({ timeout: 100 });

    await sleep(200);
    lock.release();
  });
});
