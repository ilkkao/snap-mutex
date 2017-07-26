# snap-mutex

A promise based mutex micro-library for JavaScript. API is optimized for async functions.

Useful for example when you have a Koa web server and as part of serving a request, you want to
write a line to a shared file. In this case there must be only one write operation in progress
at any given time.

[![Build Status](https://travis-ci.org/ilkkao/snap-mutex.svg?branch=master)](https://travis-ci.org/ilkkao/snap-mutex) [![Coverage Status](https://coveralls.io/repos/github/ilkkao/snap-mutex/badge.svg?branch=master)](https://coveralls.io/github/ilkkao/snap-mutex?branch=master)

## Installation

```bash
  $ npm install --save snap-mutex
```

## Example

```javascript
const Mutex = require('snap-mutex');

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
