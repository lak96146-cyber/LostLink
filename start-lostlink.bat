@echo off
title LostLink — Campus Recovery Ecosystem + CampusVerse 3D
cls
echo ==============================================================================
echo              LOSTLINK — INTELLIGENT CAMPUS RECOVERY ECOSYSTEM
echo               CGC University Jhanjeri, Mohali 3D Digital Twin
echo ==============================================================================
echo.

REM Configure Java 21 and Maven paths if portable installation exists
if exist "C:\Users\Hp\tools\jdk-21.0.6+7" (
    set "JAVA_HOME=C:\Users\Hp\tools\jdk-21.0.6+7"
    set "PATH=C:\Users\Hp\tools\jdk-21.0.6+7\bin;%PATH%"
)
if exist "C:\Users\Hp\tools\apache-maven-3.9.9" (
    set "M2_HOME=C:\Users\Hp\tools\apache-maven-3.9.9"
    set "PATH=C:\Users\Hp\tools\apache-maven-3.9.9\bin;%PATH%"
)
set "MAVEN_OPTS=-Djavax.net.ssl.trustStoreType=Windows-ROOT"

echo [1/3] Verifying environment dependencies...
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Java 21 is not detected in PATH.
    pause
    exit /b 1
)

mvn -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Apache Maven is not detected in PATH.
    pause
    exit /b 1
)

node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not detected in PATH.
    pause
    exit /b 1
)

echo [OK] Java, Maven, and Node.js verified.
echo.

echo [2/3] Starting Spring Boot Backend (Port 8080)...
start "LostLink Backend [Port 8080]" cmd /k "cd backend && set MAVEN_OPTS=-Djavax.net.ssl.trustStoreType=Windows-ROOT && mvn spring-boot:run"

echo [3/3] Starting React + Vite Frontend (Port 5173)...
start "LostLink Frontend [Port 5173]" cmd /k "cd frontend && npm run dev"

echo.
echo ==============================================================================
echo  LostLink services are launching!
echo  
echo  Frontend Application: http://localhost:5173
echo  Backend REST API:     http://localhost:8080/api
echo  
echo  Pre-Seeded Demo Accounts:
echo    - Guardian / Admin:  admin@cgc.edu.in         / Admin@123
echo    - Student 1 (Aarav): aarav.sharma@cgc.edu.in  / Student@123
echo    - Student 2 (Diya):  diya.patel@cgc.edu.in    / Student@123
echo    - Student 3 (Rohan): rohan.verma@cgc.edu.in   / Student@123
echo  
echo  To stop all services, run stop-lostlink.bat
echo ==============================================================================
echo.
pause
