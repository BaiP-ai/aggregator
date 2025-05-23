#!/usr/bin/env node

/**
 * Test Logo Directory Path
 * Verifies the logo directory path is correct
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Test the old path (wrong)
const oldLogoDir = path.join(__dirname, '..', 'public', 'images', 'logos');
console.log('❌ Old (wrong) path:', oldLogoDir);

// Test the new path (correct)
const newLogoDir = path.join(__dirname, '..', '..', 'public', 'images', 'logos');
console.log('✅ New (correct) path:', newLogoDir);

// Check if the correct directory exists
try {
  await fs.access(newLogoDir);
  console.log('✅ Correct logo directory exists');
  
  const files = await fs.readdir(newLogoDir);
  console.log(`📁 Found ${files.length} files in logo directory`);
  
} catch (error) {
  console.log('⚠️  Logo directory does not exist yet - will be created during processing');
}

// Show relative paths for clarity
console.log('\n📍 Path breakdown:');
console.log('  scripts/utils/ (current)');
console.log('  → ../ (goes to scripts/)');  
console.log('  → ../ (goes to project root)');
console.log('  → public/images/logos (final destination)');
