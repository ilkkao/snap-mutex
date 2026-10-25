export interface Lock {
  release(): void;
}

export interface AcquireOptions {
  /** Milliseconds to wait for the lock before the returned promise rejects. */
  timeout?: number;
}

interface QueueItem {
  resolve: (lock: Lock) => void;
  timer: ReturnType<typeof setTimeout> | undefined;
}

export class Mutex {
  // Item at index 0 is the caller with the lock: [ <has the lock>, <waiting>, <waiting>, ... ]
  private readonly queue: QueueItem[] = [];

  acquire({ timeout }: AcquireOptions = {}): Promise<Lock> {
    return new Promise((resolve, reject) => {
      const item: QueueItem = {
        resolve,
        timer: timeout
          ? setTimeout(() => {
              this.queue.splice(this.queue.indexOf(item), 1);
              reject(new Error('Queue timeout'));
            }, timeout)
          : undefined,
      };

      this.queue.push(item);

      if (this.queue.length === 1) {
        this.resolveNext();
      }
    });
  }

  private resolveNext(): void {
    const next = this.queue[0];

    if (!next) {
      return;
    }

    clearTimeout(next.timer);

    let released = false;

    next.resolve({
      release: () => {
        // A second release() would remove the next holder from the queue
        if (released) {
          return;
        }

        released = true;
        this.queue.shift();
        this.resolveNext();
      },
    });
  }
}

export default Mutex;
