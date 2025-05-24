#!/usr/bin/env node

/**
 * Build with Logos Script
 * Processes data and downloads logos, then runs standard Astro build
 * Astro automatically copies public/ folder to dist/ during build
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

async function buildWithLogos() {
  try {
    console.log('🚀 Starting build with complete data processing and logo management...');
    
    // Step 1: Process data and download logos
    console.log('📊 Processing data and downloading logos...');
    execSync('node scripts/fetch-data.js', { cwd: projectRoot, stdio: 'inherit' });
    execSync('node scripts/ensure-logo-fields.js', { cwd: projectRoot, stdio: 'inherit' });
    execSync('node scripts/process-data.js', { cwd: projectRoot, stdio: 'inherit' });
    execSync('node scripts/validate-data.js', { cwd: projectRoot, stdio: 'inherit' });
    
    // Step 2: Verify logos are in public directory before build
    const publicLogosDir = path.join(projectRoot, 'public', 'images', 'logos');
    
    try {
      const publicLogos = await fs.readdir(publicLogosDir);
      console.log(`✅ Found ${publicLogos.length} logos in public/images/logos/`);
      console.log(`📁 Sample logos: ${publicLogos.slice(0, 5).join(', ')}`);
    } catch (error) {
      console.warn('⚠️  No logos found in public/images/logos/ - ensuring directory exists');
      await fs.mkdir(publicLogosDir, { recursive: true });
      
      // Ensure placeholder exists
      const placeholderSrc = path.join(projectRoot, 'src', 'assets', 'placeholder.svg');
      const placeholderDest = path.join(publicLogosDir, 'placeholder.svg');
      
      try {
        await fs.copyFile(placeholderSrc, placeholderDest);
        console.log('✅ Placeholder logo copied to public/images/logos/');
      } catch (placeholderError) {
        console.warn('⚠️  Could not copy placeholder logo - creating basic SVG');
        const basicSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e5e7eb"/><text x="50" y="50" text-anchor="middle" dy=".35em" font-family="Arial" font-size="12" fill="#6b7280">Logo</text></svg>';
        await fs.writeFile(placeholderDest, basicSvg);
      }
    }
    
    // Step 3: Run standard Astro build (it will automatically copy public/ to dist/)
    console.log('📦 Building Astro site...');
    execSync('npm run build', { 
      cwd: projectRoot, 
      stdio: 'inherit',
      env: {
        ...process.env,
        BASE_URL: '/aggregator/',
        SITE: 'https://www.baip.ai',
        NODE_ENV: 'production'
      }
    });
    
    // Step 4: Verify the build output
    const distLogosDir = path.join(projectRoot, 'dist', 'images', 'logos');
    
    try {
      const distLogos = await fs.readdir(distLogosDir);
      console.log(`✅ Build completed successfully with ${distLogos.length} logos in dist/`);
    } catch (error) {
      console.error('❌ Logos not found in dist/ - this indicates Astro did not copy public/ folder properly');
      console.error('Error:', error.message);
      
      // List what's actually in dist
      try {
        const distContents = await fs.readdir(path.join(projectRoot, 'dist'));
        console.log('📁 Contents of dist/:', distContents);
      } catch (listError) {
        console.error('Could not list dist contents:', listError.message);
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildWithLogos();