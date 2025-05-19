/**
 * Utility functions for data handling
 */
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Loads data from a JavaScript module export file
 * @param {string} filePath - Full path to the JavaScript file
 * @returns {Promise<Array>} - Parsed data array
 */
export async function loadDataFromJsFile(filePath) {
  try {
    // Read the file content
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Use a more robust regex approach to extract the array data
    const regex = /export\s+const\s+\w+\s*=\s*(\[[\s\S]*?\]);/;
    const match = content.match(regex);
    
    if (!match || !match[1]) {
      console.warn(`Warning: Could not parse data from ${path.basename(filePath)}`);
      return [];
    }
    
    // Use Function constructor to safely evaluate the JSON array
    // This is safer than eval() while still allowing us to parse the JavaScript array syntax
    const dataFunc = new Function(`return ${match[1]}`);
    return dataFunc();
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`Warning: File not found ${path.basename(filePath)}`);
      return [];
    }
    console.error(`Error loading data from ${path.basename(filePath)}:`, error);
    return [];
  }
}

/**
 * Saves data to a JavaScript module export file
 * @param {string} filePath - Full path to the JavaScript file
 * @param {string} exportName - The name of the exported constant
 * @param {Array|Object} data - The data to save
 * @returns {Promise<void>}
 */
export async function saveDataToJsFile(filePath, exportName, data) {
  try {
    const content = `// This file is auto-generated - do not edit directly
export const ${exportName} = ${JSON.stringify(data, null, 2)};
`;
    await fs.writeFile(filePath, content, 'utf-8');
    
    console.log(`Successfully saved data to ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error saving data to ${path.basename(filePath)}:`, error);
    throw error;
  }
}
