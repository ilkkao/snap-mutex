'use strict';

class Mutex {
  constructor() {
    // Item at index 0 is the caller with the lock:
    // [ <has the lock>, <waiting>, <waiting>, <waiting> ... ]
    this.queue = [];
  }

  acquire({ timeout = false } = {}) {
    const queue = this.queue;

    return new Promise((resolve, reject) => {
      if (timeout !== false) {
        setTimeout(() => {
          const index = queue.indexOf(resolve);

          if (index > 0) { // Still waiting in the queue
            queue.splice(index, 1);
            reject('Queue timeout');
          }
        }, timeout);
      }

      if (queue.push(resolve) === 1) {
        // Queue was empty, resolve this promise immediately. Caller is kept in the queue until
        // it calls release()
        resolve({
          release: function release() {
            queue.shift();

            if (queue.length > 0) {
              queue[0]({ release }); // give the lock to the next in line by resolving the promise
            }
          }
        });
      }
    });
  }
}

module.exports = Mutex;
