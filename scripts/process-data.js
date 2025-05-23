/**
 * Script to process the data files before site generation
 * 
 * This script:
 * 1. Loads the data files
 * 2. Performs any necessary transformations or enrichments
 * 3. Generates derived data
 * 4. Saves the processed data for use in site generation
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDataFromJsFile, saveDataToJsFile } from './utils/data-utils.js';
import { processCompanyLogos } from './utils/logo-manager.js';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'src', 'data');
const processedPath = path.join(__dirname, '..', 'src', 'data', 'processed');

async function loadData(filename) {
  try {
    const filePath = path.join(dataPath, filename);
    return await loadDataFromJsFile(filePath);
  } catch (error) {
    console.error(`Error loading data from ${filename}:`, error);
    return [];
  }
}

function generateFeaturedData(data) {
  const { tools, categories, agents } = data;
  
  // Generate featured tools (simple example - in real life, you might have a more complex algorithm)
  const featuredTools = tools
    .sort(() => 0.5 - Math.random()) // Simple shuffle
    .slice(0, 6);
  
  // Generate featured categories
  const featuredCategories = categories
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  
  // Generate featured agents
  const featuredAgents = agents
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  return {
    featuredTools,
    featuredCategories,
    featuredAgents
  };
}

function generateToolsByCategory(data) {
  const { tools, categories } = data;
  const toolsByCategory = {};
  
  // Group tools by category
  for (const category of categories) {
    toolsByCategory[category.id] = tools.filter(tool => tool.category === category.id);
    
    // Further group by subcategory
    const toolsBySubcategory = {};
    for (const subcategory of category.subcategories) {
      toolsBySubcategory[subcategory.id] = toolsByCategory[category.id]
        .filter(tool => tool.subcategory === subcategory.id);
    }
    
    toolsByCategory[`${category.id}_subcategories`] = toolsBySubcategory;
  }
  
  return toolsByCategory;
}

function generateAgentsByCategory(data) {
  const { agents } = data;
  const agentsByCategory = {};
  
  // Group agents by subcategory
  for (const agent of agents) {
    if (!agentsByCategory[agent.subcategory]) {
      agentsByCategory[agent.subcategory] = [];
    }
    agentsByCategory[agent.subcategory].push(agent);
  }
  
  return agentsByCategory;
}

async function saveProcessedData(filename, data) {
  try {
    const filePath = path.join(processedPath, filename);
    const exportName = filename.replace('.js', '');
    await saveDataToJsFile(filePath, exportName, data);
  } catch (error) {
    console.error(`Error saving processed data to ${filename}:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting data processing...');
    
    // Ensure processed data directory exists
    await fs.mkdir(processedPath, { recursive: true });
    
    // Load all data
    console.log('Loading data files...');
    const data = {
      tools: await loadData('tools.js'),
      categories: await loadData('categories.js'),
      agents: await loadData('agents.js')
    };
    
    // Process company logos (download new ones, clean up unused ones)
    console.log('Processing company logos...');
    try {
      await processCompanyLogos(data.tools, data.agents);
      console.log('✅ Logo processing completed successfully');
    } catch (error) {
      console.error('❌ Error during logo processing:', error);
      // Continue with data processing even if logo processing fails
    }
    
    // Save updated data with correct logo paths
    console.log('Saving updated data files...');
    await saveDataToJsFile(path.join(dataPath, 'tools.js'), 'tools', data.tools);
    await saveDataToJsFile(path.join(dataPath, 'agents.js'), 'agents', data.agents);
    console.log('✅ Data files saved successfully');
    
    // Generate processed data
    console.log('Generating processed data...');
    
    // Generate featured data
    const featured = generateFeaturedData(data);
    await saveProcessedData('featured.js', featured);
    
    // Generate tools by category
    const toolsByCategory = generateToolsByCategory(data);
    await saveProcessedData('toolsByCategory.js', toolsByCategory);
    
    // Generate agents by category
    const agentsByCategory = generateAgentsByCategory(data);
    await saveProcessedData('agentsByCategory.js', agentsByCategory);
    
    console.log('Data processing completed successfully');
  } catch (error) {
    console.error('Error in data processing:', error);
    process.exit(1);
  }
}

main();
