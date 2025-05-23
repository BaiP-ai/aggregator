#!/usr/bin/env node

/**
 * Test Astro Build Process
 * Verifies that files in public/ get copied to dist/
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

async function testAstroBuild() {
  console.log('🧪 Testing Astro build process...');
  
  // Check if public directory exists
  const publicDir = path.join(projectRoot, 'public');
  try {
    await fs.access(publicDir);
    console.log('✅ public/ directory exists');
    
    // List contents
    const publicContents = await fs.readdir(publicDir, { recursive: true });
    console.log(`📁 Found ${publicContents.length} items in public/:`);
    publicContents.slice(0, 10).forEach(item => console.log(`  - ${item}`));
    
  } catch (error) {
    console.log('❌ public/ directory not found');
    return;
  }
  
  // Check if dist directory exists
  const distDir = path.join(projectRoot, 'dist');
  try {
    await fs.access(distDir);
    console.log('✅ dist/ directory exists');
    
    // Check for images/logos in dist
    const distLogosDir = path.join(distDir, 'images', 'logos');
    try {
      await fs.access(distLogosDir);
      const logoFiles = await fs.readdir(distLogosDir);
      console.log(`✅ Found ${logoFiles.length} logo files in dist/images/logos/`);
      logoFiles.slice(0, 5).forEach(file => console.log(`  - ${file}`));
    } catch (error) {
      console.log('❌ dist/images/logos/ not found');
      
      // Check what's in dist
      const distContents = await fs.readdir(distDir, { recursive: true });
      console.log('📁 Contents of dist/:');
      distContents.slice(0, 20).forEach(item => console.log(`  - ${item}`));
    }
    
  } catch (error) {
    console.log('❌ dist/ directory not found (run npm run build first)');
  }
}

testAstroBuild();