# Builds the external library and creates the zip to upload in the ODC Portal.
# Run from the external-logic folder:  .\build.ps1

$ErrorActionPreference = "Stop"
$project = Join-Path $PSScriptRoot "LiveKitConnector"
$dist    = Join-Path $PSScriptRoot "dist"
$publish = Join-Path $dist "publish"
$zip     = Join-Path $dist "LiveKitConnector.zip"

if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
Remove-Item (Join-Path $project "bin") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $project "obj") -Recurse -Force -ErrorAction SilentlyContinue

dotnet publish $project -c Release -o $publish
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }

# Files must be at the root of the zip
Compress-Archive -Path (Join-Path $publish "*") -DestinationPath $zip -Force
Write-Host "Created: $zip"
