# snap-mutex

A promise based mutex micro-library for JavaScript. API is optimized for async functions.

Useful for example when you have an Express/Koa web server and as part of serving a request, you want to
write a line to a shared file. In this case there must be only one write operation in progress
at any given time.

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
    // Try to get the lock
    lock = await myMutex.acquire({ timeout: 60000 }); // 60 seconds
  } catch {
    // Failed to acquire the lock
    throw new Error('Mutex locking timeout, waited 60s');
  }

  try {
    console.log('Got the lock!');
    // await doStuff();
  } finally {
    // Release the lock even if the doStuff() throws an exception
    lock.release();
  }
}

// Now onlyOneAtTime() can be called freely
for (let i = 0; i < 9; i++) {
  onlyOneAtTime();
}
```

Remember to put `try ... finally` around the critical section so that the lock gets released in
all cases.

If `timeout` is given and the lock isn't acquired in time, the promise rejects with `Error('Queue timeout')`.
