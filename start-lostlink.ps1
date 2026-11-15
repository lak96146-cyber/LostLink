# LostLink — PowerShell Quick Startup Script
$Host.UI.RawUI.WindowTitle = "LostLink Platform Launcher"
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "             LOSTLINK — INTELLIGENT CAMPUS RECOVERY ECOSYSTEM                 " -ForegroundColor Yellow
Write-Host "              CGC University Jhanjeri, Mohali 3D Digital Twin                  " -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan

# Set environment paths if using portable toolchains
if (Test-Path "C:\Users\Hp\tools\jdk-21.0.6+7") {
    $env:JAVA_HOME = "C:\Users\Hp\tools\jdk-21.0.6+7"
    $env:Path = "$env:JAVA_HOME\bin;" + $env:Path
}
if (Test-Path "C:\Users\Hp\tools\apache-maven-3.9.9") {
    $env:M2_HOME = "C:\Users\Hp\tools\apache-maven-3.9.9"
    $env:Path = "$env:M2_HOME\bin;" + $env:Path
}
$env:MAVEN_OPTS = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"

Write-Host "`n[1/3] Checking environment..." -ForegroundColor White
$javaVer = java -version 2>&1 | Select-String "version"
$mvnVer = mvn -version 2>&1 | Select-String "Apache Maven"
$nodeVer = node -v 2>&1

Write-Host "  Java:   $javaVer" -ForegroundColor Green
Write-Host "  Maven:  $mvnVer" -ForegroundColor Green
Write-Host "  Node:   $nodeVer" -ForegroundColor Green

Write-Host "`n[2/3] Launching Spring Boot Backend on Port 8080..." -ForegroundColor White
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:JAVA_HOME = 'C:\Users\Hp\tools\jdk-21.0.6+7'; `$env:M2_HOME = 'C:\Users\Hp\tools\apache-maven-3.9.9'; `$env:Path = `"`$env:JAVA_HOME\bin;`$env:M2_HOME\bin;`$env:Path`"; `$env:MAVEN_OPTS = '-Djavax.net.ssl.trustStoreType=Windows-ROOT'; Set-Location backend; mvn spring-boot:run"

Write-Host "[3/3] Launching React Vite Frontend on Port 5173..." -ForegroundColor White
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm run dev"

Write-Host "`n==============================================================================" -ForegroundColor Green
Write-Host " LostLink services are launching in background windows!" -ForegroundColor Green
Write-Host " Frontend URL: http://localhost:5173" -ForegroundColor Yellow
Write-Host " Backend API:  http://localhost:8080/api" -ForegroundColor Yellow
Write-Host " Demo Logins:" -ForegroundColor White
Write-Host "   Admin:   admin@cgc.edu.in / Admin@123" -ForegroundColor Cyan
Write-Host "   Student: aarav.sharma@cgc.edu.in / Student@123" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Green
