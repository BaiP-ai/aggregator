/**
 * Script to fetch data from various sources and update the AI tools database
 * 
 * This script:
 * 1. Fetches data from configured API endpoints
 * 2. Transforms the data into the correct format
 * 3. Saves the data to the data directory
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { loadDataFromJsFile, saveDataToJsFile } from './utils/data-utils.js';

// Load environment variables
dotenv.config();

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'src', 'data');

// URLs for data sources - these are placeholders until real APIs are implemented
// Keep these as examples for future implementation
const DATA_SOURCES = {
  tools: 'https://api.example.com/ai-tools', // Replace with actual API endpoint when available
  categories: 'https://api.example.com/categories', // Replace with actual API endpoint when available
  agents: 'https://api.example.com/ai-agents', // Replace with actual API endpoint when available
};

// Flag to indicate whether to use mock data or attempt API calls
// This should be set to true until real APIs are implemented
const USE_MOCK_DATA = true;

async function fetchData(url) {
  try {
    console.log(`Processing data source: ${url}...`);
    
    // If USE_MOCK_DATA is true or DISABLE_API_CALLS is set, use mock data
    if (USE_MOCK_DATA || process.env.DISABLE_API_CALLS === 'true') {
      console.log('Using mock data (no API call made)');
      
      // Return empty array as mock data
      // In a real implementation, you might want to return some sample data
      // or use OpenAI to generate mock data for development
      return [];
    }
    
    // This code will only run when real APIs are implemented and USE_MOCK_DATA is false
    console.log('Attempting real API call...');
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error processing data from ${url}:`, error);
    return [];
  }
}

async function updateDataFile(filename, newData, existingData) {
  try {
    // Merge existing data with new data, using id as the unique identifier
    const mergedData = [...existingData];
    
    // Add or update items from newData
    for (const item of newData) {
      const existingIndex = mergedData.findIndex(existing => existing.id === item.id);
      
      if (existingIndex >= 0) {
        // Update existing item
        mergedData[existingIndex] = { ...mergedData[existingIndex], ...item };
      } else {
        // Add new item
        mergedData.push(item);
      }
    }
    
    // Write the updated data back to the file
    const exportName = filename.replace('.js', '');
    await saveDataToJsFile(path.join(dataPath, filename), exportName, mergedData);
    
    console.log(`Updated ${filename} with ${mergedData.length} items (${newData.length} new/updated)`);
    return mergedData;
  } catch (error) {
    console.error(`Error updating data file ${filename}:`, error);
    return existingData;
  }
}

async function readExistingData(filename) {
  try {
    const filePath = path.join(dataPath, filename);
    return await loadDataFromJsFile(filePath);
  } catch (error) {
    console.error(`Error reading existing data from ${filename}:`, error);
    return [];
  }
}

async function main() {
  try {
    console.log('Starting data fetch process...');
    
    // Ensure data directory exists
    await fs.mkdir(dataPath, { recursive: true });
    
    // Process each data source
    for (const [key, url] of Object.entries(DATA_SOURCES)) {
      const filename = `${key}.js`;
      
      // Read existing data
      const existingData = await readExistingData(filename);
      console.log(`Found ${existingData.length} existing items in ${filename}`);
      
      // Fetch new data
      const newData = await fetchData(url);
      console.log(`Fetched ${newData.length} new items from ${url}`);
      
      // Update data file
      await updateDataFile(filename, newData, existingData);
    }
    
    console.log('Data fetch process completed successfully');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main();
