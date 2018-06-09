@echo off
goto script
--------------------------------------
This script does:
  - Downloading modules for webpack
  - Assembling client in production mode
  - Creating a symbolic link between the assembled client and 
  the extension folder

[!] To create a symbolic link, you may need elevated privileges
--------------------------------------
:script

SET root=%CD%
echo Web Corrector Ext. initialization script
echo Root: %root%
echo.

cd client
echo Downloading modules for webpack...
cmd /C npm install

echo.
echo Assembling client in production mode...
cmd /C npm run build

echo.
echo Creating a symbolic link between the assembled client and the extension folder...
cd ../
mklink /D "%root%/extension/dist" "%root%/client/dist"

pause