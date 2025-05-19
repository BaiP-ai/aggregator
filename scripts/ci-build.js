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
  // Only set DISABLE_API_CALLS to true if no API key is available
  DISABLE_API_CALLS: process.env.OPENAI_API_KEY ? 'false' : 'true'
};

// Log status (but not the actual key value)
if (process.env.OPENAI_API_KEY) {
  console.log('OPENAI_API_KEY is available from GitHub secrets');
} else {
  console.log('No OPENAI_API_KEY found - API calls will be disabled');
}

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
