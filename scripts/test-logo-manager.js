/**
 * Test the logo manager functionality
 */

import { 
  generateLogoFilename, 
  extractDomain,
  getCurrentLogos 
} from './utils/logo-manager.js';

// Test the utility functions
console.log('Testing logo manager utilities...');

// Test generateLogoFilename
const testNames = [
  { name: 'OpenAI', id: 'openai' },
  { name: 'Amazon Web Services', id: 'aws' },
  { name: 'Microsoft Azure AI', id: null },
  { name: 'Google Cloud AI', id: 'google-cloud-ai' }
];

console.log('\n📝 Testing logo filename generation:');
testNames.forEach(test => {
  const filename = generateLogoFilename(test.name, test.id);
  console.log(`  ${test.name} (${test.id || 'no id'}) → ${filename}`);
});

// Test extractDomain
const testCompanies = [
  { name: 'OpenAI', url: 'https://openai.com' },
  { name: 'Microsoft', url: 'https://www.microsoft.com' },
  { name: 'Invalid URL', url: 'not-a-url' },
  { name: 'DataDog Inc.', url: null }
];

console.log('\n🌐 Testing domain extraction:');
testCompanies.forEach(test => {
  const domain = extractDomain(test.url, test.name);
  console.log(`  ${test.name} (${test.url || 'no url'}) → ${domain}`);
});

// Test getCurrentLogos (if logo directory exists)
console.log('\n📁 Current logos in directory:');
try {
  const logos = await getCurrentLogos();
  if (logos.length > 0) {
    logos.forEach(logo => console.log(`  • ${logo}`));
  } else {
    console.log('  No logos found (directory may not exist yet)');
  }
} catch (error) {
  console.log('  Could not read logo directory:', error.message);
}

console.log('\n✅ Logo manager test completed!');