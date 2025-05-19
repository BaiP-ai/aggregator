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

// Load environment variables
dotenv.config();

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'src', 'data');

// URLs for data sources - in a real implementation, these would be actual APIs
const DATA_SOURCES = {
  tools: 'https://api.example.com/ai-tools', // Replace with actual API endpoint
  categories: 'https://api.example.com/categories', // Replace with actual API endpoint
  agents: 'https://api.example.com/ai-agents', // Replace with actual API endpoint
};

async function fetchData(url) {
  try {
    console.log(`Fetching data from ${url}...`);
    // In a real implementation, this would make an actual API call
    // For now, we'll just return empty arrays to avoid errors
    
    // Uncomment this in a real implementation:
    // const response = await fetch(url, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.API_KEY}`
    //   }
    // });
    // const data = await response.json();
    // return data;
    
    return [];
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
}

async function updateDataFile(filename, newData, existingData) {
  try {
    // In a real implementation, merge existing data with new data
    // For now, we'll just keep the existing data to avoid losing it
    
    // For a real implementation, you would merge the data here
    // const mergedData = [...existingData, ...newData.filter(item => 
    //   !existingData.some(existing => existing.id === item.id)
    // )];
    
    const mergedData = existingData;
    
    // Write the updated data back to the file
    await fs.writeFile(
      path.join(dataPath, filename),
      `// This file is auto-generated - do not edit directly\nexport const ${filename.replace('.js', '')} = ${JSON.stringify(mergedData, null, 2)};\n`
    );
    
    console.log(`Updated ${filename} with ${mergedData.length} items`);
  } catch (error) {
    console.error(`Error updating data file ${filename}:`, error);
  }
}

async function readExistingData(filename) {
  try {
    // Just read the file directly and parse its contents
    // In a production environment, you'd want to use a more robust approach
    const filePath = path.join(dataPath, filename);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      // This is a hacky way to parse the JS export into a JSON object
      // In production, you'd use a proper JS parser or store data as JSON
      const dataStartIndex = fileContent.indexOf('[');
      const dataEndIndex = fileContent.lastIndexOf(']') + 1;
      const jsonData = fileContent.substring(dataStartIndex, dataEndIndex);
      
      return JSON.parse(jsonData);
    } catch (error) {
      // If file doesn't exist or can't be parsed, return empty array
      console.warn(`Warning: Could not read ${filename} - using empty array`);
      return [];
    }
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
