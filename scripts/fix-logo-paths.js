#!/usr/bin/env node

/**
 * Fix Logo Paths Script
 * Normalizes all logo paths in the data files to ensure consistency
 */

import { loadDataFromJsFile, saveDataToJsFile } from './utils/data-utils.js';
import { normalizeLogoPath } from './utils/logo-manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'src', 'data');

async function fixLogoPath(filename) {
  try {
    console.log(`📄 Processing ${filename}...`);
    
    const filePath = path.join(dataPath, filename);
    const data = await loadDataFromJsFile(filePath);
    
    let fixedCount = 0;
    
    for (const item of data) {
      if (item.logo) {
        const originalPath = item.logo;
        const normalizedPath = normalizeLogoPath(item.logo);
        
        if (originalPath !== normalizedPath) {
          item.logo = normalizedPath;
          fixedCount++;
          console.log(`  🔧 Fixed: ${item.name || item.id}: ${originalPath} → ${normalizedPath}`);
        }
      }
    }
    
    if (fixedCount > 0) {
      const exportName = filename.replace('.js', '');
      await saveDataToJsFile(filePath, exportName, data);
      console.log(`  ✅ Saved ${filename} with ${fixedCount} fixes`);
    } else {
      console.log(`  ✓ No fixes needed for ${filename}`);
    }
    
    return fixedCount;
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error);
    return 0;
  }
}

async function main() {
  try {
    console.log('🔧 Starting logo path normalization...');
    
    const files = ['tools.js', 'agents.js'];
    let totalFixes = 0;
    
    for (const filename of files) {
      const fixes = await fixLogoPath(filename);
      totalFixes += fixes;
    }
    
    console.log(`\n✅ Logo path normalization completed!`);
    console.log(`📊 Total paths fixed: ${totalFixes}`);
    
    if (totalFixes > 0) {
      console.log('\n💡 Recommendation: Run npm run process-data to regenerate processed files');
    }
    
  } catch (error) {
    console.error('❌ Error during logo path normalization:', error);
    process.exit(1);
  }
}

main();