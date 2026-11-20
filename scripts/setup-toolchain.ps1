# Deneyap Blok IDE - Toolchain Setup Script
# Bu betik, Deneyap Kart yerel derleyicisi için arduino-cli ve Deneyap ESP32 Core paketlerini indirir.

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $PSScriptRoot
$toolchainDir = Join-Path $rootDir "toolchain"
$binDir = Join-Path $toolchainDir "bin"
$dataDir = Join-Path $toolchainDir "data"
$cliExe = Join-Path $binDir "arduino-cli.exe"
$yamlConfig = Join-Path $toolchainDir "arduino-cli.yaml"

Write-Host "=== Deneyap Blok IDE Toolchain Kurulumu ===" -ForegroundColor Cyan

# 1. Klasörleri oluştur
New-Item -ItemType Directory -Path $binDir -Force | Out-Null
New-Item -ItemType Directory -Path $dataDir -Force | Out-Null

# 2. arduino-cli indir (eğer yoksa)
if (-not (Test-Path $cliExe)) {
    Write-Host "[1/4] arduino-cli indiriliyor..." -ForegroundColor Yellow
    $zipUrl = "https://github.com/arduino/arduino-cli/releases/download/v1.1.1/arduino-cli_1.1.1_Windows_64bit.zip"
    $zipPath = Join-Path $toolchainDir "arduino-cli.zip"
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath $binDir -Force
    Remove-Item $zipPath -Force
    Write-Host "[1/4] arduino-cli başarıyla kuruldu." -ForegroundColor Green
} else {
    Write-Host "[1/4] arduino-cli zaten mevcut." -ForegroundColor Green
}

# 3. Config dosyasını oluştur
$dataDirEscaped = $dataDir.Replace("\", "/")
$configContent = @"
board_manager:
  additional_urls:
    - https://raw.githubusercontent.com/deneyapkart/deneyapkart-arduino-core/master/package_deneyapkart_index.json
directories:
  data: "$dataDirEscaped"
library:
  enable_unsafe_install: true
"@
Set-Content -Path $yamlConfig -Value $configContent -Encoding UTF8

# 4. Deneyap Core indeksini güncelle
Write-Host "[2/4] Kart indeksleri güncelleniyor..." -ForegroundColor Yellow
& $cliExe core update-index --config-file $yamlConfig

# 5. deneyap:esp32 paketini kur
Write-Host "[3/4] Deneyap ESP32 Arduino Core kuruluyor (bu işlem birkaç dakika sürebilir)..." -ForegroundColor Yellow
& $cliExe core install deneyap:esp32 --config-file $yamlConfig

Write-Host "[4/4] Kurulum tamamlandı! Offline derleyici hazır." -ForegroundColor Green
