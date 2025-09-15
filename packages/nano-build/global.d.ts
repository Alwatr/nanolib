export {};

declare global {
  /**
   * A global variable injected by `nano-build` containing the package name from `package.json`.
   */
  const __package_name__: string;

  /**
   * A global variable injected by `nano-build` containing the package version from `package.json`.
   */
  const __package_version__: string;

  /**
   * A global boolean flag injected by `nano-build` indicating whether the code is running in development mode.
   */
  const __dev_mode__: boolean;
}
