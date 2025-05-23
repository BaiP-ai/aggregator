/**
 * Logo Management Utilities
 * Handles downloading, cleanup, and management of company logos
 */

import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoDir = path.join(__dirname, '..', '..', 'public', 'images', 'logos');

/**
 * Normalize logo path to ensure consistency (no leading slash)
 */
function normalizeLogoPath(logoPath) {
  if (!logoPath) return 'images/logos/placeholder.svg';
  
  // Remove leading slash if present
  const cleanPath = logoPath.startsWith('/') ? logoPath.substring(1) : logoPath;
  
  // Ensure it starts with images/logos/
  if (!cleanPath.startsWith('images/logos/')) {
    return `images/logos/${cleanPath}`;
  }
  
  return cleanPath;
}

/**
 * Extract company domain from URL or name
 */
function extractDomain(url, name) {
  if (url && !url.startsWith('/')) {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch (error) {
      console.warn(`Invalid URL for ${name}: ${url}`);
    }
  }
  
  // For agents or companies without valid URLs, try to extract domain from name
  // For AI agents, we might want to use the underlying AI provider's domain
  if (name.toLowerCase().includes('openai') || name.toLowerCase().includes('gpt')) {
    return 'openai.com';
  } else if (name.toLowerCase().includes('anthropic') || name.toLowerCase().includes('claude')) {
    return 'anthropic.com';
  } else if (name.toLowerCase().includes('azure') || name.toLowerCase().includes('microsoft')) {
    return 'microsoft.com';
  } else if (name.toLowerCase().includes('aws') || name.toLowerCase().includes('amazon')) {
    return 'aws.amazon.com';
  } else if (name.toLowerCase().includes('google')) {
    return 'google.com';
  }
  
  // Fallback: try to guess domain from name
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/inc|corp|ltd|llc|ai|tech|technologies|agent|assistant/g, '');
  
  return `${cleanName}.com`;
}

/**
 * Generate logo filename from company name
 */
function generateLogoFilename(name, id) {
  // Use ID if available, otherwise clean the name
  const cleanId = id || name.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${cleanId}.png`;
}

/**
 * Download a logo from URL
 */
function downloadLogo(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', async () => {
          file.close();
          // Check if file was actually downloaded (not empty)
          try {
            const stats = await fs.stat(filePath);
            if (stats.size > 0) {
              resolve(true);
            } else {
              await fs.unlink(filePath).catch(() => {});
              reject(new Error('Downloaded file is empty'));
            }
          } catch (error) {
            reject(error);
          }
        });
        file.on('error', async (error) => {
          file.close();
          await fs.unlink(filePath).catch(() => {});
          reject(error);
        });
      } else {
        file.close();
        fs.unlink(filePath).catch(() => {});
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', async (error) => {
      file.close();
      await fs.unlink(filePath).catch(() => {});
      reject(error);
    });
  });
}

/**
 * Attempt to download logo with multiple sources
 */
async function downloadCompanyLogo(company) {
  const { name, url, id, category } = company;
  const logoFilename = generateLogoFilename(name, id);
  const logoPath = path.join(logoDir, logoFilename);
  
  // Check if logo already exists
  try {
    await fs.access(logoPath);
    console.log(`✓ Logo already exists for ${name}: ${logoFilename}`);
    return logoFilename;
  } catch (error) {
    // Logo doesn't exist, try to download it
  }
  
  // For AI agents, use placeholder - they don't represent real companies
  if (category === 'ai-agents' || name.toLowerCase().includes('agent')) {
    console.log(`🤖 Using placeholder for AI agent: ${name}`);
    return 'placeholder.svg';
  }
  
  const domain = extractDomain(url, name);
  const logoSources = [
    `https://logo.clearbit.com/${domain}`,
    `https://img.logo.dev/${domain}?token=pk_X-1ZO13GSgeODJjZPRnfwQ`, // Alternative service
    `https://logo.uplead.com/${domain}`,
  ];
  
  console.log(`📥 Downloading logo for ${name}...`);
  
  for (const [index, logoUrl] of logoSources.entries()) {
    try {
      await downloadLogo(logoUrl, logoPath);
      console.log(`✅ Successfully downloaded logo for ${name} from source ${index + 1}: ${logoFilename}`);
      return logoFilename;
    } catch (error) {
      console.log(`❌ Failed to download logo for ${name} from source ${index + 1}: ${error.message}`);
    }
  }
  
  console.log(`⚠️  Could not download logo for ${name}, will use placeholder`);
  return 'placeholder.svg';
}

/**
 * Get list of current logo files
 */
async function getCurrentLogos() {
  try {
    const files = await fs.readdir(logoDir);
    return files.filter(file => 
      file.endsWith('.png') || 
      file.endsWith('.jpg') || 
      file.endsWith('.jpeg') || 
      file.endsWith('.svg')
    );
  } catch (error) {
    console.error('Error reading logo directory:', error);
    return [];
  }
}

/**
 * Clean up logos that are no longer needed
 */
async function cleanupUnusedLogos(currentCompanies) {
  const currentLogos = await getCurrentLogos();
  const neededLogos = new Set();
  
  // Collect all logos that should exist
  for (const company of currentCompanies) {
    const logoFilename = generateLogoFilename(company.name, company.id);
    neededLogos.add(logoFilename);
    
    // Also keep the logo if it's explicitly referenced in the data
    if (company.logo && !company.logo.includes('placeholder')) {
      const referencedLogo = path.basename(company.logo);
      neededLogos.add(referencedLogo);
    }
  }
  
  // Always keep placeholder and common logos
  neededLogos.add('placeholder.svg');
  neededLogos.add('aws-ai.png');
  neededLogos.add('openai.png');
  neededLogos.add('crowdstrike.png');
  neededLogos.add('intercom.png');
  neededLogos.add('datadog.png');
  neededLogos.add('darktrace.png');
  
  // Remove logos that are no longer needed
  const logosToRemove = currentLogos.filter(logo => !neededLogos.has(logo));
  
  for (const logo of logosToRemove) {
    try {
      await fs.unlink(path.join(logoDir, logo));
      console.log(`🗑️  Removed unused logo: ${logo}`);
    } catch (error) {
      console.error(`Error removing logo ${logo}:`, error);
    }
  }
  
  return {
    kept: currentLogos.length - logosToRemove.length,
    removed: logosToRemove.length
  };
}

/**
 * Process logos for all companies in the dataset
 */
async function processCompanyLogos(tools, agents) {
  // Ensure logo directory exists
  await fs.mkdir(logoDir, { recursive: true });
  
  console.log('🖼️  Processing company logos...');
  console.log(`📁 Logo directory: ${logoDir}`);
  
  // Combine all companies (tools and agents)
  const allCompanies = [...tools, ...agents];
  const processedLogos = [];
  
  console.log(`🏢 Found ${allCompanies.length} companies to process`);
  
  // Process each company
  for (const company of allCompanies) {
    if (!company.name) {
      console.log(`⚠️  Skipping company with no name: ${JSON.stringify(company)}`);
      continue;
    }
    
    try {
      // First normalize any existing logo path
      if (company.logo) {
        const originalPath = company.logo;
        company.logo = normalizeLogoPath(company.logo);
        if (originalPath !== company.logo) {
          console.log(`🔧 Normalized path for ${company.name}: ${originalPath} → ${company.logo}`);
        }
      }
      
      const logoFilename = await downloadCompanyLogo(company);
      
      // Update the company object with the correct logo path
      company.logo = normalizeLogoPath(`images/logos/${logoFilename}`);
      processedLogos.push({
        company: company.name,
        logo: logoFilename,
        id: company.id
      });
      
      // Add small delay to be respectful to logo services
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error processing logo for ${company.name}:`, error);
      company.logo = normalizeLogoPath('images/logos/placeholder.svg');
    }
  }
  
  // Clean up unused logos
  const cleanupResult = await cleanupUnusedLogos(allCompanies);
  
  console.log(`📊 Logo processing summary:`);
  console.log(`   • Processed: ${processedLogos.length} companies`);
  console.log(`   • Logos kept: ${cleanupResult.kept}`);
  console.log(`   • Logos removed: ${cleanupResult.removed}`);
  
  return processedLogos;
}

export {
  processCompanyLogos,
  downloadCompanyLogo,
  cleanupUnusedLogos,
  generateLogoFilename,
  getCurrentLogos,
  extractDomain,
  normalizeLogoPath
};