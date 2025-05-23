#!/usr/bin/env node

/**
 * Build with Logos Script
 * Combines Astro build with logo management to ensure logos are included
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

async function buildWithLogos() {
  try {
    console.log('🚀 Starting build with logo management...');
    
    // Step 1: Run Astro build
    console.log('📦 Building Astro site...');
    execSync('npm run build', { 
      cwd: projectRoot, 
      stdio: 'inherit',
      env: {
        ...process.env,
        BASE_URL: '/aggregator',
        SITE: 'https://www.baip.ai'
      }
    });
    
    // Step 2: Verify public logos exist
    const publicLogosDir = path.join(projectRoot, 'public', 'images', 'logos');
    const distLogosDir = path.join(projectRoot, 'dist', 'images', 'logos');
    
    try {
      const publicLogos = await fs.readdir(publicLogosDir);
      console.log(`✅ Found ${publicLogos.length} logos in public/images/logos/`);
      
      // Step 3: Ensure dist directory structure exists
      await fs.mkdir(path.dirname(distLogosDir), { recursive: true });
      
      // Step 4: Check if Astro copied the logos
      let distLogos = [];
      try {
        distLogos = await fs.readdir(distLogosDir);
        console.log(`📁 Found ${distLogos.length} logos in dist/images/logos/`);
      } catch (error) {
        console.log('📁 dist/images/logos/ directory does not exist, creating...');
        await fs.mkdir(distLogosDir, { recursive: true });
      }
      
      // Step 5: Copy logos if missing or incomplete
      if (distLogos.length < publicLogos.length) {
        console.log('🔧 Copying logos from public to dist...');
        
        for (const logo of publicLogos) {
          const sourcePath = path.join(publicLogosDir, logo);
          const destPath = path.join(distLogosDir, logo);
          
          try {
            await fs.copyFile(sourcePath, destPath);
            console.log(`  ✅ Copied ${logo}`);
          } catch (error) {
            console.error(`  ❌ Failed to copy ${logo}:`, error.message);
          }
        }
        
        // Verify final count
        const finalDistLogos = await fs.readdir(distLogosDir);
        console.log(`✅ Final logo count in dist: ${finalDistLogos.length}`);
      } else {
        console.log('✅ All logos already present in dist directory');
      }
      
    } catch (error) {
      console.warn('⚠️  No logos found in public/images/logos/, skipping logo copy');
    }
    
    // Step 6: Final verification
    try {
      const finalDistLogos = await fs.readdir(distLogosDir);
      console.log(`🎉 Build completed successfully with ${finalDistLogos.length} logos`);
    } catch (error) {
      console.warn('⚠️  Could not verify final logo count');
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildWithLogos();