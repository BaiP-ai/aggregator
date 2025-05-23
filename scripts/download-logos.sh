#!/bin/bash

# Logo Download Script for AI Aggregator (Bash)
# Downloads company logos to public/images/logos/

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOGO_DIR="$PROJECT_ROOT/public/images/logos"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Parse command line arguments
FORCE_DOWNLOAD=false
SHOW_HELP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE_DOWNLOAD=true
            shift
            ;;
        --help|-h)
            SHOW_HELP=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Show help if requested
if [ "$SHOW_HELP" = true ]; then
    echo -e "${GREEN}Logo Download Script for AI Aggregator${NC}"
    echo ""
    echo -e "${YELLOW}Usage: ./download-logos.sh [--force] [--help]${NC}"
    echo ""
    echo "Options:"
    echo "  --force, -f    Re-download existing files"
    echo "  --help, -h     Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./download-logos.sh              # Download missing logos only"
    echo "  ./download-logos.sh --force      # Re-download all logos"
    exit 0
fi

# Logo configurations (name|primary_url|fallback_url)
logos=(
    "aws-ai.png|https://logo.clearbit.com/aws.amazon.com|https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQK.8c88ac215fe4e441dc42865dd6962ed4f444a90d.png"
    "openai.png|https://logo.clearbit.com/openai.com|"
    "crowdstrike.png|https://logo.clearbit.com/crowdstrike.com|"
    "intercom.png|https://logo.clearbit.com/intercom.com|"
    "datadog.png|https://logo.clearbit.com/datadoghq.com|"
    "darktrace.png|https://logo.clearbit.com/darktrace.com|"
)

# Ensure directory exists
if [ ! -d "$LOGO_DIR" ]; then
    mkdir -p "$LOGO_DIR"
    echo -e "${GREEN}Created logos directory: $LOGO_DIR${NC}"
fi

# Function to download logo with fallback
download_logo() {
    local logo_config="$1"
    IFS='|' read -r filename primary_url fallback_url <<< "$logo_config"
    local file_path="$LOGO_DIR/$filename"
    
    echo -e "${CYAN}Downloading $filename...${NC}"
    
    # Try primary URL
    if curl -s -f -o "$file_path" "$primary_url" 2>/dev/null; then
        if [ -s "$file_path" ]; then
            echo -e "${GREEN}✅ Successfully downloaded $filename${NC}"
            return 0
        fi
    fi
    
    echo -e "${RED}❌ Failed to download $filename from primary URL${NC}"
    
    # Try fallback URL if available
    if [ -n "$fallback_url" ]; then
        echo -e "${YELLOW}🔄 Trying fallback URL for $filename...${NC}"
        if curl -s -f -o "$file_path" "$fallback_url" 2>/dev/null; then
            if [ -s "$file_path" ]; then
                echo -e "${GREEN}✅ Successfully downloaded $filename from fallback${NC}"
                return 0
            fi
        fi
        echo -e "${RED}❌ Failed to download $filename from fallback URL${NC}"
    fi
    
    echo -e "${YELLOW}⚠️  Skipping $filename - download failed${NC}"
    # Clean up empty file
    [ -f "$file_path" ] && rm -f "$file_path"
    return 1
}

# Main execution
echo -e "${GREEN}🚀 Starting logo download process...${NC}"
echo -e "${GRAY}Target directory: $LOGO_DIR${NC}"
echo ""

# Check for required commands
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is required but not installed.${NC}"
    exit 1
fi

# Counters
success_count=0
failed_count=0
skipped_count=0

# Process each logo
for logo_config in "${logos[@]}"; do
    IFS='|' read -r filename primary_url fallback_url <<< "$logo_config"
    file_path="$LOGO_DIR/$filename"
    
    # Skip if file exists and not forcing
    if [ -f "$file_path" ] && [ "$FORCE_DOWNLOAD" = false ]; then
        echo -e "${GRAY}⏭️  Skipping $filename - already exists (use --force to re-download)${NC}"
        ((skipped_count++))
        continue
    fi
    
    if download_logo "$logo_config"; then
        ((success_count++))
    else
        ((failed_count++))
    fi
    
    # Add small delay between downloads
    sleep 0.5
done

echo ""
echo -e "${GREEN}📊 Download Summary:${NC}"
echo -e "${GREEN}✅ Successful: $success_count${NC}"
echo -e "${RED}❌ Failed: $failed_count${NC}"
echo -e "${GRAY}⏭️  Skipped: $skipped_count${NC}"
echo -e "${GRAY}📁 Logos directory: $LOGO_DIR${NC}"

# List downloaded files
if [ -d "$LOGO_DIR" ] && [ "$(ls -A "$LOGO_DIR" 2>/dev/null)" ]; then
    echo ""
    echo -e "${GREEN}📋 Files in logos directory:${NC}"
    ls -la "$LOGO_DIR" | grep -E '\.(png|jpg|jpeg|svg)$' | awk '{printf "   %s (%s)\n", $9, $5}' || true
fi