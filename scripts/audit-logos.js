#!/usr/bin/env node

/**
 * Logo Audit Script
 * Shows what logos exist vs what the data expects
 */

import { loadDataFromJsFile } from './utils/data-utils.js';
import { getCurrentLogos, generateLogoFilename } from './utils/logo-manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'src', 'data');

async function auditLogos() {
  try {
    console.log('🔍 Auditing logo files...');
    
    // Get current logos on disk
    const existingLogos = await getCurrentLogos();
    console.log(`\n📁 Found ${existingLogos.length} logo files on disk:`);
    existingLogos.forEach(logo => console.log(`  ✅ ${logo}`));
    
    // Load data and see what's expected
    const tools = await loadDataFromJsFile(path.join(dataPath, 'tools.js'));
    const agents = await loadDataFromJsFile(path.join(dataPath, 'agents.js'));
    const allCompanies = [...tools, ...agents];
    
    console.log(`\n🏢 Found ${allCompanies.length} companies in data`);
    
    // Check what each company expects
    const missingLogos = [];
    const hasLogos = [];
    const needsUpdate = [];
    
    for (const company of allCompanies) {
      if (!company.logo) {
        const expectedLogo = generateLogoFilename(company.name, company.id);
        needsUpdate.push({
          company: company.name,
          expected: expectedLogo,
          current: 'none'
        });
      } else {
        const logoFile = path.basename(company.logo);
        if (existingLogos.includes(logoFile)) {
          hasLogos.push({
            company: company.name,
            logo: logoFile
          });
        } else {
          missingLogos.push({
            company: company.name,
            expected: logoFile,
            current: 'missing'
          });
        }
      }
    }
    
    console.log(`\n✅ Companies with existing logos (${hasLogos.length}):`);
    hasLogos.forEach(item => console.log(`  ${item.company} → ${item.logo}`));
    
    console.log(`\n❌ Companies with missing logos (${missingLogos.length}):`);
    missingLogos.forEach(item => console.log(`  ${item.company} → expects ${item.expected}`));
    
    console.log(`\n⚠️  Companies without logo fields (${needsUpdate.length}):`);
    needsUpdate.forEach(item => console.log(`  ${item.company} → would use ${item.expected}`));
    
    // Check for unused logos
    const expectedLogoFiles = new Set();
    allCompanies.forEach(company => {
      if (company.logo) {
        expectedLogoFiles.add(path.basename(company.logo));
      }
    });
    
    const unusedLogos = existingLogos.filter(logo => 
      !expectedLogoFiles.has(logo) && logo !== 'placeholder.svg'
    );
    
    console.log(`\n🗑️  Potentially unused logos (${unusedLogos.length}):`);
    unusedLogos.forEach(logo => console.log(`  ${logo}`));
    
    console.log(`\n📊 Summary:`);
    console.log(`  • Total companies: ${allCompanies.length}`);
    console.log(`  • With existing logos: ${hasLogos.length}`);
    console.log(`  • With missing logos: ${missingLogos.length}`);
    console.log(`  • Without logo fields: ${needsUpdate.length}`);
    console.log(`  • Unused logo files: ${unusedLogos.length}`);
    
  } catch (error) {
    console.error('❌ Error during logo audit:', error);
    process.exit(1);
  }
}

auditLogos();