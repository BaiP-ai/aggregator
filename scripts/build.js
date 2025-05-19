#!/usr/bin/env node

/**
 * This script handles process-data and site generation in a way that avoids 
 * OpenAI API key errors during the build process.
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Create a .env file with a dummy OpenAI API key if it doesn't exist
// This is only for the build process
try {
  const envPath = path.resolve(rootDir, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('Creating temporary .env file for build process...');
    fs.writeFileSync(envPath, 'OPENAI_API_KEY=dummy-key-for-build-process\n');
  }
} catch (error) {
  console.error('Error creating .env file:', error);
}

// Run process-data
console.log('Running process-data...');
try {
  execSync('node scripts/process-data.js', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('Error running process-data:', error);
  process.exit(1);
}

// Run astro build
console.log('Running astro build...');
try {
  execSync('astro build', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('Error running astro build:', error);
  process.exit(1);
}

console.log('Build completed successfully!');
