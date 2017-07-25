'use strict';

class Mutex {
  constructor() {
    // Item at index 0 is the caller with the lock:
    // [ <has the lock>, <waiting>, <waiting>, <waiting> ... ]
    this.queue = [];
  }

  acquire({ timeout = false } = {}) {
    return new Promise((resolve, reject) => {
      let timer = null;

      if (timeout !== false) {
        timer = setTimeout(() => {
          const index = this.queue.findIndex(item => item.resolve === resolve);
          this.queue.splice(index, 1);
          reject('Queue timeout');
        }, timeout);
      }

      this.queue.push({ resolve, timer });

      if (this.queue.length === 1) {
        this._resolveNext();
      }
    });
  }

  _removeActiveAndresolveNext() {
    this.queue.shift();

    if (this.queue.length > 0) {
      this._resolveNext();
    }
  }

  _resolveNext(remove) {
    clearTimeout(this.queue[0].timer);
    this.queue[0].resolve({ release: this._removeActiveAndresolveNext.bind(this) })
  }
}

module.exports = Mutex;
