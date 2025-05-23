/**
 * Script to validate the data in the data directory
 * 
 * This script:
 * 1. Loads all data files
 * 2. Validates the data structure
 * 3. Checks for referential integrity
 * 4. Reports any issues
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDataFromJsFile } from './utils/data-utils.js';
import { normalizeLogoPath } from './utils/logo-manager.js';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'src', 'data');
const logoPath = path.join(__dirname, '..', 'public', 'images', 'logos');

// Data schemas - simple version for demonstration
const schemas = {
  tools: {
    required: ['id', 'name', 'description', 'category', 'subcategory'],
    optional: ['logo', 'url', 'tags', 'enterprise', 'pricing', 'useCases']
  },
  categories: {
    required: ['id', 'name', 'description', 'subcategories'],
    optional: ['icon']
  },
  agents: {
    required: ['id', 'name', 'description', 'category', 'subcategory', 'model', 'features'],
    optional: ['logo', 'implementation', 'useCases', 'demoPrompt']
  }
};

async function loadData(filename) {
  try {
    const filePath = path.join(dataPath, filename);
    return await loadDataFromJsFile(filePath);
  } catch (error) {
    console.error(`Error loading data from ${filename}:`, error);
    return [];
  }
}

function validateItem(item, schema, dataType) {
  const errors = [];
  
  // Check required fields
  for (const field of schema.required) {
    if (!item[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Check for unknown fields
  const allowedFields = [...schema.required, ...schema.optional];
  for (const field in item) {
    if (!allowedFields.includes(field)) {
      errors.push(`Unknown field: ${field}`);
    }
  }
  
  return errors;
}

function validateReferentialIntegrity(data) {
  const errors = [];
  const { tools, categories, agents } = data;
  
  // Create maps for quick lookups
  const categoryMap = new Map(categories.map(category => [category.id, category]));
  const subcategoryMap = new Map();
  
  // Build subcategory map
  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      subcategoryMap.set(`${category.id}:${subcategory.id}`, subcategory);
    }
  }
  
  // Validate tools
  for (const tool of tools) {
    // Check category exists
    if (!categoryMap.has(tool.category)) {
      errors.push(`Tool ${tool.id} references non-existent category: ${tool.category}`);
    }
    
    // Check subcategory exists
    if (!subcategoryMap.has(`${tool.category}:${tool.subcategory}`)) {
      errors.push(`Tool ${tool.id} references non-existent subcategory: ${tool.subcategory} in category ${tool.category}`);
    }
  }
  
  // Validate agents
  for (const agent of agents) {
    // Check category exists
    if (!categoryMap.has(agent.category)) {
      errors.push(`Agent ${agent.id} references non-existent category: ${agent.category}`);
    }
    
    // Check subcategory exists
    if (!subcategoryMap.has(`${agent.category}:${agent.subcategory}`)) {
      errors.push(`Agent ${agent.id} references non-existent subcategory: ${agent.subcategory} in category ${agent.category}`);
    }
  }
  
  return errors;
}

async function validateLogoFiles(data) {
  const warnings = [];
  const { tools, agents } = data;
  const allCompanies = [...tools, ...agents];
  
  console.log(`🔍 Checking logo files for ${allCompanies.length} companies...`);
  
  let missingCount = 0;
  let foundCount = 0;
  
  for (const company of allCompanies) {
    if (company.logo && company.logo !== 'images/logos/placeholder.svg') {
      // Normalize the path before checking
      const normalizedPath = normalizeLogoPath(company.logo);
      const logoFilePath = path.join(__dirname, '..', 'public', normalizedPath);
      
      try {
        await fs.access(logoFilePath);
        foundCount++;
      } catch (error) {
        missingCount++;
        warnings.push(`Missing logo file for ${company.name}: ${normalizedPath}`);
      }
    } else if (!company.logo) {
      warnings.push(`No logo specified for ${company.name}`);
    }
  }
  
  console.log(`📊 Logo file status: ${foundCount} found, ${missingCount} missing`);
  
  // Only return warnings if this is a production environment
  // In development, missing logos are expected until process-data runs
  if (process.env.NODE_ENV === 'production' && missingCount > 0) {
    return warnings;
  } else if (missingCount > 0) {
    console.log(`⚠️  ${missingCount} logo files missing (run 'npm run process-data' to download them)`);
    return []; // Return empty array so validation doesn't fail
  }
  
  return [];
}

async function main() {
  try {
    console.log('Starting data validation process...');
    
    // Load all data
    const data = {};
    const allErrors = [];
    
    for (const [dataType, schema] of Object.entries(schemas)) {
      const filename = `${dataType}.js`;
      console.log(`Loading ${filename}...`);
      
      data[dataType] = await loadData(filename);
      console.log(`Loaded ${data[dataType].length} items from ${filename}`);
      
      // Validate each item
      for (const item of data[dataType]) {
        const errors = validateItem(item, schema, dataType);
        if (errors.length > 0) {
          allErrors.push(`Issues with ${dataType} item ${item.id || 'unknown'}:`);
          errors.forEach(error => allErrors.push(`  - ${error}`));
        }
      }
    }
    
    // Check referential integrity
    const integrityErrors = validateReferentialIntegrity(data);
    allErrors.push(...integrityErrors);
    
    // Check logo files exist
    console.log('Validating logo files...');
    const logoErrors = await validateLogoFiles(data);
    allErrors.push(...logoErrors);
    
    // Report results
    if (allErrors.length > 0) {
      console.error('Data validation failed with the following errors:');
      allErrors.forEach(error => console.error(error));
      process.exit(1);
    } else {
      console.log('Data validation completed successfully with no errors');
    }
  } catch (error) {
    console.error('Error in validation process:', error);
    process.exit(1);
  }
}

main();
