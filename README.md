# snap-mutex

A promise based mutex micro-library for JavaScript. API is optimized for async functions.

[![Build Status](https://travis-ci.org/ilkkao/snap-mutex.svg?branch=master)](https://travis-ci.org/ilkkao/snap-mutex)

## Installation

  $ npm install --save snap-mutex

## Example

```javascript
const mutex = require('snap-mutex');

const myMutex = new Mutex();

async function onlyOneAtTime() {
  let lock;

  try {
    // Try to get the lock
    lock = await myMutex.acquire({ timeout: 60000 }); // 60 seconds
  } catch (e) {
    // Failed to acquire the lock
    throw new Error('Mutex locking timeout');
  }

  try {
    // Got the lock!
    //
    // await doStuff();
  } finally {
    // Release the lock even if the doStuff() throws an exception
    lock.release();
  }
}

// Now onlyOneAtTime() can be called freely
for (const i = 0; i < 9; i++) {
  onlyOneAtTime();
}
```

Remember to put `try ... finally` around the critical section so that the lock gets released in
all cases.
