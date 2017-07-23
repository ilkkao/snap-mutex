const Mutex = require('./index');

let mutex = null;

beforeEach(() => {
  mutex = new Mutex();
});

test('one caller', done => {
  const lock = await mutex.acquire(lock => {
    lock.release();
    done();
  });
});

test('two callers', done => {
  const resolveHandler = jest.fn(lock => lock.release());

  mutex.acquire().then(resolveHandler);

  mutex.acquire().then(lock => {
    expect(resolveHandler.mock.calls.length).toBe(1);

    lock.release();
    done();
  });
});

test('two callers, first one does not release the lock', done => {
  mutex.acquire();

  mutex.acquire({ timeout: 100 }).then(() => {}, reject => {
    expect(reject).toBe('Queue timeout');
    done();
  });
});

test('one caller, internal timer expires after the lock has given to it', done => {
  const resolveHandler = jest.fn();

  mutex.acquire({ timeout: 100 }).then(resolveHandler);

  setTimeout(() => {
    expect(resolveHandler.mock.calls.length).toBe(1);
    done();
  }, 200);
});
