# snap-mutex

The world needed one more mutex library.

A promise-based mutex micro-library for JavaScript. Its API is designed for async functions.

It is useful, for example, when an Express or Koa web server writes a line to a shared file while
handling a request. Only one write operation may be in progress at any given time.

[![CI](https://github.com/ilkkao/snap-mutex/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/ilkkao/snap-mutex/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/ilkkao/snap-mutex/branch/master/graph/badge.svg)](https://codecov.io/gh/ilkkao/snap-mutex) [![npm](https://img.shields.io/npm/v/snap-mutex.svg)](https://www.npmjs.com/package/snap-mutex)

Requires Node.js 22 or later. The package is an ES module and includes TypeScript type definitions.

## Installation

`npm install --save snap-mutex`

## Example

```javascript
import Mutex from 'snap-mutex';

const myMutex = new Mutex();

async function onlyOneAtTime() {
  let lock;

  try {
    // Try to acquire the lock
    lock = await myMutex.acquire({ timeout: 60000 }); // 60 seconds
  } catch {
    // Failed to acquire the lock
    throw new Error('Timed out after waiting 60 seconds for the lock');
  }

  try {
    console.log('Lock acquired');
    // await doStuff();
  } finally {
    // Release the lock even if doStuff() throws
    lock.release();
  }
}

// onlyOneAtTime() can now be called concurrently
for (let i = 0; i < 9; i++) {
  onlyOneAtTime();
}
```

Wrap the critical section in `try ... finally` so that the lock is released in all cases.

If the lock isn't acquired within `timeout` milliseconds, `acquire()` rejects with `Error('Queue timeout')`.
