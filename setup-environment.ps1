# Setup Environment Variables for React Native Development

Write-Host "Setting up Java and Android environment variables..." -ForegroundColor Green

# Find Java installation
$javaPath = $null
$possiblePaths = @(
    "C:\Program Files\Microsoft\jdk-17*",
    "C:\Program Files\Eclipse Adoptium\jdk-17*",
    "C:\Program Files\Java\jdk-17*",
    "C:\Program Files\OpenJDK\jdk-17*"
)

foreach ($path in $possiblePaths) {
    $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $javaPath = $found.FullName
        break
    }
}

if ($javaPath) {
    Write-Host "Found Java at: $javaPath" -ForegroundColor Yellow
    
    # Set JAVA_HOME
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, "User")
    $env:JAVA_HOME = $javaPath
    
    # Add Java to PATH
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    $javaBinPath = "$javaPath\bin"
    if ($currentPath -notlike "*$javaBinPath*") {
        [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$javaBinPath", "User")
        $env:PATH = "$env:PATH;$javaBinPath"
    }
    
    Write-Host "JAVA_HOME set to: $javaPath" -ForegroundColor Green
} else {
    Write-Host "Java not found. Installing..." -ForegroundColor Red
    winget install Microsoft.OpenJDK.17
}

# Setup Android SDK
$androidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (Test-Path $androidSdkPath) {
    Write-Host "Found Android SDK at: $androidSdkPath" -ForegroundColor Yellow
    
    # Set ANDROID_HOME
    [Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, "User")
    $env:ANDROID_HOME = $androidSdkPath
    
    # Add Android tools to PATH
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    $androidPaths = @(
        "$androidSdkPath\platform-tools",
        "$androidSdkPath\tools",
        "$androidSdkPath\tools\bin"
    )
    
    foreach ($androidPath in $androidPaths) {
        if ($currentPath -notlike "*$androidPath*") {
            [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$androidPath", "User")
            $env:PATH = "$env:PATH;$androidPath"
            $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        }
    }
    
    Write-Host "ANDROID_HOME set to: $androidSdkPath" -ForegroundColor Green
} else {
    Write-Host "Android SDK not found at $androidSdkPath" -ForegroundColor Yellow
    Write-Host "Please open Android Studio and install SDK" -ForegroundColor Yellow
}

# Test installations
Write-Host "`nTesting installations..." -ForegroundColor Cyan

Write-Host "Java version:" -ForegroundColor Yellow
try {
    & java -version
    Write-Host "✅ Java OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not working" -ForegroundColor Red
}

Write-Host "`nAndroid ADB:" -ForegroundColor Yellow
try {
    & adb version
    Write-Host "✅ ADB OK" -ForegroundColor Green
} catch {
    Write-Host "❌ ADB not working" -ForegroundColor Red
}

Write-Host "`nEnvironment setup complete!" -ForegroundColor Green
Write-Host "Please restart your terminal or IDE to use new environment variables." -ForegroundColor Yellow

# Display current environment
Write-Host "`nCurrent Environment Variables:" -ForegroundColor Cyan
Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor White
Write-Host "ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor White 