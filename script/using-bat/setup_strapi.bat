@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM Set project name and admin credentials
set PROJECT_NAME=my-strapi-project
set ADMIN_EMAIL=admin@strapi.com
set ADMIN_PASSWORD=admin_password
set ADMIN_USERNAME=admin
set DB_TYPE=sqlite
set DB_NAME=strapi
set DB_USER=strapi_user
set DB_PASSWORD=strapi_password

REM Step 1: Create the Strapi project using npx (latest version)
echo Creating Strapi project: %PROJECT_NAME% with npx create-strapi-app...
npx create-strapi-app@latest %PROJECT_NAME% --quickstart

REM Step 2: Navigate into the project directory
cd %PROJECT_NAME%

REM Step 3: Update the database configuration if needed (SQLite or others)
if "%DB_TYPE%"=="postgres" (
    echo Configuring for PostgreSQL...
    powershell -Command "(Get-Content config\database.js) -replace 'client: ''sqlite''', 'client: ''postgres'''" | Set-Content config\database.js
    powershell -Command "(Get-Content config\database.js) -replace 'connection: { host: ''localhost'', port: 5432, database: ''strapi'' }', 'connection: { host: ''localhost'', port: 5432, database: ''%DB_NAME%'', user: ''%DB_USER%'', password: ''%DB_PASSWORD%'' }'" | Set-Content config\database.js
)

REM Step 4: Install all necessary project dependencies
echo Installing project dependencies...
npm install

REM Step 5: Start the Strapi server in the background
echo Starting Strapi server...
start /B npm run develop

REM Step 6: Wait for Strapi to initialize (wait 20 seconds before attempting registration)
echo Waiting for Strapi to initialize...
timeout /t 20

REM Step 7: Create the admin user automatically
echo Creating the admin user...

REM Use curl to send a POST request to create the admin user
curl -X POST http://localhost:1337/admin/auth/local/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"%ADMIN_USERNAME%\",\"email\":\"%ADMIN_EMAIL%\",\"password\":\"%ADMIN_PASSWORD%\"}"

REM Step 8: Log in with the admin user and get the JWT token
echo Logging in the admin user...

set LOGIN_RESPONSE=^
curl -X POST http://localhost:1337/admin/auth/local ^
  -H "Content-Type: application/json" ^
  -d "{\"identifier\":\"%ADMIN_EMAIL%\",\"password\":\"%ADMIN_PASSWORD%\"}"

REM Step 9: Extract the JWT token from the response
for /f "tokens=2 delims=:," %%a in ('echo !LOGIN_RESPONSE! ^| findstr /r /c:"jwt"') do set JWT_TOKEN=%%a
set JWT_TOKEN=!JWT_TOKEN:"=!

REM Step 10: Check if login was successful and display JWT token
if "!JWT_TOKEN!" NEQ "" (
    echo Login successful! JWT token: !JWT_TOKEN!
) else (
    echo Login failed. Please check the registration process.
)

REM Done
echo Setup complete!
pause
