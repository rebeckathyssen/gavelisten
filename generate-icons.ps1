# PowerShell script to generate PWA icons from logo.png
# This script uses ImageMagick to resize the logo to various sizes
# If you don't have ImageMagick, you can:
# 1. Install it: winget install ImageMagick.ImageMagick
# 2. Or use an online tool like https://www.pwabuilder.com/imageGenerator

$logo = "public\logo.png"
$outputDir = "public\icons"

# Check if ImageMagick is installed
$magickInstalled = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickInstalled) {
    Write-Host "ImageMagick is not installed." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Install ImageMagick" -ForegroundColor Cyan
    Write-Host "  Run: winget install ImageMagick.ImageMagick" -ForegroundColor White
    Write-Host "  Then run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Use online tool" -ForegroundColor Cyan
    Write-Host "  Visit: https://www.pwabuilder.com/imageGenerator" -ForegroundColor White
    Write-Host "  Upload your logo.png and download the generated icons" -ForegroundColor White
    Write-Host "  Extract them to the public/icons folder" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Icon sizes needed for PWA
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "Generating PWA icons from $logo..." -ForegroundColor Green

foreach ($size in $sizes) {
    $output = "$outputDir\icon-${size}x${size}.png"
    Write-Host "  Creating ${size}x${size}..." -ForegroundColor Cyan
    
    magick convert $logo -resize "${size}x${size}" -background none -gravity center -extent "${size}x${size}" $output
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    Created $output" -ForegroundColor Green
    } else {
        Write-Host "    Failed to create $output" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Icon generation complete!" -ForegroundColor Green
Write-Host "Icons are in the $outputDir folder" -ForegroundColor Cyan
