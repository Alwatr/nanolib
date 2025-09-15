# ECMAScript Nano Libs

This repository is a monorepo of small, dependency-free ECMAScript utility packages designed for high performance and broad compatibility across different JavaScript environments.

## Packages

Here is a brief overview of the included packages:

### Core Utilities

- **[`async-queue`](./packages/async-queue#readme):** A simple async task queue for sequential execution, similar to a mutex.
- **[`debounce`](./packages/debounce#readme):** A powerful, type-safe debouncer class for rate-limiting function calls.
- **[`dedupe`](./packages/dedupe#readme):** A utility to prevent the duplication of modules or other entities at runtime.
- **[`delay`](./packages/delay#readme):** A collection of functions for managing asynchronous delays (e.g., `setTimeout`, `requestAnimationFrame`).
- **[`exit-hook`](./packages/exit-hook#readme):** A utility for registering cleanup functions on Node.js process exit.
- **[`flatomise`](./packages/flatomise#readme):** A "flat promise" utility where `resolve` and `reject` can be called from outside the promise constructor.
- **[`is-number`](./packages/is-number#readme):** A set of functions to check for and convert to numbers, handling various edge cases.
- **[`parse-duration`](./packages/parse-duration#readme):** A utility to parse duration strings (e.g., "10m") into milliseconds and vice-versa.
- **[`random`](./packages/random#readme):** A comprehensive library for generating random numbers, strings, UUIDs, and more.
- **[`render-state`](./packages/render-state#readme):** A state-based renderer function for managing UI rendering based on application state.

### Hashing & Cloning

- **[`cyrb53`](./packages/cyrb53#readme):** A fast, high-quality 53-bit string hash function.
- **[`deep-clone`](./packages/deep-clone#readme):** A function for deep cloning of JSON-serializable objects and arrays.
- **[`djb2-hash`](./packages/djb2-hash#readme):** A fast and simple implementation of the DJB2 hash algorithm.
- **[`flat-string`](./packages/flat-string#readme):** A micro-optimization to flatten a string's internal representation in V8.
- **[`hash-string`](./packages/hash-string#readme):** A fast, non-cryptographic hashing function for generating short hashes.

### Environment & Platform

- **[`env`](./packages/env#readme):** A utility for reading environment variables with support for defaults and development-specific values.
- **[`global-this`](./packages/global-this#readme):** A cross-platform utility to safely access the global `this` context.
- **[`platform-info`](./packages/platform-info#readme):** A utility to detect the current JavaScript runtime environment (Node.js, browser, Deno, etc.).
- **[`polyfill-has-own`](./packages/polyfill-has-own#readme):** A polyfill for the modern `Object.hasOwn` method.

### Networking & Filesystem

- **[`fetch`](./packages/fetch/README.md):** An enhanced `fetch` API wrapper with features like caching, retries, and timeouts.
- **[`http-primer`](./packages/http-primer#readme):** A collection of types and constants for HTTP methods, status codes, and headers.
- **`@alwatr/node-fs`:** A set of enhanced file system utilities for Node.js, providing safe and atomic file operations.
- **[`resolve-url`](./packages/resolve-url#readme):** A function for safely resolving and normalizing URL parts.

### Language & Localization

- **[`iranian-national-code-validator`](./packages/iranian-national-code-validator#readme):** A validator for the Iranian National Code (Code Melli).
- **[`unicode-digits`](./packages/unicode-digits#readme):** A class for converting numbers between different Unicode numeral systems.

### Development & Tooling

- **[`eslint-config`](./packages/eslint-config#readme):** Alwatr's shared ESLint configurations for consistent code style.
- **[`nano-build`](./packages/nano-build#readme):** A zero-dependency, high-performance build tool based on esbuild.
- **[`nanolib`](./packages/nanolib#readme):** An aggregator package that exports many of the other utilities in this repository.
- **[`package-tracer`](./packages/package-tracer#readme):** A runtime utility to track the versions of loaded packages.
- **[`playground`](./packages/playground#readme):** A development environment for testing and experimenting with the packages.
- **[`prettier-config`](./packages/prettier-config#readme):** Alwatr's shared Prettier configurations for code formatting.
- **[`synapse`](./packages/synapse#readme):** A lightweight library for connecting custom behavior to DOM elements using decorators.
- **[`tsconfig-base`](./packages/tsconfig-base#readme):** Base TypeScript configurations used across Alwatr projects.
- **[`type-helper`](./packages/type-helper#readme):** A collection of useful TypeScript type helpers.
- **[`yarn-upgrade`](./packages/yarn-upgrade#readme):** A script for upgrading Yarn in a project.

## Sponsors

The following companies, organizations, and individuals support Nanolib ongoing maintenance and development. Become a Sponsor to get your logo on our README and website.

### Contributing

Contributions are welcome! Please read our [contribution guidelines](https://github.com/Alwatr/.github/blob/next/CONTRIBUTING.md) before submitting a pull request.
