#!/usr/bin/env node

/**
 * Test script to verify image deployment fixes
 * Run this script to check if image paths are properly configured
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

async function testImagePaths() {
  console.log('🧪 Testing image deployment configuration...\n');
  
  try {
    // Test 1: Check if placeholder exists
    const placeholderPath = path.join(projectRoot, 'public', 'images', 'logos', 'placeholder.svg');
    try {
      await fs.access(placeholderPath);
      console.log('✅ Placeholder SVG exists');
    } catch (error) {
      console.log('❌ Placeholder SVG missing');
    }
    
    // Test 2: Check Astro config
    const configPath = path.join(projectRoot, 'astro.config.mjs');
    const configContent = await fs.readFile(configPath, 'utf-8');
    
    if (configContent.includes("base: '/aggregator'")) {
      console.log('✅ Base URL configured correctly');
    } else {
      console.log('❌ Base URL configuration issue');
    }
    
    if (configContent.includes('assetsInlineLimit: 0')) {
      console.log('✅ Asset externalization configured');
    } else {
      console.log('⚠️  Asset externalization not configured');
    }
    
    // Test 3: Check if path utilities exist
    const pathUtilsPath = path.join(projectRoot, 'src', 'utils', 'paths.js');
    try {
      const pathUtilsContent = await fs.readFile(pathUtilsPath, 'utf-8');
      if (pathUtilsContent.includes('getAssetPath')) {
        console.log('✅ Path utilities configured correctly');
      } else {
        console.log('❌ Path utilities missing getAssetPath function');
      }
    } catch (error) {
      console.log('❌ Path utilities file missing');
    }
    
    // Test 4: Check if logo manager has correct path handling
    const logoManagerPath = path.join(projectRoot, 'scripts', 'utils', 'logo-manager.js');
    try {
      const logoManagerContent = await fs.readFile(logoManagerPath, 'utf-8');
      if (logoManagerContent.includes('return `/${cleanPath}`;')) {
        console.log('✅ Logo manager path handling updated');
      } else {
        console.log('❌ Logo manager path handling needs update');
      }
    } catch (error) {
      console.log('❌ Logo manager file missing');
    }
    
    // Test 5: Check if deploy.yml has caching
    const deployPath = path.join(projectRoot, 'deploy.yml');
    try {
      const deployContent = await fs.readFile(deployPath, 'utf-8');
      if (deployContent.includes('actions/cache@v4')) {
        console.log('✅ GitHub Actions caching configured');
      } else {
        console.log('❌ GitHub Actions caching missing');
      }
    } catch (error) {
      console.log('❌ Deploy.yml file missing');
    }
    
    // Test 6: Count existing logos
    const logosDir = path.join(projectRoot, 'public', 'images', 'logos');
    try {
      const logoFiles = await fs.readdir(logosDir);
      const imageFiles = logoFiles.filter(file => 
        file.endsWith('.png') || file.endsWith('.svg') || file.endsWith('.jpg')
      );
      console.log(`✅ Found ${imageFiles.length} logo files in public/images/logos/`);
      
      if (imageFiles.length > 0) {
        console.log(`   📁 Sample files: ${imageFiles.slice(0, 3).join(', ')}`);
      }
    } catch (error) {
      console.log('⚠️  No logos directory or files found');
    }
    
    console.log('\n📋 Summary:');
    console.log('- Placeholder SVG should exist for fallbacks');
    console.log('- Astro config should have base URL and asset settings');
    console.log('- Path utilities should handle base URL correctly');
    console.log('- Logo manager should generate paths with leading slashes');
    console.log('- Deploy workflow should include caching');
    console.log('- Logo files should be present in public/images/logos/');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Run "npm run build-with-logos" to test build process');
    console.log('2. Check dist/images/logos/ after build');
    console.log('3. Serve dist folder and verify images load at /aggregator/');
    console.log('4. Deploy to GitHub and check production site');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testImagePaths();
