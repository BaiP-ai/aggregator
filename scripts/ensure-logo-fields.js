#!/usr/bin/env node

/**
 * Ensure Logo Fields Script
 * Adds placeholder logo fields to companies that don't have them
 */

import { loadDataFromJsFile, saveDataToJsFile } from './utils/data-utils.js';
import { generateLogoFilename } from './utils/logo-manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'src', 'data');

async function ensureLogoFields() {
  try {
    console.log('🔧 Ensuring logo fields exist...');
    
    // Process tools
    const toolsPath = path.join(dataPath, 'tools.js');
    const tools = await loadDataFromJsFile(toolsPath);
    
    let toolsUpdated = 0;
    for (const tool of tools) {
      if (!tool.logo) {
        tool.logo = `images/logos/${generateLogoFilename(tool.name, tool.id)}`;
        toolsUpdated++;
      }
    }
    
    if (toolsUpdated > 0) {
      await saveDataToJsFile(toolsPath, 'tools', tools);
      console.log(`✅ Added logo fields to ${toolsUpdated} tools`);
    }
    
    // Process agents
    const agentsPath = path.join(dataPath, 'agents.js');
    const agents = await loadDataFromJsFile(agentsPath);
    
    let agentsUpdated = 0;
    for (const agent of agents) {
      if (!agent.logo) {
        agent.logo = `images/logos/${generateLogoFilename(agent.name, agent.id)}`;
        agentsUpdated++;
      }
    }
    
    if (agentsUpdated > 0) {
      await saveDataToJsFile(agentsPath, 'agents', agents);
      console.log(`✅ Added logo fields to ${agentsUpdated} agents`);
    }
    
    console.log('✅ Logo field initialization completed');
    
  } catch (error) {
    console.error('❌ Error ensuring logo fields:', error);
    process.exit(1);
  }
}

ensureLogoFields();