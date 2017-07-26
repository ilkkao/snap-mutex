'use strict';

class Mutex {
  constructor() {
    // Item at index 0 is the caller with the lock: [ <has the lock>, <waiting>, <waiting>, ... ]
    this.queue = [];
  }

  acquire({ timeout = false } = {}) {
    const resolveNext = () => {
      clearTimeout(this.queue[0].timer);

      this.queue[0].resolve({
        release: () => {
          this.queue.shift();

          if (this.queue.length > 0) {
            resolveNext(this.queue);
          }
        }
      })
    };

    return new Promise((resolve, reject) => {
      this.queue.push({
        resolve,
        timer: timeout ? setTimeout(() => {
          this.queue.splice(this.queue.findIndex(item => item.resolve === resolve), 1);
          reject('Queue timeout');
        }, timeout) : null
      });

      if (this.queue.length === 1) {
        resolveNext(this.queue);
      }
    });
  }
}

module.exports = Mutex;
