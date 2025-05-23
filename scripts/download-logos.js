#!/usr/bin/env node

/**
 * Logo Download Script for AI Aggregator
 * Downloads company logos to public/images/logos/
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Logo configurations
const logos = [
  {
    name: 'aws-ai.png',
    url: 'https://logo.clearbit.com/aws.amazon.com',
    fallback: 'https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQK.8c88ac215fe4e441dc42865dd6962ed4f444a90d.png'
  },
  {
    name: 'openai.png',
    url: 'https://logo.clearbit.com/openai.com',
    fallback: null
  },
  {
    name: 'crowdstrike.png',
    url: 'https://logo.clearbit.com/crowdstrike.com',
    fallback: null
  },
  {
    name: 'intercom.png',
    url: 'https://logo.clearbit.com/intercom.com',
    fallback: null
  },
  {
    name: 'datadog.png',
    url: 'https://logo.clearbit.com/datadoghq.com',
    fallback: null
  },
  {
    name: 'darktrace.png',
    url: 'https://logo.clearbit.com/darktrace.com',
    fallback: null
  }
];

// Target directory
const logosDir = path.join(__dirname, '..', 'public', 'images', 'logos');

// Ensure directory exists
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
  console.log('Created logos directory:', logosDir);
}
/**
 * Download a file from URL to local path
 */
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filePath, () => {}); // Delete the empty file
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (error) => {
      file.close();
      fs.unlink(filePath, () => {}); // Delete the empty file
      reject(error);
    });
  });
}

/**
 * Download logo with fallback option
 */
async function downloadLogo(logo) {
  const filePath = path.join(logosDir, logo.name);
  
  console.log(`Downloading ${logo.name}...`);
  
  try {
    // Try primary URL
    await downloadFile(logo.url, filePath);
    console.log(`✅ Successfully downloaded ${logo.name}`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to download ${logo.name} from primary URL: ${error.message}`);
    
    // Try fallback URL if available
    if (logo.fallback) {
      console.log(`🔄 Trying fallback URL for ${logo.name}...`);
      try {
        await downloadFile(logo.fallback, filePath);
        console.log(`✅ Successfully downloaded ${logo.name} from fallback`);
        return true;
      } catch (fallbackError) {
        console.log(`❌ Failed to download ${logo.name} from fallback: ${fallbackError.message}`);
      }
    }
    
    console.log(`⚠️  Skipping ${logo.name} - download failed`);
    return false;
  }
}
/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting logo download process...');
  console.log(`Target directory: ${logosDir}\n`);
  
  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  };
  
  // Check for --force flag
  const forceDownload = process.argv.includes('--force');
  
  for (const logo of logos) {
    const filePath = path.join(logosDir, logo.name);
    
    // Skip if file exists and not forcing
    if (fs.existsSync(filePath) && !forceDownload) {
      console.log(`⏭️  Skipping ${logo.name} - already exists (use --force to re-download)`);
      results.skipped++;
      continue;
    }
    
    const success = await downloadLogo(logo);
    if (success) {
      results.success++;
    } else {
      results.failed++;
    }
    
    // Add small delay between downloads to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Download Summary:');
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`📁 Logos directory: ${logosDir}`);
}

// Run the script
main().catch(console.error);

export { downloadLogo, logos };