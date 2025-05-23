#!/usr/bin/env node

/**
 * Logo Sync Script
 * Synchronizes company logos based on current data
 * Can be run independently to update logos without full data processing
 */

import { loadDataFromJsFile } from './utils/data-utils.js';
import { processCompanyLogos } from './utils/logo-manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'src', 'data');

async function main() {
  try {
    console.log('🔄 Starting logo synchronization...');
    
    // Load current data
    console.log('📂 Loading current data...');
    const tools = await loadDataFromJsFile(path.join(dataPath, 'tools.js'));
    const agents = await loadDataFromJsFile(path.join(dataPath, 'agents.js'));
    
    console.log(`Found ${tools.length} tools and ${agents.length} agents`);
    
    // Process logos
    const logoResults = await processCompanyLogos(tools, agents);
    
    console.log('✅ Logo synchronization completed successfully!');
    console.log(`📊 Summary: ${logoResults.length} company logos processed`);
    
  } catch (error) {
    console.error('❌ Error during logo synchronization:', error);
    process.exit(1);
  }
}

// Allow script to be run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}