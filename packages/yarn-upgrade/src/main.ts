#!/usr/bin/env node

/**
 * @module @alwatr/yarn-upgrade
 *
 * A command-line script for running a sequence of `yarn` commands to upgrade
 * and maintain a Yarn-based project. It automates common update tasks.
 */

import {spawn} from 'child_process';

/**
 * A list of maintenance commands to be executed sequentially.
 * @private
 */
const commands: string[] = [
  'yarn set version latest', // Ensures Yarn itself is up-to-date.
  'yarn upgrade-interactive', // Interactively updates dependencies.
  'yarn up @*/* * --recursive', // Upgrades all dependencies, including workspace packages.
  'yarn dlx @yarnpkg/sdks vscode', // Updates Yarn's SDKs for VSCode.
  'yarn dedupe', // Deduplicates dependencies in the yarn.lock file.
  'yarn dlx syncpack@alpha lint --sort count', // Lints and sorts package.json files.
];

/**
 * Executes a shell command and streams its output to the parent process's stdio.
 *
 * @param {string} command - The command to execute.
 * @returns {Promise<void>} A promise that resolves if the command succeeds, and rejects if it fails.
 * @private
 */
function runCommand(command: string): Promise<void> {
  console.log(`\n\x1b[36m$ ${command}\x1b[0m`); // Log command in cyan
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, {
      stdio: 'inherit', // Connect the child process's stdio to the parent.
      cwd: process.cwd(), // Run in the current working directory.
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      }
      else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * The main function that orchestrates the execution of all maintenance commands.
 * @private
 */
async function main() {
  console.log('🚀 Starting project maintenance script...');
  for (const command of commands) {
    try {
      await runCommand(command);
    }
    catch (error) {
      console.error(`\x1b[31mFailed to execute command: ${command}\x1b[0m`);
      process.exit(1);
    }
  }
  console.log('\n✅ All tasks completed successfully!');
}

// Start the maintenance process.
main();
