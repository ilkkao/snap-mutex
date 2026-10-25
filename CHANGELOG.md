# Changelog

## 1.0.0

The library is rewritten in TypeScript and published as an ES module with type definitions.

### Breaking changes

- The package is an ES module. Use `import Mutex from 'snap-mutex'` or `import { Mutex } from 'snap-mutex'`.
- Requires Node.js 22 or later.
- `acquire()` rejects with `Error('Queue timeout')` instead of the string `'Queue timeout'`.

### Other changes

- Tests use the Node.js built-in test runner, coverage is measured with c8, and code is linted with oxlint.
- CI runs on GitHub Actions and coverage is reported to Codecov. Travis CI and Coveralls are removed.
