#!/usr/bin/env node

/**
 * This script handles building for CI environments without API dependencies
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Starting CI build process without API dependencies...');
console.log('Current directory:', process.cwd());
console.log('Root directory:', rootDir);

// Set environment variables for the build
const buildEnv = {
  ...process.env,
  NODE_ENV: 'production',
  DISABLE_API_CALLS: 'true',
  OPENAI_API_KEY: 'dummy-key-for-build-process'
};

// Run the build
console.log('Running Astro build...');
try {
  execSync('npx astro build', { 
    stdio: 'inherit', 
    cwd: rootDir,
    env: buildEnv
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Error running build:', error);
  process.exit(1);
}
