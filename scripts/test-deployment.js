_URL: '/aggregator/',
        SITE: 'https://www.baip.ai',
        NODE_ENV: 'production'
      }
    });
    
    // Step 5: Verify dist output
    console.log('🔍 Verifying build output...');
    const distDir = path.join(projectRoot, 'dist');
    const distLogosDir = path.join(distDir, 'images', 'logos');
    
    // Check if dist exists
    try {
      await fs.access(distDir);
      console.log('✅ dist directory exists');
    } catch (error) {
      console.error('❌ dist directory not found!');
      throw new Error('Build failed - no dist directory');
    }
    
    // Check if logos were copied to dist
    try {
      const distLogos = await fs.readdir(distLogosDir);
      console.log(`✅ Found ${distLogos.length} logos in dist/images/logos/`);
      
      if (distLogos.length !== logoCount) {
        console.warn(`⚠️  Logo count mismatch: ${logoCount} in public, ${distLogos.length} in dist`);
      } else {
        console.log('✅ Logo counts match between public and dist');
      }
      
      // Sample the files
      if (distLogos.length > 0) {
        console.log(`📁 Sample dist files: ${distLogos.slice(0, 3).join(', ')}`);
      }
      
    } catch (error) {
      console.error('❌ No logos found in dist/images/logos/');
      
      // List what's actually in dist
      try {
        const distContents = await fs.readdir(distDir);
        console.log('📁 Contents of dist/:', distContents);
        
        // Check for images directory
        if (distContents.includes('images')) {
          const imagesContents = await fs.readdir(path.join(distDir, 'images'));
          console.log('📁 Contents of dist/images/:', imagesContents);
        }
      } catch (listError) {
        console.error('Could not list dist contents:', listError.message);
      }
      
      throw new Error('Logos not properly deployed to dist');
    }
    
    // Step 6: Verify HTML files reference correct paths
    console.log('🔍 Checking HTML files for correct image paths...');
    try {
      const htmlFiles = await findHtmlFiles(distDir);
      let pathIssues = 0;
      
      for (const htmlFile of htmlFiles.slice(0, 3)) { // Check first 3 HTML files
        const content = await fs.readFile(htmlFile, 'utf8');
        
        // Check for incorrect paths
        const incorrectPaths = [
          /src="images\//g,           // Missing base path
          /src="\/images\//g,         // Missing base path
          /src="public\/images\//g    // Should not reference public
        ];
        
        for (const pattern of incorrectPaths) {
          const matches = content.match(pattern);
          if (matches) {
            console.warn(`⚠️  Found ${matches.length} incorrect image paths in ${path.basename(htmlFile)}`);
            pathIssues += matches.length;
          }
        }
      }
      
      if (pathIssues === 0) {
        console.log('✅ No incorrect image paths found in HTML files');
      } else {
        console.warn(`⚠️  Found ${pathIssues} total path issues`);
      }
      
    } catch (error) {
      console.warn('⚠️  Could not check HTML paths:', error.message);
    }
    
    console.log('🎉 Deployment test completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   • Logos in public: ${logoCount}`);
    
    try {
      const finalDistLogos = await fs.readdir(distLogosDir);
      console.log(`   • Logos in dist: ${finalDistLogos.length}`);
    } catch (error) {
      console.log('   • Logos in dist: 0 (ERROR)');
    }
    
    console.log('   • Build: ✅ Success');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Commit and push changes');
    console.log('   2. Check GitHub Actions deployment');
    console.log('   3. Verify site at https://www.baip.ai/aggregator/');
    
  } catch (error) {
    console.error('❌ Deployment test failed:', error.message);
    process.exit(1);
  }
}

async function findHtmlFiles(dir) {
  const htmlFiles = [];
  
  async function searchDir(currentDir) {
    const items = await fs.readdir(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        await searchDir(fullPath);
      } else if (item.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  }
  
  await searchDir(dir);
  return htmlFiles;
}

testDeployment();