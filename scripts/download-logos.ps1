# Logo Download Script for AI Aggregator
# Downloads company logos to public/images/logos/

param(
    [switch]$Force = $false,
    [switch]$Help = $false
)

if ($Help) {
    Write-Host "Logo Download Script for AI Aggregator" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage: .\download-logos.ps1 [-Force] [-Help]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Parameters:"
    Write-Host "  -Force    Re-download existing files"
    Write-Host "  -Help     Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\download-logos.ps1              # Download missing logos only"
    Write-Host "  .\download-logos.ps1 -Force       # Re-download all logos"
    exit 0
}

# Logo configurations
$logos = @(
    @{
        Name = "aws-ai.png"
        Url = "https://logo.clearbit.com/aws.amazon.com"
        Fallback = "https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQK.8c88ac215fe4e441dc42865dd6962ed4f444a90d.png"
    },
    @{
        Name = "openai.png"
        Url = "https://logo.clearbit.com/openai.com"
        Fallback = $null
    },
    @{
        Name = "crowdstrike.png"
        Url = "https://logo.clearbit.com/crowdstrike.com"
        Fallback = $null
    },
    @{
        Name = "intercom.png"
        Url = "https://logo.clearbit.com/intercom.com"
        Fallback = $null
    },
    @{
        Name = "datadog.png"
        Url = "https://logo.clearbit.com/datadoghq.com"
        Fallback = $null
    },
    @{
        Name = "darktrace.png"
        Url = "https://logo.clearbit.com/darktrace.com"
        Fallback = $null
    }
)

# Target directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$logosDir = Join-Path (Split-Path -Parent $scriptDir) "public\images\logos"

# Ensure directory exists
if (-not (Test-Path $logosDir)) {
    New-Item -ItemType Directory -Path $logosDir -Force | Out-Null
    Write-Host "Created logos directory: $logosDir" -ForegroundColor Green
}

# Download function
function Download-Logo {
    param(
        [hashtable]$Logo,
        [string]$LogosDir
    )
    
    $filePath = Join-Path $LogosDir $Logo.Name
    
    Write-Host "Downloading $($Logo.Name)..." -ForegroundColor Cyan
    
    try {
        # Try primary URL
        Invoke-WebRequest -Uri $Logo.Url -OutFile $filePath -ErrorAction Stop
        Write-Host "✅ Successfully downloaded $($Logo.Name)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to download $($Logo.Name) from primary URL: $($_.Exception.Message)" -ForegroundColor Red
        
        # Try fallback URL if available
        if ($Logo.Fallback) {
            Write-Host "🔄 Trying fallback URL for $($Logo.Name)..." -ForegroundColor Yellow
            try {
                Invoke-WebRequest -Uri $Logo.Fallback -OutFile $filePath -ErrorAction Stop
                Write-Host "✅ Successfully downloaded $($Logo.Name) from fallback" -ForegroundColor Green
                return $true
            }
            catch {
                Write-Host "❌ Failed to download $($Logo.Name) from fallback: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        Write-Host "⚠️  Skipping $($Logo.Name) - download failed" -ForegroundColor Yellow
        return $false
    }
}

# Main execution
Write-Host "🚀 Starting logo download process..." -ForegroundColor Green
Write-Host "Target directory: $logosDir" -ForegroundColor Gray
Write-Host ""

$results = @{
    Success = 0
    Failed = 0
    Skipped = 0
}

foreach ($logo in $logos) {
    $filePath = Join-Path $logosDir $logo.Name
    
    # Skip if file exists and not forcing
    if ((Test-Path $filePath) -and -not $Force) {
        Write-Host "⏭️  Skipping $($logo.Name) - already exists (use -Force to re-download)" -ForegroundColor Gray
        $results.Skipped++
        continue
    }
    
    $success = Download-Logo -Logo $logo -LogosDir $logosDir
    if ($success) {
        $results.Success++
    }
    else {
        $results.Failed++
    }
    
    # Add small delay between downloads
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "📊 Download Summary:" -ForegroundColor Green
Write-Host "✅ Successful: $($results.Success)" -ForegroundColor Green
Write-Host "❌ Failed: $($results.Failed)" -ForegroundColor Red
Write-Host "⏭️  Skipped: $($results.Skipped)" -ForegroundColor Gray
Write-Host "📁 Logos directory: $logosDir" -ForegroundColor Gray