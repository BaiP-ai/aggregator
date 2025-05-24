
# Image Deployment Fix Documentation

## Problem Summary

The deployment workflow was not properly including downloaded logos in the final build because it was fighting against Astro's built-in behavior instead of working with it.

## Solution Overview

**Key Changes Made:**

1. **Added Astro cache directory configuration** (`cacheDir: './cache'`) for better caching
2. **Simplified deployment workflow** to use Astro's built-in `public/` → `dist/` copying
3. **Added GitHub Actions caching** for both logos and Astro build artifacts
4. **Removed redundant manual copying** since Astro handles this automatically
5. **Added comprehensive verification** steps to catch issues early

## How Astro Handles Static Assets

Astro automatically copies everything in the `public/` folder to `dist/` during build, untouched and unprocessed. This means:

- ✅ `public/images/logos/company.png` → `dist/images/logos/company.png`
- ✅ No manual copying needed
- ✅ Perfect for dynamic content like downloaded logos

## Updated Workflow

### 1. Data Processing & Logo Download
- `scripts/process-data.js` downloads logos to `public/images/logos/`
- GitHub Actions caches this directory to avoid re-downloading

### 2. Astro Build
- `npm run build` (standard Astro build)
- Astro automatically copies `public/` to `dist/`
- Additional caching for Astro build artifacts

### 3. Deployment
- `dist/` folder deployed to GitHub Pages
- Contains all logos copied by Astro

## Testing Locally

```bash
# Test the complete deployment process
npm run test-deployment

# Or run individual steps
npm run process-data
npm run build
```

## Best Practices for Future Development

### 1. Image Path Usage

**Always use the helper functions:**
```javascript
import { getAssetPath } from '../utils/paths.js';

// For any image in public folder
<img src={getAssetPath('/images/logos/company.png')} alt="Company Logo" />

// For company logos specifically
<img src={getAssetPath(company.logo)} alt={`${company.name} logo`} />
```

**Never use hardcoded paths:**
```javascript
// ❌ Don't do this
<img src="images/logos/company.png" />

// ❌ Don't do this
<img src="/aggregator/images/logos/company.png" />

// ✅ Do this instead
<img src={getAssetPath('/images/logos/company.png')} />
```

### 2. Error Handling for Images

Always include proper error handling for dynamic images:

```javascript
<img 
  src={getAssetPath(tool.logo)} 
  alt={`${tool.name} logo`} 
  onError={(e) => { e.target.src = getAssetPath('/images/logos/placeholder.svg'); }}
/>
```

### 3. Adding New Image Types

When adding new image types (not just logos):

1. Place them in appropriate `public/` subdirectories
2. Use `getAssetPath()` for all references
3. Always provide fallbacks for missing images
4. Update the caching strategy in `deploy.yml` if needed

### 4. Testing Deployment Locally

To test the deployment configuration locally:

```bash
# Build with production settings
npm run build-with-logos

# Serve the dist folder to verify paths work
npx serve dist
```

Check that:
- Images load correctly at `localhost:3000/aggregator/`
- All paths are properly prefixed with `/aggregator`
- Fallback images work when originals fail

## File Structure

```
public/
├── images/
│   └── logos/
│       ├── placeholder.svg      # Default fallback image
│       ├── company1.png         # Downloaded company logos
│       └── company2.png
└── ...

src/
├── utils/
│   ├── paths.js                 # Path handling utilities
│   └── image-utils.js           # Image-specific utilities
└── components/
    ├── ToolCard.jsx             # Uses getAssetPath()
    └── AgentCard.jsx

scripts/
├── utils/
│   └── logo-manager.js          # Logo downloading and management
├── build-with-logos.js          # Enhanced build script
└── process-data.js              # Data processing with logo handling
```

## Debugging Image Issues

### Common Issues and Solutions

1. **Images not loading in production:**
   - Check that `getAssetPath()` is used consistently
   - Verify base URL configuration in `astro.config.mjs`
   - Check browser network tab for 404 errors

2. **Images loading in dev but not production:**
   - Ensure paths don't hardcode the base URL
   - Use relative paths and let Astro handle base URL prefixing

3. **New logos not appearing:**
   - Check that the logo manager is running during deployment
   - Verify logos are being copied to `dist/images/logos/`
   - Check GitHub Actions logs for download failures

### Debugging Commands

```bash
# Check what logos exist in public
ls -la public/images/logos/

# Check what logos exist in dist after build
npm run build-with-logos
ls -la dist/images/logos/

# Test logo download process
npm run process-data

# Check image paths in built HTML
grep -r "images/logos" dist/
```

## GitHub Actions Cache Management

The deployment uses GitHub Actions cache with the following strategy:

- **Cache Key**: `logos-cache-${{ hashFiles('src/data/tools.js', 'src/data/agents.js') }}`
- **Restore Keys**: `logos-cache-`
- **Path**: `public/images/logos`

### Manually Clearing Cache

If you need to force re-download of all logos:

1. Go to your repository on GitHub
2. Navigate to "Actions" tab
3. Click "Caches" in the left sidebar
4. Delete the `logos-cache-*` entries

Or update the cache key in `deploy.yml` by adding a version suffix:

```yaml
key: logos-cache-v2-${{ hashFiles('src/data/tools.js', 'src/data/agents.js') }}
```

## Performance Considerations

### Current Optimizations

1. **Parallel Logo Downloads**: Limited to prevent rate limiting
2. **Caching**: Avoids re-downloading existing logos
3. **Timeout Protection**: 10-second timeout per logo download
4. **Fallback Strategy**: Multiple logo services attempted
5. **Placeholder Usage**: For AI agents and failed downloads

### Future Improvements

1. **Image Optimization**: Consider using Astro's Image component for automatic optimization
2. **CDN Integration**: Move logos to a CDN for faster loading
3. **WebP Conversion**: Convert PNG logos to WebP for better compression
4. **Lazy Loading**: Implement lazy loading for below-the-fold images

## Monitoring and Maintenance

### Regular Checks

1. **Monthly**: Review failed logo downloads in GitHub Actions logs
2. **Quarterly**: Audit unused logos and clean up
3. **When adding companies**: Verify logo downloads work correctly

### Metrics to Track

- Logo download success rate
- Cache hit rate
- Deployment time improvements
- Image loading performance

## Related Files

- `astro.config.mjs` - Base URL and build configuration
- `deploy.yml` - GitHub Actions workflow with caching
- `scripts/utils/logo-manager.js` - Logo download and management
- `src/utils/paths.js` - Path handling utilities
- `src/components/ToolCard.jsx` - Example component using logos
- `public/images/logos/placeholder.svg` - Default fallback image

---

## Changelog

### 2025-05-24
- ✅ Fixed base URL path handling for images
- ✅ Added GitHub Actions caching for logos
- ✅ Updated logo manager to handle deployment paths correctly
- ✅ Enhanced error handling in components
- ✅ Created comprehensive documentation
- ✅ Added placeholder SVG for fallbacks
- ✅ Updated deployment workflow for better verification
