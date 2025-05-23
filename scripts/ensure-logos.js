#!/usr/bin/env node

/**
 * Ensure Logos Script
 * Checks if logos exist and downloads them if missing
 * Safe to run multiple times (idempotent)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDataFromJsFile } from './utils/data-utils.js';
import { processCompanyLogos } from './utils/logo-manager.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'src', 'data');
const logoDir = path.join(__dirname, '..', 'public', 'images', 'logos');

async function ensureLogos() {
  try {
    console.log('🔍 Checking if logos need to be downloaded...');
    
    // Check if logo directory exists
    try {
      await fs.access(logoDir);
      const logoFiles = await fs.readdir(logoDir);
      console.log(`📁 Found ${logoFiles.length} existing logo files`);
      
      // If we have a reasonable number of logos, skip download
      if (logoFiles.length > 10) {
        console.log('✅ Sufficient logos found, skipping download');
        return;
      }
    } catch (error) {
      console.log('📁 Logo directory does not exist, will create and download');
    }
    
    // Load data files
    console.log('📂 Loading data files...');
    const tools = await loadDataFromJsFile(path.join(dataPath, 'tools.js'));
    const agents = await loadDataFromJsFile(path.join(dataPath, 'agents.js'));
    
    console.log(`🏢 Found ${tools.length} tools and ${agents.length} agents`);
    
    // Download logos
    console.log('📥 Downloading missing logos...');
    await processCompanyLogos(tools, agents);
    
    console.log('✅ Logo check completed successfully');
    
  } catch (error) {
    console.error('❌ Error ensuring logos:', error);
    // Don't exit with error code - let the build continue
    console.log('⚠️  Continuing build without logos...');
  }
}

ensureLogos();