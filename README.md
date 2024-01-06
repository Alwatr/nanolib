# ECMAScript Nano Libs

This repository contains numerous small utility packages. These packages serve various useful purposes and are written in nano ESModule without any dependencies.

Here is a brief overview of the included libraries:

1. [`tsconfig-base`](./packages/tsconfig-base/README.md): This is a foundational TypeScript configuration used for Alwatr projects.
2. [`flat-string`](./packages/flat-string/README.md): The `flat-string` function flattens the underlying C structures of a concatenated JavaScript string.
3. [`global-scope`](./packages/global-scope/README.md): This TypeScript module provides a cross-platform alternative to `globalThis` named `globalScope`. This object works across different environments, including browsers (`window`), Node.js (`global`), and Web Workers (`self`).
4. [`platform-info`](./packages/platform-info/README.md): This module offers a method to identify the current platform where the script is being executed. It defines a `platformInfo` constant that contains details about the current platform.
5. [`prettier-config`](./packages/prettier-config/README.md): These are Alwatr's shared configurations for Prettier.
6. [`eslint-config`](./packages/eslint-config/README.md): This is Alwatr's ECMAScript Style Guide presented as shareable ESLint configurations.
7. [`deep-clone`](./packages/deep-clone/README.md): This function allows you to clone deeply nested objects and arrays in JavaScript.
8. [`nano-build`](./packages/nano-build/README.md): This is a tool for building/bundling ECMAScript, TypeScript, and JavaScript libraries. It's user-friendly, requires no setup, follows best practices, has no dependencies, and uses esbuild for improved performance.
9. [`type-helper`](./packages/type-helper/README.md): Collection of useful typescript type helpers.
10. [`wait`](./packages/wait/README.md): Comprehensive toolkit for managing asynchronous operations.
11. [`exit-hook`](./packages/exit-hook/README.md): A utility for registering exit handlers in Node.js.
12. [`flatomise`](./packages/flatomise/README.md): A utility for creating promises that can be externally resolved or rejected.
13. [`async-queue`](./packages/async-queue/README.md): A queue that executes async tasks in order like mutex and semaphore methodology for javascript and typescript.
14. [`node-fs`](./packages/node-fs/README.md): Enhanced file system operations in Node.js, including reading, writing, and handling JSON files, with both synchronous and asynchronous options.

For more detailed information and guidelines on how to use each package, please refer to to each package's README.
