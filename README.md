# promise-mutex

A promise based mutex micro-library for JavaScript

## Installation

  $ npm install --save promise-mutex

## Example

```javascript
const mutex = require('promise-mutex');

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
    await doStuff();
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

Remember to put `try ... finally` around the critical section so that the lock gets releases in
all cases.
