# Logo Management

This directory contains scripts to manage company logos for the AI Aggregator.

## Quick Start

### Using npm scripts (Recommended)
```bash
# Download missing logos only
npm run download-logos

# Force re-download all logos
npm run download-logos:force
```

### Using Node.js directly
```bash
# Download missing logos only
node scripts/download-logos.js

# Force re-download all logos
node scripts/download-logos.js --force
```

### Using PowerShell (Windows)
```powershell
# Download missing logos only
.\scripts\download-logos.ps1

# Force re-download all logos
.\scripts\download-logos.ps1 -Force

# Show help
.\scripts\download-logos.ps1 -Help
```

### Using Bash (Linux/macOS/WSL)
```bash
# Download missing logos only
./scripts/download-logos.sh

# Force re-download all logos
./scripts/download-logos.sh --force

# Show help
./scripts/download-logos.sh --help
```

## Current Logo List

The following company logos are managed by this system:

- **aws-ai.png** - Amazon Web Services AI/ML
- **openai.png** - OpenAI 
- **crowdstrike.png** - CrowdStrike
- **intercom.png** - Intercom
- **datadog.png** - Datadog
- **darktrace.png** - Darktrace

## Logo Sources

Logos are sourced from:
1. **Primary**: Clearbit Logo API (`logo.clearbit.com`)
2. **Fallback**: Company official logo URLs (where available)

## File Structure

```
public/images/logos/
├── aws-ai.png
├── openai.png
├── crowdstrike.png
├── intercom.png
├── datadog.png
├── darktrace.png
└── placeholder.svg
```

## Adding New Logos

To add a new logo:

1. Edit `scripts/download-logos.js`
2. Add a new entry to the `logos` array:
   ```javascript
   {
     name: 'company-name.png',
     url: 'https://logo.clearbit.com/company.com',
     fallback: 'https://company.com/logo.png' // optional
   }
   ```
3. Run the download script: `npm run download-logos`

## Notes

- Script includes a 500ms delay between downloads to be respectful to servers
- Existing files are skipped unless `--force` is used
- Failed downloads are logged but don't stop the process
- All logos are saved as PNG files for consistency